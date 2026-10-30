# Caso B: Monitoreo de lluvia

Taller de HTML, CSS y JavaScript.

## Uso

Abrir `index.html` en Chrome o Edge.

- Usuario: CVC
- Contraseña: Lluvias
- Clave para registrar otra zona: CLIMA

Ingresar dirección, hora de inicio, hora de fin, precipitación en mm y nombre de quien registra. Después del reloj se muestra el resultado y se agrega la precipitación registrada a una gráfica de barras.

Los registros están en un arreglo y se borran al recargar. La cámara permite tomar una foto de la zona; requiere permiso del navegador y una cámara disponible. La foto se muestra en pantalla, sin enviarla a un servidor.

## Cálculos del enunciado

- Referencia del ejercicio: 14 mm.
- Tiempo total: diferencia entre fin e inicio, en horas, dentro del mismo día.
- Fórmula solicitada: precipitación registrada × 14 × tiempo total.
- Ajuste: se suma 5,3 % al resultado de la fórmula si el inicio está entre 15:00 y 18:00, incluidos los extremos. La comparación con 14 mm usa la precipitación original.

El enunciado no especifica la unidad del tiempo, el sentido del ajuste ni la duración del reloj. Se eligieron horas, un aumento y una animación de 1,5 segundos, respectivamente. El producto se muestra separado de la precipitación porque no tiene unidad mm.

Ejemplo: 20 mm de 15:00 a 16:30 son 1,5 horas. El cálculo es 20 × 14 × 1,5 = 420; el ajuste es 22,26 y el resultado final es 442,26. La comparación indica que los 20 mm originales están por encima de 14 mm.

El acceso es una práctica local con credenciales en JavaScript, no una autenticación segura de producción. Usar un navegador normal: el navegador integrado de algunas aplicaciones no admite `prompt()`.

## Archivos

- `index.html`: estructura.
- `css/estilos.css`: presentación.
- `js/app.js`: funciones, validaciones, cálculos, gráfica y cámara.

## GitHub

Subir estos archivos y carpetas a un repositorio público, con `index.html` en la raíz. Para activar GitHub Pages: Settings → Pages → Deploy from a branch → main → / (root).
