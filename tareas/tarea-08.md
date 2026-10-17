# Tarea 8 – Hooks y suites (Sauce Demo)

## Qué hice
- Corrí el laboratorio de la Clase 8 (`tests/clase08.spec.ts`, 7 tests) en paralelo y en secuencial.
- Resolví los tres retos de `tests/tarea08.spec.ts` (5 tests).
- Revisé y ajusté el SQA Plan mínimo en `documentos/sqa-plan-saucedemo.md`.

## Resultados (Chromium)
| Corrida | Resultado | Tiempo |
|---|---|---|
| Lab en paralelo (`--workers=4`) | 7 passed | 13.8 s |
| Lab en secuencial (`--workers=1`) | 7 passed | 21.3 s |
| Tarea 8 (3 retos) | 5 passed | 11.5 s |

Evidencias en `evidencias/`: `clase08-paralelo.txt`, `clase08-secuencial.txt` y `tarea08.txt`.

## Qué aprendí
- **Hooks:** `beforeEach` y `afterEach` preparan y limpian cada test; `beforeAll` y `afterAll` lo hacen una sola vez por suite. Así no repito el login en cada test.
- **Suite serial (reto 1):** con `mode: 'serial'` los tests corren en orden y, si uno falla, los siguientes se omiten. El modo serial no comparte la `page`; para compartirla creé una propia en `beforeAll` y la cerré en `afterAll`.
- **`test.slow()` (reto 2):** triplica el timeout del test. Lo usé con `performance_glitch_user`, cuyo login tardó unos 5.8 s.
- **`test.skip()` dinámico (reto 3):** permite omitir un test según el estado real durante la ejecución, no solo con una condición fija al escribir el código.
- **Paralelo contra secuencial:** el paralelo terminó en 13.8 s y el secuencial en 21.3 s, aproximadamente un 35 % menos. La mejora fue menor de lo esperado porque el test del usuario lento tarda unos 6 s por sí solo y no se puede repartir.

## Cuándo usar cada modo
- **Paralelo:** tests independientes entre sí. Es lo más rápido, pero cada test debe poder correr solo.
- **Secuencial o serial:** tests que dependen uno del otro, como un flujo de pasos que comparte la sesión. Es más lento y un fallo corta la cadena.

## SQA Plan
Define propósito, alcance, herramientas y criterios de salida. Mi criterio de salida es que el 100 % de los tests críticos (login, inventario, checkout) estén en verde, tanto en paralelo como en secuencial.
