# Aseguramiento de la Calidad del Software

Proyecto de pruebas automatizadas con Playwright y TypeScript para el curso de Aseguramiento de la Calidad del Software (UMG).

## Cómo correr el proyecto

Requisitos: Node.js 18 o superior y Git.

```bash
npm install
npx playwright install
```

Para correr un archivo de pruebas solo en Chromium:

```bash
npx playwright test tests/clase04.spec.ts --project=chromium
```

## Clase 4: Principios de pruebas y Actions (DemoBlaze)

Archivo: `tests/clase04.spec.ts`. Prueba el flujo de un usuario en DemoBlaze: registro, login, agregar un producto al carrito y login con credenciales incorrectas. Además incluye tres pruebas extra: llenar el formulario Place Order con `fill()`, cerrar el modal de login y borrar un campo con `clear()`.

Resultado: 7 pruebas pasaron.

Evidencias:

- Formulario de registro lleno: [registro-llenado.png](evidencias/registro-llenado.png)
- Carrito con el producto agregado: [carrito-con-producto.png](evidencias/carrito-con-producto.png)

Reflexión de la tarea: [tareas/tarea-04.md](tareas/tarea-04.md)
