import { test, expect, Page } from '@playwright/test';

const usuario = {
  username: `testuser_${Date.now().toString().slice(-6)}`,
  password: 'Password123',
};

// El backend de DemoBlaze tarda unos segundos en propagar una cuenta
// recién registrada; sin reintento, el login desde un contexto nuevo
// (como usa Playwright entre tests) falla intermitentemente aunque
// el registro haya sido exitoso. Reintentar es más confiable que
// una espera fija.
async function loginConReintento(
  page: Page, username: string, password: string, intentos = 5
) {
  for (let i = 0; i < intentos; i++) {
    await page.locator('#navbarExample')
      .getByRole('link', { name: 'Log in', exact: true }).click();
    await page.waitForSelector('#logInModal', { state: 'visible' });
    await page.locator('#loginusername').fill(username);
    await page.locator('#loginpassword').fill(password);
    await page.locator('#logInModal')
      .getByRole('button', { name: 'Log in' }).click();

    try {
      await page.waitForSelector('#nameofuser', {
        state: 'visible', timeout: 4000 });
      return;
    } catch {
      console.log(`Login intento ${i + 1}/${intentos} sin éxito todavía, reintentando...`);
      await page.waitForTimeout(1500);
    }
  }
  throw new Error(`No se pudo iniciar sesión con ${username} tras ${intentos} intentos`);
}

test.describe('Clase 04 - Flujo completo de usuario en DemoBlaze', () => {

  test('Registrar un nuevo usuario', async ({ page }) => {
    await page.goto('/');
    await page.locator('#navbarExample')
      .getByRole('link', { name: 'Sign up', exact: true }).click();
    await page.waitForSelector('#signInModal', { state: 'visible' });

    await page.locator('#sign-username').fill(usuario.username);
    await page.locator('#sign-password').fill(usuario.password);
    await page.locator('#signInModal')
      .screenshot({ path: './evidencias/registro-llenado.png' });

    // El handler se registra ANTES del clic que dispara el alert
    const dialogPromise = new Promise<void>((resolve) => {
      page.once('dialog', async (dialog) => {
        console.log(`Alert dice: ${dialog.message()}`);
        await dialog.accept();
        resolve();
      });
    });
    await page.locator('#signInModal')
      .getByRole('button', { name: 'Sign up' }).click();
    await dialogPromise;
    console.log(`Usuario ${usuario.username} registrado`);
  });

  test('Login con el usuario registrado', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      console.log(`Dialog: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.goto('/');
    await loginConReintento(page, usuario.username, usuario.password);

    const nombreUsuario = await page.locator('#nameofuser').textContent();
    expect(nombreUsuario).toContain(usuario.username);
    console.log(`Login exitoso como: ${nombreUsuario}`);
  });

  test('Flujo completo: login -> agregar producto -> verificar carrito', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.goto('/');
    await loginConReintento(page, usuario.username, usuario.password);

    await page.waitForSelector('.card-title a');
    const primerProducto = page.locator('.card-title a').first();
    const nombreProducto = await primerProducto.textContent();
    await primerProducto.click();

    await page.waitForLoadState('domcontentloaded');

    // Agregar al carrito también escribe en el backend y tarda en propagarse
    await page.getByText('Add to cart').click();
    await page.waitForTimeout(2000);

    await page.locator('#navbarExample')
      .getByRole('link', { name: 'Cart', exact: true }).click();
    await page.waitForURL('**/cart.html');
    await page.waitForTimeout(1500);

    const itemsCarrito = page.locator('#tbodyid tr');
    const cantidadItems = await itemsCarrito.count();

    expect(cantidadItems).toBeGreaterThanOrEqual(1);
    console.log(`Flujo completo exitoso. Producto "${nombreProducto}" en carrito.`);
    console.log(`Items en carrito: ${cantidadItems}`);

    await page.screenshot({
      path: './evidencias/carrito-con-producto.png', fullPage: true });
  });

  test('Intentar login con credenciales incorrectas',
    async ({ page }) => {
      await page.goto('/');
      await page.locator('#navbarExample')
        .getByRole('link', { name: 'Log in', exact: true }).click();
      await page.waitForSelector('#logInModal', { state: 'visible' });
      await page.locator('#loginusername').fill('usuario_que_no_existe');
      await page.locator('#loginpassword').fill('password_incorrecta');
      const dialogPromise = new Promise<string>((resolve) => {
        page.once('dialog', async (dialog) => {
          await dialog.accept();
          resolve(dialog.message());
        });
      });

      // (continuación) enviar el formulario y verificar el resultado
      await page.locator('#logInModal')
        .getByRole('button', { name: 'Log in' }).click();
      const mensajeAlert = await dialogPromise;

      expect(mensajeAlert).toBeTruthy();
      console.log(`Error mostrado: ${mensajeAlert}`);

      const usuarioLogueado = page.locator('#nameofuser');
      await expect(usuarioLogueado).not.toBeVisible();
    });

  test('Reto 1 - Formulario Place Order con fill()', async ({ page }) => {
    page.on('dialog', async (dialog) => { await dialog.accept(); });

    await page.goto('/');
    await page.waitForSelector('.card-title a');
    await page.locator('.card-title a').first().click();
    await page.getByText('Add to cart').click();
    await page.waitForTimeout(2000);

    await page.locator('#navbarExample')
      .getByRole('link', { name: 'Cart', exact: true }).click();
    await page.waitForURL('**/cart.html');
    await page.getByRole('button', { name: 'Place Order' }).click();
    await page.waitForSelector('#orderModal', { state: 'visible' });

    await page.locator('#name').fill('Ana Prueba');
    await page.locator('#country').fill('Guatemala');
    await page.locator('#city').fill('Guatemala City');
    await page.locator('#card').fill('4111111111111111');

    await expect(page.locator('#name')).toHaveValue('Ana Prueba');
    await expect(page.locator('#orderModal')
      .getByRole('button', { name: 'Purchase' })).toBeVisible();
    await expect(page.locator('#orderModal')
      .getByRole('button', { name: 'Purchase' })).toBeEnabled();
  });

  test('Reto 2 - Cerrar el modal de login', async ({ page }) => {
    await page.goto('/');
    await page.locator('#navbarExample')
      .getByRole('link', { name: 'Log in', exact: true }).click();
    await page.waitForSelector('#logInModal', { state: 'visible' });

    await page.locator('#logInModal')
      .getByRole('button', { name: 'Close' }).last().click();

    await expect(page.locator('#logInModal')).toBeHidden();
  });

  test('Reto 3 - Llenar un campo y borrarlo con clear()', async ({ page }) => {
    await page.goto('/');
    await page.locator('#navbarExample')
      .getByRole('link', { name: 'Log in', exact: true }).click();
    await page.waitForSelector('#logInModal', { state: 'visible' });

    const campo = page.locator('#loginusername');
    await campo.fill('texto temporal');
    expect(await campo.inputValue()).toBe('texto temporal');

    await campo.clear();
    expect(await campo.inputValue()).toBe('');
  });

});
