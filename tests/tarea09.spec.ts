import { test as base, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

/**
 * Tarea 09 - Tests reto: fixtures avanzados
 *   Reto 1: fixture con teardown real (código después de use())
 *   Reto 2: fixture de alcance worker (estado que persiste entre tests)
 *   Reto 3: test.use({ viewport }) + parametrización con un loop
 */

// ───────────────────────── Reto 1: teardown real ─────────────────────────
// Lo que va ANTES de use() es el setup; lo que va DESPUÉS es el teardown y
// corre al terminar el test, incluso si el test falla.
const testConCronometro = base.extend<{ cronometro: { inicio: number } }>({
  cronometro: async ({}, use) => {
    const inicio = Date.now();      // setup: arranca el cronómetro
    await use({ inicio });          // aquí corre el test
    const duracion = Date.now() - inicio;   // teardown
    console.log(`[cronómetro] el test tardó ${duracion} ms`);
  },
});

testConCronometro('Reto 1 - Fixture con teardown: mide cuánto tarda el test',
  async ({ page, cronometro }) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
    expect(cronometro.inicio).toBeGreaterThan(0);
  });

// ───────────────────────── Reto 2: fixture de worker ─────────────────────────
// Con { scope: 'worker' } la fixture se crea UNA vez por worker y su estado
// persiste entre los tests que ese worker ejecuta. El modo serial garantiza
// que ambos tests corran en orden y en el mismo worker.
const testConContador = base.extend<{}, { contador: { valor: number } }>({
  contador: [async ({}, use) => {
    await use({ valor: 0 });
  }, { scope: 'worker' }],
});

testConContador.describe('Reto 2 - Fixture de alcance worker', () => {
  testConContador.describe.configure({ mode: 'serial' });

  testConContador('El contador sube a 1', async ({ contador }) => {
    contador.valor++;
    expect(contador.valor).toBe(1);
  });

  testConContador('El contador sigue vivo y sube a 2', async ({ contador }) => {
    contador.valor++;
    expect(contador.valor).toBe(2);
  });
});

// ───────────────────────── Reto 3: test.use + loop ─────────────────────────
// Un mismo test corre en dos tamaños de pantalla: se genera un describe por
// viewport y en cada uno test.use() fija el tamaño.
const viewports = [
  { nombre: 'móvil', size: { width: 375, height: 667 } },
  { nombre: 'escritorio', size: { width: 1280, height: 800 } },
];

for (const vp of viewports) {
  base.describe(`Reto 3 - viewport ${vp.nombre}`, () => {
    base.use({ viewport: vp.size });

    base(`El inventario se ve en ${vp.nombre} (${vp.size.width}x${vp.size.height})`,
      async ({ page }) => {
        await loginAs(page, 'standard_user');
        await expect(page.locator('.inventory_item').first()).toBeVisible();

        const tamano = page.viewportSize();
        expect(tamano?.width).toBe(vp.size.width);
      });
  });
}
