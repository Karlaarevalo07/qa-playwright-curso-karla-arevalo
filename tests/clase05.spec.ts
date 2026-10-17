import { test, expect } from '@playwright/test';

test.describe('Clase 05 - Assertions y técnicas de diseño de pruebas en Sauce Demo', () => {

  // ───────── Sección A: clases de equivalencia y valores en la frontera ─────────

  test('CE válida: login con credenciales correctas',
    async ({ page }) => {
      await page.goto('https://www.saucedemo.com');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();

      // Assertion: debemos llegar al inventario
      await expect(page).toHaveURL(/inventory/);
      await expect(page.locator('.inventory_container'))
        .toBeVisible();

      console.log('CE válida: login exitoso');
    });

  test('CE inválida: usuario no existe', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('usuario_inexistente');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Assertion: debe aparecer mensaje de error
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg)
      .toContainText('Username and password do not match');

    // Assertion: NO debemos haber navegado al inventario
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('CE inválida: usuario bloqueado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('locked out');

    console.log('CE usuario bloqueado: mensaje correcto mostrado');
  });

  test('Valor en frontera: campos vacíos (frontera de longitud mínima)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // No llenar nada y hacer clic
    await page.locator('#login-button').click();

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Username is required');

    console.log('Valor frontera: campo vacío maneja error correctamente');
  });

  // ───────── Sección B: inventario ─────────

  test('Verificar que el inventario tiene exactamente 6 productos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    // Contar productos con assertion exacta
    const productos = page.locator('.inventory_item');
    await expect(productos).toHaveCount(6);

    console.log('El inventario tiene exactamente 6 productos');
  });

  test('Verificar precio del primer producto con regex',
    async ({ page }) => {
      await page.goto('https://www.saucedemo.com');
      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();
      await expect(page).toHaveURL(/inventory/);

      const textoPrecio = await page.locator('.inventory_item_price')
        .first().textContent();

      // El regex valida el formato $XX.XX (p.ej. $29.99)
      expect(textoPrecio?.trim()).toMatch(/^\$\d+\.\d{2}$/);
    });

  test('Verificar atributos y estados de los elementos del inventario', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const primerBoton = page.locator('.btn_inventory').first();
    await expect(primerBoton).toBeEnabled();
    await expect(primerBoton).toHaveText('Add to cart');

    // (continuación) clic y verificar que cambió a 'Remove'
    await primerBoton.click();
    await expect(primerBoton).toHaveText('Remove');

    // Verificar que el carrito muestra 1 item
    const badgeCarrito = page.locator('.shopping_cart_badge');
    await expect(badgeCarrito).toBeVisible();
    await expect(badgeCarrito).toHaveText('1');

    console.log('El botón cambia de estado y el carrito se actualiza');
  });

  // ───────── Sección C: soft assertions ─────────

  test('Verificar múltiples propiedades del primer producto con soft assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const primerProducto = page.locator('.inventory_item').first();

    // Con soft assertions, si una falla, las demás siguen
    await expect.soft(primerProducto.locator('.inventory_item_name'))
      .toBeVisible();
    await expect.soft(primerProducto.locator('.inventory_item_desc'))
      .toBeVisible();
    await expect.soft(primerProducto.locator('.inventory_item_price'))
      .toBeVisible();
    await expect.soft(primerProducto.locator('.btn_inventory'))
      .toBeEnabled();
    await expect.soft(primerProducto.locator('img')).toBeVisible();

    console.log('Soft assertions del primer producto completadas');
  });

  // ───────── Sección D: tabla de decisión ─────────

  test('Tabla de decisión - Regla 1: logueado con items -> puede pagar', async ({ page }) => {
    // Login
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Agregar item
    await page.locator('.btn_inventory').first().click();

    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);

    // Debe existir el botón de checkout
    const btnCheckout = page.getByText('Checkout');
    await expect(btnCheckout).toBeVisible();
    await expect(btnCheckout).toBeEnabled();
  });

  test('Tabla de decisión - Regla 2: logueado sin items → carrito vacío', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Ir al carrito sin agregar nada
    await page.locator('.shopping_cart_link').click();

    // El carrito debe estar vacío
    const itemsCarrito = page.locator('.cart_item');
    await expect(itemsCarrito).toHaveCount(0);
  });

  // ───────── Tests reto (Tarea 05): assertions no vistas en clase ─────────
  // Versión de referencia para estudiar; sin ejecutar contra el sitio real
  // al momento de escribirla (ver README, sección "Qué verificar tú").

  // Reto 1: toHaveValue() sobre el <select> de orden.
  test('Reto 1 - toHaveValue: ordenar por precio y verificar el value', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const orden = page.locator('[data-test="product-sort-container"]');
    await orden.selectOption('lohi');

    // El <select> debe quedar con el value 'lohi'
    await expect(orden).toHaveValue('lohi');
    // Y el primer precio debe ser el más barato del catálogo
    await expect(page.locator('.inventory_item_price').first())
      .toHaveText('$7.99');
  });

  // Reto 2: toBeFocused() tras hacer clic en el campo.
  test('Reto 2 - toBeFocused: el campo de usuario recibe el foco', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    const usuario = page.locator('#user-name');
    await usuario.click();

    await expect(usuario).toBeFocused();
  });

  // Reto 3: toHaveCSS() sobre una propiedad de estilo computada.
  test('Reto 3 - toHaveCSS: el botón Add to cart tiene cursor pointer', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    await expect(page.locator('.btn_inventory').first())
      .toHaveCSS('cursor', 'pointer');
  });

});
