# ¿Real o IA?

Juego web para entrenar el ojo crítico frente a imágenes generadas con inteligencia artificial.
Trabajo práctico · Seminario de IA · FPyCS-UNLP · 2026.

Hecho con HTML, CSS y JavaScript puros: no necesita instalar nada ni compilar.

```
/index.html        → estructura de las pantallas y paneles
/styles.css        → estilo "Liquid Glass"
/config.js         → URL y clave pública de Supabase (opcional)
/app.js            → lógica del juego y conexión REST con Supabase
/supabase.sql      → tablas, políticas y función RPC para pegar en Supabase
/data/rondas.json  → las 10 rondas (imagen, respuesta, explicación, crédito)
/images/           → acá van las imágenes
```

---

## 1. Cómo reemplazar las imágenes

1. Poné tus imágenes en la carpeta `images/` con estos nombres: `ronda-01.jpg`, `ronda-02.jpg` … `ronda-10.jpg`.
   - Formato recomendado: JPG o WebP, vertical (4:5 o 3:4), de unos 1080 px de ancho y menos de 400 KB cada una para que cargue rápido en el celular.
   - Si usás otro nombre o extensión (por ejemplo `.png`), cambiá la ruta en `rondas.json`.
2. Mientras una imagen no exista, el juego muestra un recuadro de vidrio que dice "Imagen de la ronda N". No se rompe nada.

> ⚠️ Antes de subir las fotos, borrales los metadatos (EXIF): pueden revelar la cámara o la herramienta con que se hicieron y "spoilear" la respuesta.

## 2. Cómo editar `data/rondas.json`

Cada ronda es un objeto así:

```json
{
  "id": 1,
  "imagen": "images/ronda-01.jpg",
  "respuesta": "ia",
  "explicacion": "Mirá las manos: tienen dedos de más y los bordes se funden con el fondo.",
  "credito": "Generada con Gemini"
}
```

| Campo         | Qué poner |
|---------------|-----------|
| `id`          | Un número único. |
| `imagen`      | Ruta a la imagen, relativa a `index.html`. |
| `respuesta`   | `"real"` o `"ia"` (en minúscula). |
| `explicacion` | 1 o 2 oraciones con la pista para darse cuenta. Se muestra después de responder. |
| `credito`     | Se muestra sobre la imagen después de responder (ej. "Foto propia del grupo", "Generada con Midjourney"). |
| `alt` *(opcional)* | Descripción breve para lectores de pantalla, sin revelar la respuesta (ej. "Una persona tomando mate en una plaza"). |

Consejos:
- Respetá las comillas dobles y las comas entre objetos (la última ronda no lleva coma). Si algo falla, pegá el archivo en https://jsonlint.com para encontrar el error.
- Podés poner más o menos de 10 rondas: el juego se adapta. El orden se mezcla al azar en cada partida.
- Usá voseo en las explicaciones ("mirá", "fijate", "probá").

**Importante:** `app.js` tiene una copia de respaldo de las rondas (`RONDAS_RESPALDO`) que solo se usa si el navegador bloquea la lectura del JSON, cosa que pasa al abrir `index.html` con doble clic. Una vez publicado en Vercel/Netlify siempre se usa `rondas.json`. Si querés que la versión "doble clic" también muestre tus cambios, copiá las rondas ahí también.

## 3. Cómo probarlo en tu computadora

**Opción rápida:** doble clic en `index.html`. Funciona, pero usa la copia de respaldo de las rondas (ver arriba).

**Opción recomendada (servidor local, lee `rondas.json` de verdad):** abrí una terminal en la carpeta del proyecto y ejecutá uno de estos comandos:

```bash
# Si tenés Python (viene instalado en Mac)
python3 -m http.server 8000

# o si tenés Node.js
npx serve .
```

Después entrá a http://localhost:8000 (o la dirección que te muestre `serve`).

Para verlo como en el celular: en Chrome, abrí las herramientas de desarrollador (`Cmd + Option + I`) y activá la vista de dispositivo (`Cmd + Shift + M`), eligiendo un iPhone.

## 4. Cómo publicarlo gratis

### Opción A · Netlify Drop (la más fácil, sin cuenta de GitHub)

1. Entrá a https://app.netlify.com/drop.
2. Arrastrá la **carpeta completa** del proyecto a la página.
3. En unos segundos te da un link del tipo `https://nombre-raro.netlify.app`. ¡Listo!
4. Para que no se borre, creá una cuenta gratis (te lo ofrece ahí mismo). Desde *Site configuration → Change site name* podés elegir un nombre como `real-o-ia.netlify.app`.
5. Para actualizarlo: en el sitio, pestaña *Deploys*, volvé a arrastrar la carpeta.

### Opción B · Vercel (con GitHub)

1. Creá un repositorio en https://github.com/new y subí todos los archivos (botón *uploading an existing file* y arrastrás todo).
2. Entrá a https://vercel.com, iniciá sesión con tu cuenta de GitHub.
3. *Add New… → Project*, elegí el repositorio y tocá **Import**.
4. En *Framework Preset* dejá **Other**. No hace falta tocar nada más: tocá **Deploy**.
5. Te da un link `https://tu-proyecto.vercel.app`. Cada vez que subas un cambio a GitHub, se actualiza solo.

### Después de publicar

Abrí `app.js` y poné la URL definitiva en la primera constante, para que el botón "Compartir mi resultado" siempre comparta el link correcto:

```js
const URL_JUEGO = "https://real-o-ia.vercel.app";
```

---

## 5. Cómo activar las estadísticas colectivas con Supabase (opcional)

Si dejás `config.js` vacío, el juego funciona completo sin estadísticas ni errores. Para activar el porcentaje de respuestas por ronda y el promedio general:

1. **Crear un proyecto gratis en Supabase:**
   - Entrá a https://supabase.com, iniciá sesión y tocá **New project**.
   - Elegí un nombre (por ejemplo `real-o-ia`), poné una contraseña para la base de datos y elegí la región más cercana (por ejemplo *South America - São Paulo*).
2. **Crear las tablas y la función SQL:**
   - En el menú izquierdo de Supabase, entrá a **SQL Editor** → **New query**.
   - Copiá todo el contenido del archivo `supabase.sql` de este proyecto, pegalo ahí y tocá **Run**.
3. **Copiar las credenciales en `config.js`:**
   - En Supabase, andá a **Project Settings** (el ícono de engranaje abajo a la izquierda) → **API**.
   - Copiá **Project URL** y la clave **anon / public** (en *Project API keys*).
   - Abrí `config.js` y pegá ambos valores:

```js
window.SUPABASE_URL = "https://tu-proyecto.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

4. Guardá y subí el cambio (si usás GitHub + Vercel/Netlify, hacé commit y push).

---

## Accesibilidad y detalles

- Se puede jugar solo con teclado: `Tab` para moverse, `R` = Real, `I` = IA, `N` o `→` = Siguiente.
- Respeta el modo oscuro del sistema y la opción "Reducir movimiento" (desactiva las animaciones del fondo).
- Botones de más de 48 px de alto, pensados para el pulgar.

