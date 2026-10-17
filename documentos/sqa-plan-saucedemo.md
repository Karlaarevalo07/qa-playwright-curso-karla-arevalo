# SQA Plan mínimo – Sauce Demo

> Borrador de referencia. Ajústalo con tus propias palabras (una oración por punto basta).

- **Propósito:** verificar que las funciones críticas de Sauce Demo (login, inventario, carrito y checkout) siguen funcionando antes de cada entrega.
- **Alcance:** se prueba login, inventario, carrito, checkout y logout. No se prueba rendimiento bajo carga, seguridad ni compatibilidad con dispositivos reales.
- **Herramientas:** Playwright + TypeScript, ejecutado en Chromium, con reporte HTML y evidencias en `evidencias/`.
- **Criterios de salida:** 100 % de los tests críticos (login, inventario, checkout) en verde, tanto en paralelo como en secuencial.
