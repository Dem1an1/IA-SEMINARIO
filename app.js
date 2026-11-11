/* =========================================================
   ¿Real o IA? — Lógica del juego
   JavaScript puro, sin dependencias.
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Configuración ---------- */

  // URL pública del juego para compartir. Si la dejás vacía, se usa la URL actual.
  // Ejemplo: "https://real-o-ia.vercel.app"
  const URL_JUEGO = "";

  const RUTA_RONDAS = "data/rondas.json";
  const RONDAS_POR_PARTIDA = 10;
  const CLAVE_VISTAS = "real_o_ia_vistas";

  // Copia de respaldo de data/rondas.json. Se usa SOLO si el navegador bloquea
  // la carga del JSON (pasa al abrir index.html con doble clic, vía file://).
  // Si editás rondas.json y querés probarlo sin servidor, actualizá también esto.
  const RONDAS_RESPALDO = [
    { id: 1, imagen: "images/ronda-01.jpg", respuesta: "ia", explicacion: "Mirá las manos que sostienen el mate: la mano derecha tiene seis dedos y algunas falanges se deforman al agarrar la calabaza.", credito: "Generada con IA (Gemini)" },
    { id: 2, imagen: "images/ronda-02.jpg", respuesta: "real", explicacion: "Fijate en los carteles de la vidriera: cada palabra en inglés y cada número del horario se leen perfecto. La IA suele deformar las letras chicas.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 3, imagen: "images/ronda-03.jpg", respuesta: "ia", explicacion: "La piel es demasiado lisa, casi sin poros, y cada aro es completamente distinto: uno es una argolla dorada y el otro un colgante plateado.", credito: "Generada con IA (Gemini)" },
    { id: 4, imagen: "images/ronda-04.jpg", respuesta: "real", explicacion: "Mirá el pelaje del perro y los pastos desenfocados adelante: hay pelos sueltos, bigotes irregulares y tierra real en el suelo. La IA suele alisar todo.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 5, imagen: "images/ronda-05.jpg", respuesta: "ia", explicacion: "Las ventanas y los balcones no mantienen una alineación coherente entre pisos y varias rejas de hierro se tuercen. La IA falla seguido con la arquitectura.", credito: "Generada con IA (Gemini)" },
    { id: 6, imagen: "images/ronda-06.jpg", respuesta: "real", explicacion: "La calabaza del mate tiene marcas reales de desgaste, el cincelado de la virola es irregular y la yerba desparramada muestra palo, polvo y hojas todas distintas.", credito: "Foto real libre (Wikimedia Commons)" },
    { id: 7, imagen: "images/ronda-07.jpg", respuesta: "ia", explicacion: "Probá leer el cartel del kiosco y las hojas de precios: parecen palabras, pero son letras inventadas sin ningún sentido. Es una de las pistas más claras.", credito: "Generada con IA (Gemini)" },
    { id: 8, imagen: "images/ronda-08.jpg", respuesta: "real", explicacion: "Los gestos son espontáneos, las manos entrelazadas tienen anatomía normal y la trama del poncho mantiene su dibujo en los pliegues sin derretirse.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 9, imagen: "images/ronda-09.jpg", respuesta: "ia", explicacion: "Fijate en el tenedor: tiene cinco dientes y el de la punta se tuerce raro. Además, el vapor del guiso dibuja rulos simétricos imposibles.", credito: "Generada con IA (Gemini)" },
    { id: 10, imagen: "images/ronda-10.jpg", respuesta: "real", explicacion: "En las zonas oscuras se nota el grano real del sensor de la cámara y la textura de las rocas volcánicas con nieve nunca repite el mismo patrón.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 11, imagen: "images/ronda-11.jpg", respuesta: "ia", explicacion: "Fijate en las manos y el crucifijo: una mano sostiene un vaso que se deforma y una de las cadenas del collar desaparece en la campera. Fue uno de los primeros virales hechos con IA.", credito: "Generada con IA (Midjourney)" },
    { id: 12, imagen: "images/ronda-12.jpg", respuesta: "real", explicacion: "Mirá el pelaje del perro y el suelo: hay polvo real, pelos desordenados y una profundidad de campo óptica natural de lente fotográfico.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 13, imagen: "images/ronda-13.jpg", respuesta: "ia", explicacion: "Mirá las piernas y las manos de los policías: hay extremidades que se mezclan entre sí y los cinturones tienen hebillas y fundas deformadas.", credito: "Generada con IA (Midjourney)" },
    { id: 14, imagen: "images/ronda-14.jpg", respuesta: "real", explicacion: "El brillo húmedo de la nariz tiene textura real de piel canina y cada bigote sale de su folículo sin cortarse ni doblarse raro.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 15, imagen: "images/ronda-15.jpg", respuesta: "ia", explicacion: "En los retratos de redes generativas (StyleGAN) los ojos quedan clavados exactamente en el centro y el fondo es una mancha borrosa que no forma ningún lugar real.", credito: "Generada con IA (StyleGAN)" },
    { id: 16, imagen: "images/ronda-16.jpg", respuesta: "real", explicacion: "Fijate en las sombras duras del sol y las imperfecciones del entorno: la luz cae con la misma dirección e intensidad en toda la escena.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 17, imagen: "images/ronda-17.jpg", respuesta: "ia", explicacion: "Mirá los dientes y el pelo sobre los hombros: los incisivos son asimétricos y varios mechones desaparecen en el aire como si estuvieran pintados.", credito: "Generada con IA (StyleGAN)" },
    { id: 18, imagen: "images/ronda-18.jpg", respuesta: "real", explicacion: "Las cuerdas y el tejido de la hamaca mantienen su tensión real bajo el peso del perro, algo que la IA suele deformar.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 19, imagen: "images/ronda-19.jpg", respuesta: "ia", explicacion: "Fijate en las orejas y el fondo: una oreja tiene el lóbulo deformado y atrás del rostro hay manchas de color que no corresponden a ningún objeto.", credito: "Generada con IA (StyleGAN)" },
    { id: 20, imagen: "images/ronda-20.jpg", respuesta: "real", explicacion: "Las ondas del agua del lago y las gotas sobre el pelaje mojado responden a la física real, sin patrones repetidos.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 21, imagen: "images/ronda-21.jpg", respuesta: "ia", explicacion: "Mirá el borde del pelo y las orejas: el recorte contra el fondo parece derretirse y la textura de la piel cambia de golpe cerca del cuello.", credito: "Generada con IA (StyleGAN)" },
    { id: 22, imagen: "images/ronda-22.jpg", respuesta: "real", explicacion: "Las huellas y los cristales de nieve muestran variaciones irregulares reales, con grano natural de cámara en los blancos.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 23, imagen: "images/ronda-23.jpg", respuesta: "ia", explicacion: "Fijate en los aros y el cuello de la ropa: de un lado hay un brillo metálico que no llega a formar un aro y las costuras del hombro no coinciden.", credito: "Generada con IA (StyleGAN)" },
    { id: 24, imagen: "images/ronda-24.jpg", respuesta: "real", explicacion: "En el contraluz del atardecer se ven pelos sueltos iluminados uno por uno y las briznas de pasto mantienen su forma de punta a punta.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 25, imagen: "images/ronda-25.jpg", respuesta: "ia", explicacion: "La barba y las arrugas tienen una suavidad plástica y el fondo de libros se funde en manchas sin forma. Este retrato falso se usó para inventar un poeta inexistente.", credito: "Generada con IA (engaño viral)" },
    { id: 26, imagen: "images/ronda-26.jpg", respuesta: "real", explicacion: "Los mechones apelmazados por la lluvia y el barro real del campo tienen un desorden orgánico que los generadores tienden a embellecer.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 27, imagen: "images/ronda-27.jpg", respuesta: "ia", explicacion: "La luz dorada parece de estudio publicitario, la piel no tiene ni una marca real y el pelaje del perro se funde con el abrigo de la mujer.", credito: "Generada con IA (Adobe Firefly)" },
    { id: 28, imagen: "images/ronda-28.jpg", respuesta: "real", explicacion: "Los reflejos en el agua, la postura de equilibrio sobre la tabla y las proporciones del cuerpo humano y del perro son totalmente coherentes.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 29, imagen: "images/ronda-29.jpg", respuesta: "ia", explicacion: "Los reflejos en el agua y las montañas tienen una simetría de pintura digital y las piedras de la orilla muestran bordes blandos sin textura mineral.", credito: "Generada con IA (Adobe Firefly)" },
    { id: 30, imagen: "images/ronda-30.jpg", respuesta: "real", explicacion: "La mirada, las manchas asimétricas naturales del hocico y el desenfoque progresivo del fondo son propios de una cámara réflex real.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 31, imagen: "images/ronda-31.jpg", respuesta: "ia", explicacion: "Mirá la parrilla del auto antiguo y los faros: las varillas metálicas no son simétricas y los reflejos de la carrocería no coinciden con el entorno.", credito: "Generada con IA (Midjourney)" },
    { id: 32, imagen: "images/ronda-32.jpg", respuesta: "real", explicacion: "Mirá la madera gastada de la cerca: tiene vetas, astillas y clavos oxidados reales que siguen una línea recta perfecta.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 33, imagen: "images/ronda-33.jpg", respuesta: "ia", explicacion: "La piel tiene un brillo de porcelana sin poros reales y los pliegues de la ropa se esfuman sin costuras definidas.", credito: "Generada con IA (Midjourney)" },
    { id: 34, imagen: "images/ronda-34.jpg", respuesta: "real", explicacion: "Fijate en la mano que acaricia al perro bostezando: las cinco falanges, las uñas y los dientes del animal tienen anatomía exacta.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 35, imagen: "images/ronda-35.jpg", respuesta: "ia", explicacion: "Las personas alrededor del supuesto esqueleto gigante tienen posturas y caras deformadas, y las escaleras se clavan en la tierra sin estructura real.", credito: "Generada con IA (Midjourney)" },
    { id: 36, imagen: "images/ronda-36.jpg", respuesta: "real", explicacion: "La interacción entre el nene y el perro, los pliegues de la ropa infantil y la luz natural exterior son espontáneos y coherentes.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 37, imagen: "images/ronda-37.jpg", respuesta: "ia", explicacion: "Mirá los dedos de la mano que asoma atrás: las uñas y falanges están deformadas. Aunque parece una foto antigua, ganó un premio fotográfico antes de que el autor revelara que era IA.", credito: "Generada con IA (Boris Eldagsen)" },
    { id: 38, imagen: "images/ronda-38.jpg", respuesta: "real", explicacion: "La correa mantiene una línea continua desde la mano hasta el collar sin cortarse ni desaparecer, un detalle donde la IA suele fallar.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 39, imagen: "images/ronda-39.jpg", respuesta: "ia", explicacion: "La simetría del rostro es casi matemática, el brillo de los ojos parece dibujado y la textura de la piel es demasiado uniforme.", credito: "Generada con IA (Midjourney)" },
    { id: 40, imagen: "images/ronda-40.jpg", respuesta: "real", explicacion: "En el puesto callejero hay envases, utensilios gastados, manchas de aceite reales y carteles al fondo con caracteres bien trazados.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 41, imagen: "images/ronda-41.jpg", respuesta: "ia", explicacion: "Fijate en las ventanas de la mansión: las molduras cambian de tamaño entre un lado y otro y las tejas del techo se mezclan en una textura borrosa.", credito: "Generada con IA (DALL·E)" },
    { id: 42, imagen: "images/ronda-42.jpg", respuesta: "real", explicacion: "Las líneas de fuga de los edificios, los cables, las señales viales y el asfalto gastado respetan una perspectiva geométrica exacta.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 43, imagen: "images/ronda-43.jpg", respuesta: "ia", explicacion: "El contorno del caminante contra las montañas tiene bordes raros y las crestas de roca repiten trazos como si fueran pinceladas.", credito: "Generada con IA (Stable Diffusion)" },
    { id: 44, imagen: "images/ronda-44.jpg", respuesta: "real", explicacion: "Las luces de la calle tienen la aberración cromática y el grano en sombra propios de una foto nocturna real en Bogotá.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 45, imagen: "images/ronda-45.jpg", respuesta: "ia", explicacion: "Mirá los dedos que sostienen la galletita y los frascos de la alacena: las etiquetas no tienen ningún texto legible y la mano tiene pliegues irreales.", credito: "Generada con IA" },
    { id: 46, imagen: "images/ronda-46.jpg", respuesta: "real", explicacion: "Fijate en los azulejos, las barandas y los carteles de la estación de subte: todas las juntas y letras mantienen su alineación real.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 47, imagen: "images/ronda-47.jpg", respuesta: "ia", explicacion: "El glaseado de la dona tiene un brillo plástico perfecto y las granas de colores se curvan o se meten adentro de la masa de forma imposible.", credito: "Generada con IA" },
    { id: 48, imagen: "images/ronda-48.jpg", respuesta: "real", explicacion: "Las manchas de humedad, el óxido y el desgaste urbano tienen texturas crudas y variadas que no salen de un patrón sintético.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 49, imagen: "images/ronda-49.jpg", respuesta: "ia", explicacion: "Los ingredientes del plato brillan como si fueran de cera y los bordes de la vajilla pierden su forma circular cuando los mirás de cerca.", credito: "Generada con IA (Midjourney)" },
    { id: 50, imagen: "images/ronda-50.jpg", respuesta: "real", explicacion: "Mirá las paredes de ladrillo y las filas de ventanas: cada hilada es recta y continua, sin ladrillos derretidos ni ventanas desfasadas.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 51, imagen: "images/ronda-51.jpg", respuesta: "ia", explicacion: "La manzana tiene una textura demasiado uniforme y la trama del mantel de abajo pierde la continuidad de los hilos en los pliegues.", credito: "Generada con IA" },
    { id: 52, imagen: "images/ronda-52.jpg", respuesta: "real", explicacion: "Las estelas de luz de larga exposición siguen exactamente el carril de los vehículos y los edificios del fondo conservan bordes nítidos.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 53, imagen: "images/ronda-53.jpg", respuesta: "ia", explicacion: "La salsa del plato tiene remolinos con brillo artificial y los trozos de comida no tienen bordes ni fibras definidas.", credito: "Generada con IA" },
    { id: 54, imagen: "images/ronda-54.jpg", respuesta: "real", explicacion: "En un mercado lleno de mercadería real cada bolsa, cartel y persona del fondo conserva su forma concreta sin mezclarse con lo de al lado.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 55, imagen: "images/ronda-55.jpg", respuesta: "ia", explicacion: "Mirá la forma de los pescados en la fuente: las cabezas y aletas se funden con la salsa y la decoración verde flota sin proyectar sombra.", credito: "Generada con IA" },
    { id: 56, imagen: "images/ronda-56.jpg", respuesta: "real", explicacion: "El traje del portero, los botones alineados y el reflejo arquitectónico en los vidrios de la entrada coinciden con la calle real.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 57, imagen: "images/ronda-57.jpg", respuesta: "ia", explicacion: "Aunque parece una foto de catálogo de un puerro, las raíces son hilos borrosos que se desvanecen y las hojas verdes se pliegan de forma antinatural.", credito: "Generada con IA" },
    { id: 58, imagen: "images/ronda-58.jpg", respuesta: "real", explicacion: "Las vigas metálicas, tensores y remaches del puente tienen una estructura de ingeniería simétrica y continua de punta a punta.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 59, imagen: "images/ronda-59.jpg", respuesta: "ia", explicacion: "Las bochas de helado y las flores de lavanda tienen una textura aterciopelada idéntica, sin cristales de hielo reales.", credito: "Generada con IA" },
    { id: 60, imagen: "images/ronda-60.jpg", respuesta: "real", explicacion: "Las siluetas urbanas, las señales de tránsito y los reflejos sobre el pavimento muestran una iluminación natural sin retoques sintéticos.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 61, imagen: "images/ronda-61.jpg", respuesta: "ia", explicacion: "Fijate en los carteles de las tres cajas y en el perro: aunque el rostro es muy realista, los bordes de las letras y la perspectiva de las cajas delatan la generación.", credito: "Generada con IA (Flux.1)" },
    { id: 62, imagen: "images/ronda-62.jpg", respuesta: "real", explicacion: "La postura natural de la persona, los pliegues de su ropa y la geometría de la vereda y los cordones son completamente reales.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 63, imagen: "images/ronda-63.jpg", respuesta: "ia", explicacion: "Mirá los textos sobre las cajas: las palabras están mal escritas o tienen letras rotas, y las patas del perro se confunden con la alfombra.", credito: "Generada con IA (Stable Diffusion XL)" },
    { id: 64, imagen: "images/ronda-64.jpg", respuesta: "real", explicacion: "En el callejón de Génova las persianas, balcones y cables tendidos entre fachadas tienen continuidad física real.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 65, imagen: "images/ronda-65.jpg", respuesta: "ia", explicacion: "Los estampados del sari se deforman en los pliegues, las letras de las cajas fallan y la anatomía del perro tiene proporciones raras.", credito: "Generada con IA (Stable Diffusion XL)" },
    { id: 66, imagen: "images/ronda-66.jpg", respuesta: "real", explicacion: "Las costuras de la ropa, la textura de la tela y los autos y carteles desenfocados atrás en Nueva York son consistentes al 100%.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 67, imagen: "images/ronda-67.jpg", respuesta: "ia", explicacion: "Mirá la cinta métrica amarilla: los números son símbolos inventados sin orden y pasa de forma rara entre los dedos del sastre.", credito: "Generada con IA (Flux.1)" },
    { id: 68, imagen: "images/ronda-68.jpg", respuesta: "real", explicacion: "Fijate en las piernas y los pasos de la gente cruzando la senda peatonal: nadie tiene extremidades duplicadas ni sombras contradictorias.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 69, imagen: "images/ronda-69.jpg", respuesta: "ia", explicacion: "Fijate en el uniforme policial y los cuadros del museo al fondo: las insignias no tienen forma definida y los marcos de la pared están torcidos.", credito: "Generada con IA (Stable Diffusion)" },
    { id: 70, imagen: "images/ronda-70.jpg", respuesta: "real", explicacion: "Los adoquines del piso y los marcos de las ventanas antiguas muestran un desgaste histórico real y una perspectiva limpia.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 71, imagen: "images/ronda-71.jpg", respuesta: "ia", explicacion: "Más allá de lo imposible de ver a Abraham Lincoln subiendo a un avión presidencial moderno, las ventanillas y las manos en la baranda están deformadas.", credito: "Generada con IA" },
    { id: 72, imagen: "images/ronda-72.jpg", respuesta: "real", explicacion: "Los autos estacionados en la pendiente tienen patentes, espejos y ruedas bien proporcionadas que siguen el ángulo de la calle.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 73, imagen: "images/ronda-73.jpg", respuesta: "ia", explicacion: "Las arrugas del entrecejo son exageradas como una caricatura fotorrealista y los cubiertos al costado del plato tienen puntas desparejas.", credito: "Generada con IA" },
    { id: 74, imagen: "images/ronda-74.jpg", respuesta: "real", explicacion: "El metal quemado del wok, el movimiento real del salteado y las gotas de salsa salpicadas tienen el desorden propio de una cocina real.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 75, imagen: "images/ronda-75.jpg", respuesta: "ia", explicacion: "Mirá la mano que sostiene la lapicera y las páginas del libro: las letras son garabatos sin sentido y la luz tiene ese tono cálido plástico típico de DALL·E 3.", credito: "Generada con IA (DALL·E 3)" },
    { id: 76, imagen: "images/ronda-76.jpg", respuesta: "real", explicacion: "Los carteles de los taxis, las ópticas de los autos y la señalética urbana tienen tipografías y formas industriales exactas.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 77, imagen: "images/ronda-77.jpg", respuesta: "ia", explicacion: "La piel de la cara no tiene textura real, los dedos apoyados se fusionan entre sí y el respaldo de la silla cambia de forma detrás de los hombros.", credito: "Generada con IA" },
    { id: 78, imagen: "images/ronda-78.jpg", respuesta: "real", explicacion: "Las columnas clásicas, las cornisas y el reloj del edificio público mantienen proporciones arquitectónicas reales sin deformaciones.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 79, imagen: "images/ronda-79.jpg", respuesta: "ia", explicacion: "Fijate en los objetos del consultorio en el fondo: parecen instrumentos médicos de lejos, pero al acercarte no son ningún objeto reconocible.", credito: "Generada con IA" },
    { id: 80, imagen: "images/ronda-80.jpg", respuesta: "real", explicacion: "En la cafetería las tazas apiladas, la máquina de espresso y los carteles del menú tienen bordes y textos nítidos.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 81, imagen: "images/ronda-81.jpg", respuesta: "ia", explicacion: "Mirá las caras y las copas de la gente en segundo plano: los rostros se deforman y los dedos que sostienen los vasos tienen falanges de más.", credito: "Generada con IA (DALL·E 3)" },
    { id: 82, imagen: "images/ronda-82.jpg", respuesta: "real", explicacion: "El borde cerámico de la taza azul es un círculo perfecto, el asa está bien unida y las burbujas de la espuma del café son irregulares.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 83, imagen: "images/ronda-83.jpg", respuesta: "ia", explicacion: "Los botones de los trajes decimonónicos no están alineados, las manos tienen pliegues borrosos y la iluminación de estudio es idéntica en todas las figuras.", credito: "Generada con IA (Gemini)" },
    { id: 84, imagen: "images/ronda-84.jpg", respuesta: "real", explicacion: "Mirá las manos conversando alrededor de las tazas: las articulaciones, uñas y anillos son anatómicamente reales.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 85, imagen: "images/ronda-85.jpg", respuesta: "ia", explicacion: "Fijate en el teclado de la notebook y las manos en la cabeza: las teclas no forman filas reales y los dedos se pierden adentro del pelo.", credito: "Generada con IA" },
    { id: 86, imagen: "images/ronda-86.jpg", respuesta: "real", explicacion: "El dibujo de la espuma (latte art) se deforma de manera natural contra la pared de la taza y la madera de la mesa tiene vetas continuas.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 87, imagen: "images/ronda-87.jpg", respuesta: "ia", explicacion: "El retrato tiene una nitidez extrema en las pestañas pero la piel parece de cera y las hebras de pelo sueltas aparecen sin tener raíz.", credito: "Generada con IA" },
    { id: 88, imagen: "images/ronda-88.jpg", respuesta: "real", explicacion: "Los reflejos de la ventana sobre la mesa y la vajilla coinciden exactamente con la luz exterior del local.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 89, imagen: "images/ronda-89.jpg", respuesta: "ia", explicacion: "El pelaje del gato parece pasado por un filtro de suavizado extremo y los bigotes nacen de lugares desparejos y se esfuman en el aire.", credito: "Generada con IA" },
    { id: 90, imagen: "images/ronda-90.jpg", respuesta: "real", explicacion: "Los poros del hormigón tienen suciedad y marcas reales, sin ese alisado plástico que suele dejar la IA en las superficies.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 91, imagen: "images/ronda-91.jpg", respuesta: "ia", explicacion: "El brillo del pelaje negro es demasiado parejo, los ojos tienen un reflejo idéntico como de vidrio pintado y las patas delanteras se funden.", credito: "Generada con IA" },
    { id: 92, imagen: "images/ronda-92.jpg", respuesta: "real", explicacion: "Los granos de azúcar sueltos, la cuchara metálica y la textura de la crema tienen reflejos y tamaños reales.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 93, imagen: "images/ronda-93.jpg", respuesta: "ia", explicacion: "La copa de vino tiene reflejos simétricos de estudio y el pelaje del gato tiene esa textura sedosa hiperperfecta típica de los generadores actuales.", credito: "Generada con IA (DALL·E 3)" },
    { id: 94, imagen: "images/ronda-94.jpg", respuesta: "real", explicacion: "La simetría entre el plato y la taza es geométricamente consistente vista en escorzo, algo que suele ovalarse raro con IA.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 95, imagen: "images/ronda-95.jpg", respuesta: "ia", explicacion: "El tejido del polera negra se funde con el pelaje del perro sin un borde claro y la boina flota sobre las orejas sin aplastarlas.", credito: "Generada con IA (DALL·E 2)" },
    { id: 96, imagen: "images/ronda-96.jpg", respuesta: "real", explicacion: "Las microburbujas de la leche espumada tienen tamaños variados y el esmalte de la taza verde muestra pequeños brillos reales.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 97, imagen: "images/ronda-97.jpg", respuesta: "ia", explicacion: "Fijate en los pies y las manos apoyadas sobre la roca: los dedos se mezclan con la piedra y el agua barrosa tiene ondas que no siguen la corriente.", credito: "Generada con IA (Stable Diffusion)" },
    { id: 98, imagen: "images/ronda-98.jpg", respuesta: "real", explicacion: "El cuaderno abierto tiene renglones y bordes de hojas reales que no se fusionan entre sí, junto a una lapicera bien definida.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 99, imagen: "images/ronda-99.jpg", respuesta: "ia", explicacion: "Las flores alrededor del oso tienen pétalos que se fusionan con el pelaje y la luz parece salir desde adentro de las plantas.", credito: "Generada con IA (Midjourney)" },
    { id: 100, imagen: "images/ronda-100.jpg", respuesta: "real", explicacion: "La luz lateral suave produce una sombra degradada coherente y se aprecia el grano fino natural de la fotografía.", credito: "Foto real sin copyright (Unsplash · CC0)" }
  ];

  const MENSAJES_FINALES = [
    { hasta: 4, texto: "La IA te engañó bastante" },
    { hasta: 7, texto: "Ojo entrenado, pero no infalible" },
    { hasta: Infinity, texto: "Detector humano nivel experto" }
  ];

  /* ---------- Referencias al DOM ---------- */

  const $ = (id) => document.getElementById(id);

  const ui = {
    pantallas: {
      inicio: $("pantalla-inicio"),
      ronda: $("pantalla-ronda"),
      final: $("pantalla-final")
    },
    btnEmpezar: $("btn-empezar"),
    tituloRonda: $("titulo-ronda"),
    progresoTexto: $("progreso-texto"),
    progresoBarra: $("progreso-barra"),
    progresoRelleno: $("progreso-relleno"),
    puntajeParcial: $("puntaje-parcial"),
    media: $("media"),
    mediaFondo: $("media-fondo"),
    imagen: $("ronda-imagen"),
    placeholder: $("placeholder"),
    placeholderTexto: $("placeholder-texto"),
    placeholderRuta: $("placeholder-ruta"),
    credito: $("ronda-credito"),
    acciones: $("acciones"),
    botonesRespuesta: document.querySelectorAll("[data-respuesta]"),
    resultado: $("resultado"),
    resultadoIcono: $("resultado-icono"),
    resultadoTitulo: $("resultado-titulo"),
    resultadoRespuesta: $("resultado-respuesta"),
    resultadoExplicacion: $("resultado-explicacion"),
    resultadoStats: $("resultado-stats"),
    statsBarraWrap: $("stats-barra-wrap"),
    statsLabelReal: $("stats-label-real"),
    statsLabelIa: $("stats-label-ia"),
    statsRellenoReal: $("stats-relleno-real"),
    statsRellenoIa: $("stats-relleno-ia"),
    statsFrase: $("stats-frase"),
    btnSiguiente: $("btn-siguiente"),
    finalPuntaje: $("final-puntaje"),
    finalTotal: $("final-total"),
    finalMensaje: $("final-mensaje"),
    finalPromedio: $("final-promedio"),
    btnCompartir: $("btn-compartir"),
    btnReiniciar: $("btn-reiniciar"),
    btnDetectar: $("btn-detectar"),
    btnComo: $("btn-como"),
    btnSobreInicio: $("btn-sobre-inicio"),
    btnSobreFinal: $("btn-sobre-final"),
    panelComo: $("panel-como"),
    btnCerrarComo: $("btn-cerrar-como"),
    panelDetectar: $("panel-detectar"),
    btnCerrarDetectar: $("btn-cerrar-detectar"),
    panelSobre: $("panel-sobre"),
    btnCerrarSobre: $("btn-cerrar-sobre"),
    toast: $("toast"),
    anuncio: $("anuncio")
  };

  const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Estado ---------- */

  let todasLasRondas = [];
  let vistasEnMemoria = new Set();
  let ultimoBotonPanel = null;
  const estado = {
    rondas: [],
    indice: 0,
    aciertos: 0,
    respondida: false,
    tokenImagen: 0,
    stats: null
  };

  /* ---------- Utilidades ---------- */

  // Mezcla Fisher–Yates (sin sesgo)
  function mezclar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function cargarVistasGuardadas() {
    try {
      const raw = sessionStorage.getItem(CLAVE_VISTAS);
      const lista = raw ? JSON.parse(raw) : [];
      if (Array.isArray(lista)) {
        lista.forEach((id) => vistasEnMemoria.add(Number(id)));
      }
    } catch (_) { /* sin soporte */ }
  }

  function guardarVistas() {
    try {
      sessionStorage.setItem(CLAVE_VISTAS, JSON.stringify(Array.from(vistasEnMemoria)));
    } catch (_) { /* sin soporte */ }
  }

  // Elige 10 imágenes al azar que no hayan salido en partidas anteriores;
  // cuando se agotan las 100 imágenes del banco, reinicia el mazo.
  function seleccionarRondasPartida() {
    const cantidad = Math.min(RONDAS_POR_PARTIDA, todasLasRondas.length);
    let disponibles = todasLasRondas.filter((r) => !vistasEnMemoria.has(Number(r.id)));

    if (disponibles.length < cantidad) {
      vistasEnMemoria.clear();
      disponibles = todasLasRondas.slice();
    }

    const elegidas = mezclar(disponibles).slice(0, cantidad);
    elegidas.forEach((r) => vistasEnMemoria.add(Number(r.id)));
    guardarVistas();
    return elegidas;
  }

  function normalizar(rondas) {
    return rondas
      .filter((r) => r && r.imagen && r.respuesta)
      .map((r, i) => ({
        id: r.id ?? i + 1,
        imagen: String(r.imagen),
        respuesta: String(r.respuesta).trim().toLowerCase() === "real" ? "real" : "ia",
        explicacion: r.explicacion || "",
        credito: r.credito || "",
        alt: r.alt || ""
      }));
  }

  function anunciar(texto) {
    ui.anuncio.textContent = "";
    // Pequeña pausa para que los lectores de pantalla detecten el cambio
    setTimeout(() => { ui.anuncio.textContent = texto; }, 60);
  }

  let timerToast;
  function mostrarToast(texto) {
    clearTimeout(timerToast);
    ui.toast.hidden = true;
    ui.toast.textContent = texto;
    // Forzar reflow para reiniciar la animación
    void ui.toast.offsetWidth;
    ui.toast.hidden = false;
    timerToast = setTimeout(() => { ui.toast.hidden = true; }, 2600);
  }

  function urlParaCompartir() {
    if (URL_JUEGO) return URL_JUEGO;
    return location.origin + location.pathname.replace(/index\.html$/, "");
  }

  function vibrar(ms) {
    if (navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (_) { /* sin soporte */ }
    }
  }

  /* ---------- Carga de datos ---------- */

  async function cargarRondas() {
    try {
      const resp = await fetch(RUTA_RONDAS, { cache: "no-cache" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const datos = await resp.json();
      if (!Array.isArray(datos) || datos.length === 0) throw new Error("rondas.json vacío o inválido");
      return normalizar(datos);
    } catch (err) {
      console.warn(
        "[¿Real o IA?] No se pudo cargar " + RUTA_RONDAS + " (" + err.message + "). " +
        "Se usa la copia de respaldo de app.js. Para probar cambios en el JSON, usá un servidor local (ver README)."
      );
      return normalizar(RONDAS_RESPALDO);
    }
  }

  /* ---------- Estadísticas colectivas (Supabase REST) ---------- */

  function configSupabase() {
    const url = (window.SUPABASE_URL || "").trim().replace(/\/+$/, "");
    const key = (window.SUPABASE_ANON_KEY || "").trim();
    return url && key ? { url, key } : null;
  }

  function headersSupabase(cfg, extra) {
    return Object.assign({
      "Content-Type": "application/json",
      "apikey": cfg.key,
      "Authorization": "Bearer " + cfg.key
    }, extra);
  }

  async function cargarEstadisticas() {
    const cfg = configSupabase();
    if (!cfg) {
      estado.stats = null;
      return;
    }
    try {
      const resp = await fetch(cfg.url + "/rest/v1/rpc/estadisticas", {
        method: "POST",
        headers: headersSupabase(cfg),
        body: "{}"
      });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const data = await resp.json();
      if (data && typeof data === "object") {
        estado.stats = {
          rondas: Array.isArray(data.rondas) ? data.rondas : [],
          partidas: Number(data.partidas) || 0,
          promedio: data.promedio !== null && data.promedio !== undefined ? Number(data.promedio) : null
        };
      }
    } catch (_) {
      // Silencioso: el juego sigue funcionando sin estadísticas
      estado.stats = null;
    }
  }

  function registrarVoto(rondaId, eleccion, acierto) {
    const cfg = configSupabase();
    if (!cfg) return;
    fetch(cfg.url + "/rest/v1/votos", {
      method: "POST",
      headers: headersSupabase(cfg, { "Prefer": "return=minimal" }),
      body: JSON.stringify({ ronda: rondaId, eleccion, acierto })
    }).catch(() => {});
  }

  function mostrarEstadisticasRonda(ronda, eleccion, acerto) {
    if (!configSupabase() || !estado.stats) {
      ui.resultadoStats.hidden = true;
      return;
    }

    let item = estado.stats.rondas.find((r) => Number(r.ronda) === Number(ronda.id));
    if (!item) {
      item = { ronda: ronda.id, real: 0, ia: 0, aciertos: 0, total: 0 };
      estado.stats.rondas.push(item);
    }

    // Sumar el voto actual a los datos en memoria
    item.total = (Number(item.total) || 0) + 1;
    if (eleccion === "real") item.real = (Number(item.real) || 0) + 1;
    else item.ia = (Number(item.ia) || 0) + 1;
    if (acerto) item.aciertos = (Number(item.aciertos) || 0) + 1;

    if (item.total < 5) {
      ui.statsBarraWrap.hidden = true;
      ui.statsFrase.textContent = "Todavía hay pocos votos en esta ronda";
      ui.resultadoStats.hidden = false;
      return;
    }

    const pctReal = Math.round((item.real / item.total) * 100);
    const pctIa = 100 - pctReal;
    const pctEleccion = eleccion === "real" ? pctReal : pctIa;
    const pctAciertos = Math.round((item.aciertos / item.total) * 100);

    ui.statsLabelReal.textContent = "Real " + pctReal + "%";
    ui.statsLabelIa.textContent = "IA " + pctIa + "%";
    ui.statsRellenoReal.style.width = pctReal + "%";
    ui.statsRellenoIa.style.width = pctIa + "%";
    ui.statsBarraWrap.hidden = false;

    if (!acerto && pctAciertos <= 40) {
      ui.statsFrase.textContent = "Solo el " + pctAciertos + "% acertó esta";
    } else {
      const etiquetaVoto = eleccion === "real" ? "Real" : "IA";
      ui.statsFrase.textContent = "El " + pctEleccion + "% de las personas también dijo " + etiquetaVoto;
    }

    ui.resultadoStats.hidden = false;
  }

  function registrarPartida(puntaje) {
    const cfg = configSupabase();
    if (!cfg) return;
    fetch(cfg.url + "/rest/v1/partidas", {
      method: "POST",
      headers: headersSupabase(cfg, { "Prefer": "return=minimal" }),
      body: JSON.stringify({ puntaje })
    }).catch(() => {});
  }

  function mostrarPromedioFinal(puntajeBase10) {
    if (!configSupabase() || !estado.stats) {
      ui.finalPromedio.hidden = true;
      return;
    }
    const prevPartidas = Number(estado.stats.partidas) || 0;
    const prevProm = estado.stats.promedio !== null ? Number(estado.stats.promedio) : 0;
    const nuevasPartidas = prevPartidas + 1;
    const nuevoProm = Math.round(((prevProm * prevPartidas + puntajeBase10) / nuevasPartidas) * 10) / 10;

    estado.stats.partidas = nuevasPartidas;
    estado.stats.promedio = nuevoProm;

    const promTexto = Number.isInteger(nuevoProm) ? String(nuevoProm) : String(nuevoProm).replace(".", ",");
    ui.finalPromedio.textContent = "El promedio de las " + nuevasPartidas + " personas que jugaron es " + promTexto + " de 10";
    ui.finalPromedio.hidden = false;
  }

  /* ---------- Navegación entre pantallas ---------- */

  function mostrarPantalla(nombre, focoEn) {
    Object.entries(ui.pantallas).forEach(([clave, el]) => {
      const activa = clave === nombre;
      el.hidden = !activa;
      el.classList.toggle("entrar", activa);
    });
    window.scrollTo(0, 0);
    if (focoEn) {
      requestAnimationFrame(() => focoEn.focus({ preventScroll: true }));
    }
  }

  /* ---------- Partida ---------- */

  function empezarPartida() {
    estado.rondas = seleccionarRondasPartida();
    estado.indice = 0;
    estado.aciertos = 0;
    cargarEstadisticas();
    ui.progresoBarra.setAttribute("aria-valuemax", String(estado.rondas.length));
    mostrarPantalla("ronda");
    mostrarRonda();
  }

  function mostrarRonda() {
    const total = estado.rondas.length;
    const n = estado.indice + 1;
    const ronda = estado.rondas[estado.indice];

    estado.respondida = false;

    // Progreso
    ui.progresoTexto.textContent = n + " / " + total;
    ui.progresoRelleno.style.width = (n / total) * 100 + "%";
    ui.progresoBarra.setAttribute("aria-valuenow", String(n));
    ui.progresoBarra.setAttribute("aria-valuetext", "Ronda " + n + " de " + total);
    ui.puntajeParcial.textContent = "✓ " + estado.aciertos;
    ui.tituloRonda.textContent = "Ronda " + n + " de " + total + ". ¿Real o IA?";

    // Reset de la interfaz de la ronda
    ui.resultado.hidden = true;
    ui.resultado.classList.remove("acierto", "error");
    ui.resultadoStats.hidden = true;
    ui.media.classList.remove("acierto", "error");
    ui.acciones.hidden = false;
    ui.botonesRespuesta.forEach((b) => { b.disabled = false; });
    ui.credito.hidden = true;

    cargarImagen(ronda, n);
    precargar(estado.rondas[estado.indice + 1]);

    requestAnimationFrame(() => ui.tituloRonda.focus({ preventScroll: true }));
  }

  function cargarImagen(ronda, n) {
    const token = ++estado.tokenImagen;
    const img = ui.imagen;

    img.classList.remove("cargada");
    img.hidden = false;
    ui.placeholder.hidden = true;
    ui.mediaFondo.style.backgroundImage = "none";

    const altTexto = ronda.alt
      ? ronda.alt + ". ¿Es real o generada con IA?"
      : "Imagen de la ronda " + n + ". ¿Es una foto real o generada con IA?";
    img.alt = altTexto;

    img.onload = () => {
      if (token !== estado.tokenImagen) return;
      ui.mediaFondo.style.backgroundImage = 'url("' + encodeURI(ronda.imagen) + '")';
      ajustarImagen();
      img.classList.add("cargada");
    };

    img.onerror = () => {
      if (token !== estado.tokenImagen) return;
      img.hidden = true;
      img.removeAttribute("src");
      ui.placeholderTexto.textContent = "Imagen de la ronda " + n;
      ui.placeholderRuta.textContent = ronda.imagen;
      ui.placeholder.setAttribute("aria-label", "Imagen de la ronda " + n + " (todavía no disponible)");
      ui.placeholder.hidden = false;
    };

    img.src = ronda.imagen;
  }

  // Escala la imagen para que ocupe el máximo espacio sin recortarse,
  // manteniendo las esquinas redondeadas sobre la imagen real.
  function ajustarImagen() {
    const img = ui.imagen;
    if (img.hidden || !img.naturalWidth) return;
    const margen = 16;
    const ancho = ui.media.clientWidth - margen;
    const alto = ui.media.clientHeight - margen;
    if (ancho <= 0 || alto <= 0) return;
    const escala = Math.min(ancho / img.naturalWidth, alto / img.naturalHeight);
    img.style.width = Math.floor(img.naturalWidth * escala) + "px";
    img.style.height = Math.floor(img.naturalHeight * escala) + "px";
  }

  function precargar(ronda) {
    if (!ronda) return;
    const pre = new Image();
    pre.src = ronda.imagen;
  }

  function responder(eleccion) {
    if (estado.respondida || ui.pantallas.ronda.hidden) return;
    estado.respondida = true;

    const ronda = estado.rondas[estado.indice];
    const acerto = eleccion === ronda.respuesta;
    if (acerto) estado.aciertos++;

    vibrar(acerto ? 15 : [30, 60, 30]);

    ui.botonesRespuesta.forEach((b) => { b.disabled = true; });
    ui.acciones.hidden = true;

    const etiqueta = ronda.respuesta === "real" ? "una foto real" : "una imagen generada con IA";

    ui.resultado.classList.add(acerto ? "acierto" : "error");
    ui.media.classList.add(acerto ? "acierto" : "error");
    ui.resultadoIcono.textContent = acerto ? "✓" : "✕";
    ui.resultadoTitulo.textContent = acerto ? "¡Bien! Acertaste" : "Uy, te equivocaste";
    ui.resultadoRespuesta.textContent = "Es " + etiqueta + ".";
    ui.resultadoExplicacion.textContent = ronda.explicacion;
    ui.puntajeParcial.textContent = "✓ " + estado.aciertos;

    if (ronda.credito) {
      ui.credito.textContent = ronda.credito;
      ui.credito.hidden = false;
    }

    const esUltima = estado.indice === estado.rondas.length - 1;
    ui.btnSiguiente.textContent = esUltima ? "Ver mi resultado" : "Siguiente";

    registrarVoto(ronda.id, eleccion, acerto);
    mostrarEstadisticasRonda(ronda, eleccion, acerto);

    ui.resultado.hidden = false;
    anunciar(ui.resultadoTitulo.textContent + ". " + ui.resultadoRespuesta.textContent + " " + ronda.explicacion);

    requestAnimationFrame(() => {
      ui.btnSiguiente.focus({ preventScroll: true });
      ui.resultado.scrollIntoView({ block: "nearest", behavior: movimientoReducido.matches ? "auto" : "smooth" });
    });
  }

  function siguiente() {
    if (!estado.respondida) return;
    if (estado.indice < estado.rondas.length - 1) {
      estado.indice++;
      mostrarRonda();
    } else {
      mostrarFinal();
    }
  }

  /* ---------- Pantalla final ---------- */

  function mensajeSegunPuntaje(puntaje, total) {
    // Escala el puntaje a base 10 por si hay una cantidad distinta de rondas
    const en10 = total === 10 ? puntaje : Math.round((puntaje / total) * 10);
    return MENSAJES_FINALES.find((m) => en10 <= m.hasta).texto;
  }

  function mostrarFinal() {
    const total = estado.rondas.length;
    const puntaje = estado.aciertos;
    const puntajeBase10 = total === 10 ? puntaje : Math.round((puntaje / total) * 10);

    ui.finalTotal.textContent = total;
    ui.finalMensaje.textContent = mensajeSegunPuntaje(puntaje, total);
    registrarPartida(puntajeBase10);
    mostrarPromedioFinal(puntajeBase10);
    mostrarPantalla("final", ui.finalMensaje);
    animarNumero(ui.finalPuntaje, puntaje);
    anunciar("Sacaste " + puntaje + " de " + total + ". " + ui.finalMensaje.textContent);
  }

  function animarNumero(el, destino) {
    if (movimientoReducido.matches || destino === 0) {
      el.textContent = destino;
      return;
    }
    const duracion = 900;
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min(1, Math.max(0, (ahora - inicio) / duracion));
      const suavizado = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(destino * suavizado);
      if (t < 1) requestAnimationFrame(paso);
    };
    el.textContent = "0";
    requestAnimationFrame(paso);
  }

  /* ---------- Compartir ---------- */

  async function compartir() {
    const total = estado.rondas.length;
    const url = urlParaCompartir();
    const texto = "Saqué " + estado.aciertos + "/" + total + " en ¿Real o IA? ¿Vos cuánto sacás?";

    if (navigator.share) {
      try {
        await navigator.share({ title: "¿Real o IA?", text: texto, url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // El usuario canceló
        // Cualquier otro error: seguimos con el portapapeles
      }
    }

    const ok = await copiarAlPortapapeles(texto + " " + url);
    mostrarToast(ok ? "¡Copiado! Pegalo donde quieras" : "No se pudo copiar. Probá de nuevo.");
  }

  async function copiarAlPortapapeles(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(texto);
        return true;
      } catch (_) { /* seguimos con el método clásico */ }
    }
    try {
      const area = document.createElement("textarea");
      area.value = texto;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      area.setSelectionRange(0, texto.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch (_) {
      return false;
    }
  }

  /* ---------- Paneles (<dialog>) ---------- */

  function abrirPanel(panel, btnCerrar, disparador) {
    ultimoBotonPanel = disparador || document.activeElement;
    if (typeof panel.showModal === "function") {
      panel.showModal();
    } else {
      panel.setAttribute("open", "");
    }
    panel.scrollTop = 0;
    if (btnCerrar) btnCerrar.focus();
  }

  function cerrarPanel(panel) {
    if (typeof panel.close === "function") {
      panel.close();
    } else {
      panel.removeAttribute("open");
    }
    if (ultimoBotonPanel && typeof ultimoBotonPanel.focus === "function") {
      ultimoBotonPanel.focus();
    }
  }

  function algunPanelAbierto() {
    return Boolean(
      (ui.panelComo && ui.panelComo.open) ||
      (ui.panelDetectar && ui.panelDetectar.open) ||
      (ui.panelSobre && ui.panelSobre.open)
    );
  }

  function configurarDialogo(panel, btnCerrar, disparadores) {
    if (!panel) return;
    disparadores.forEach((btn) => {
      if (btn) btn.addEventListener("click", () => abrirPanel(panel, btnCerrar, btn));
    });
    if (btnCerrar) {
      btnCerrar.addEventListener("click", () => cerrarPanel(panel));
    }
    // Cerrar el panel tocando afuera (backdrop)
    panel.addEventListener("click", (e) => {
      if (e.target === panel) {
        const r = panel.getBoundingClientRect();
        const adentro = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!adentro) cerrarPanel(panel);
      }
    });
    // Devolver el foco al cerrar con Escape
    panel.addEventListener("close", () => {
      if (ultimoBotonPanel && typeof ultimoBotonPanel.focus === "function") {
        ultimoBotonPanel.focus();
      }
    });
  }

  /* ---------- Eventos ---------- */

  function conectarEventos() {
    ui.btnEmpezar.addEventListener("click", empezarPartida);

    ui.botonesRespuesta.forEach((b) => {
      b.addEventListener("click", () => responder(b.dataset.respuesta));
    });

    ui.btnSiguiente.addEventListener("click", siguiente);
    ui.btnReiniciar.addEventListener("click", empezarPartida);
    ui.btnCompartir.addEventListener("click", compartir);

    configurarDialogo(ui.panelComo, ui.btnCerrarComo, [ui.btnComo]);
    configurarDialogo(ui.panelDetectar, ui.btnCerrarDetectar, [ui.btnDetectar]);
    configurarDialogo(ui.panelSobre, ui.btnCerrarSobre, [ui.btnSobreInicio, ui.btnSobreFinal]);

    // Atajos de teclado: R = Real, I = IA, N = Siguiente
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || algunPanelAbierto()) return;
      if (ui.pantallas.ronda.hidden) return;
      const tecla = e.key.toLowerCase();
      if (!estado.respondida) {
        if (tecla === "r") { e.preventDefault(); responder("real"); }
        else if (tecla === "i") { e.preventDefault(); responder("ia"); }
      } else if (tecla === "n" || tecla === "arrowright") {
        e.preventDefault();
        siguiente();
      }
    });
  }

  /* ---------- Arranque ---------- */

  async function iniciar() {
    conectarEventos();
    // Reajustar la imagen cuando cambia el tamaño del recuadro (rotar el celular, mostrar el resultado, etc.)
    if ("ResizeObserver" in window) {
      new ResizeObserver(ajustarImagen).observe(ui.media);
    } else {
      window.addEventListener("resize", ajustarImagen);
    }
    ui.btnEmpezar.disabled = true;
    cargarVistasGuardadas();
    todasLasRondas = await cargarRondas();
    ui.finalTotal.textContent = Math.min(RONDAS_POR_PARTIDA, todasLasRondas.length);
    ui.btnEmpezar.disabled = false;
    ui.pantallas.inicio.classList.add("entrar");
  }

  iniciar();
})();
