# VIGÍA C-UAS V5 — prototipo Android gratuito

## Qué incluye
- Vista previa de la cámara trasera con CameraX.
- Análisis en tiempo real con ML Kit Object Detection en modo streaming.
- Indicador del número de objetos genéricos detectados.
- Botón para guardar una fotografía y un archivo TXT con fecha/hora y última ubicación GPS disponible.
- Almacenamiento local privado en `Android/data`/datos internos de la aplicación (directorio `filesDir/evidencias`).

## Limitación importante
Este prototipo **no identifica drones de forma fiable**. El detector incluido reconoce objetos genéricos y devuelve cajas/clasificaciones limitadas; no es un modelo entrenado específicamente para drones. El número de objetos no debe interpretarse como número de drones. Para detección específica se necesita un modelo visual de drones validado con imágenes diversas y pruebas controladas. La cámara del teléfono tampoco puede detectar objetos fuera de su campo de visión ni sustituye un radar o sensor RF.

## Cómo compilar
1. Instala Android Studio en una computadora.
2. Abre esta carpeta como proyecto.
3. Deja que Gradle sincronice las dependencias.
4. Conecta un Android con depuración USB activada.
5. Pulsa Run.

## Privacidad y seguridad
- La cámara y ubicación se solicitan en el dispositivo.
- Las evidencias se guardan localmente; esta app no las envía a un servidor.
- La ubicación puede no estar disponible si el GPS no ha fijado posición.
- Úsalo únicamente para observación y documentación autorizada. No incluye interferencia, suplantación ni neutralización de aeronaves.
