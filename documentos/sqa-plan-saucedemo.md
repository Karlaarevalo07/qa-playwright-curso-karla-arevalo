# SQA Plan mínimo – Sauce Demo


- **Propósito:** se debe verificar que las funciones críticas de Sauce Demo (login, inventario, carrito y checkout) siguan funcionando antes de cada entrega.
- **Alcance:** se prueba login, inventario, carrito, checkout y logout. 
- **Herramientas:** Playwright + TypeScript, ejecutado en Chromium, con reporte HTML y evidencias en `evidencias/`.
- **Criterios de salida:** 100 % de los tests críticos (login, inventario, checkout) en verde, tanto en paralelo como en secuencial.
