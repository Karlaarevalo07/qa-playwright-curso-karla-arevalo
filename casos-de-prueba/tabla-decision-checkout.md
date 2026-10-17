# Tabla de decisión – Checkout de Sauce Demo

> Material de estudio. Antes de dar la tabla por buena, **verifica a mano** las
> filas marcadas con (?) (la guía de la clase lo pide): abre el sitio y
> comprueba qué pasa de verdad. Anota el resultado real en la última columna.

## Condiciones
- C1: Usuario autenticado
- C2: Carrito con items
- C3: Formulario de checkout completo (nombre, apellido, código postal)
- C4: Clic en Finish

## Reglas

| Regla | C1 Autenticado | C2 Carrito con items | C3 Formulario completo | C4 Clic en Finish | Resultado esperado | Verificado a mano |
|-------|:---:|:---:|:---:|:---:|---|---|
| R1 | Sí | Sí | Sí | Sí | Se muestra "Thank you for your order!" | Confirmado: llega a `checkout-complete.html` con ese mensaje |
| R2 | Sí | Sí | Sí | No | Se queda en el resumen (checkout-step-two); no se completa la compra | Confirmado: queda en `checkout-step-two.html` hasta pulsar Finish |
| R3 | Sí | Sí | No | – | No avanza; mensaje de error del campo que falta | Confirmado: no avanza y muestra `First Name is required`, `Last Name is required` o `Postal Code is required` |
| R4 | Sí | No | Sí | Sí | (?) comprobar si el sistema deja comprar con carrito vacío | Parcial: el sitio deja entrar al formulario con el carrito vacío (no bloquea); falta comprobar si deja llegar hasta Finish |
| R5 | No | Sí | – | – | Al abrir `checkout-step-one.html` sin sesión redirige al login con un error | Confirmado: error `You can only access '/checkout-step-one.html' when you are logged in.` |
| R6 | No | No | – | – | Igual que R5: sin sesión no se accede al checkout | Confirmado: mismo comportamiento que R5 |

## Preguntas de la guía
1. **¿Qué pasa si accedes a `checkout-step-one.html` sin sesión?** Te manda al login y muestra el error `You can only access '/checkout-step-one.html' when you are logged in.`
2. **¿Qué pasa si el carrito está vacío al hacer checkout?** El sitio no lo bloquea: deja entrar al formulario de checkout. Es un comportamiento cuestionable, porque no tiene sentido pagar sin productos.
3. **¿El mensaje de error es igual sin importar qué campo falta?** No, cambia según el campo: `First Name is required`, `Last Name is required` o `Postal Code is required`.
