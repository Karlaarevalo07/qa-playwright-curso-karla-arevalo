# Tarea 9 – Fixtures y tests parametrizados (Sauce Demo)

## Qué hice
- Corrí el laboratorio de la Clase 9 (`tests/clase09.spec.ts`, 9 tests): 3 con fixtures, 3 de login parametrizado y 3 de productos parametrizados.
- Resolví los tres retos de `tests/tarea09.spec.ts` (5 tests).
- Las fixtures están en `fixtures/index.ts`.

## Resultados (Chromium)
| Corrida | Resultado | Tiempo |
|---|---|---|
| Lab (`clase09.spec.ts`) | 9 passed | 21.0 s |
| Tarea (`tarea09.spec.ts`) | 5 passed | 8.1 s |

En el reto 1 se imprimió `[cronómetro] el test tardó 1393 ms`.
Evidencias en `evidencias/`: `clase09.txt` y `tarea09.txt`.

## Retos de la tarea
- **Reto 1 – Fixture con teardown:** mide cuánto tarda el test. Lo que va después del `use()` se ejecuta al terminar el test y ahí se imprime el tiempo.
- **Reto 2 – Fixture de alcance worker:** un contador que sube a 1 en el primer test y a 2 en el segundo. Esto muestra que la fixture vive todo el worker y no se recrea en cada test.
- **Reto 3 – Viewport:** el mismo test del inventario se ejecuta en móvil (375x667) y en escritorio (1280x800).

## Qué aprendí
- **Fixtures:** preparan lo que necesita cada test (por ejemplo, una sesión ya iniciada) y se piden como parámetros, sin repetir el código de preparación.
- **Alcance de una fixture:** por test (lo normal) o por worker (se comparte entre tests del mismo worker).
- **Tests parametrizados:** un array de datos y un loop generan un test por cada elemento. Se ahorra código duplicado.

## Preguntas de discusión
- **¿Cuántas líneas ahorra el loop?** Un solo test escrito genera tres. Sin el loop serían tres tests casi iguales.
- **¿Qué pasa si agrego un cuarto usuario al array?** Se crea un test nuevo automáticamente, sin escribir más código.
- **¿Cómo leería los datos desde un CSV?** Leería el archivo con `fs.readFileSync`, lo convertiría a un array de objetos (por ejemplo con `csv-parse`) y usaría el mismo loop.
