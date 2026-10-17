import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../helpers/auth';

/**
 * Tarea 08 - Tests reto: hooks y suites avanzados
 *   Reto 1: modo serial + una page compartida creada en beforeAll
 *   Reto 2: test.slow()
 *   Reto 3: test.skip() dinámico (condición evaluada dentro del test)
 */

// Reto 1: en modo serial los tests corren en orden y, si uno falla, los
// siguientes se omiten. Pero serial NO comparte la page: cada test recibe una
// nueva. Para compartirla se crea una page propia en beforeAll y se reutiliza.
test.describe('Reto 1 - Suite serial con página compartida', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Paso 1: el inventario está cargado', async () => {
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('Paso 2: agregar un producto (misma sesión del paso 1)', async () => {
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Paso 3: el carrito conserva el producto del paso 2', async () => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
});

// Reto 2: test.slow() triplica el timeout SOLO de este test, en vez de
// depender del margen global de 30 s.
test('Reto 2 - Usuario con lentitud artificial marcado como slow', async ({ page }) => {
  test.slow();

  const inicio = Date.now();
  await loginAs(page, 'performance_glitch_user');
  console.log(`Login del usuario glitch: ${Date.now() - inicio} ms`);

  await expect(page).toHaveURL(/inventory/);
});

// Reto 3: test.skip(condición, razón) dentro del cuerpo del test omite el
// test en tiempo de ejecución, según algo que solo se sabe una vez que la
// página cargó. Aquí: si el catálogo no trae los 6 productos esperados, no
// tiene sentido seguir y se documenta la razón.
test('Reto 3 - Omitir en tiempo de ejecución según el estado real', async ({ page }) => {
  await loginAs(page, 'standard_user');

  const cantidad = await page.locator('.inventory_item').count();
  test.skip(cantidad !== 6,
    `El catálogo trae ${cantidad} productos y este test asume exactamente 6`);

  await expect(page.locator('.inventory_item_name').first()).toBeVisible();
});
