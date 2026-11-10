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

  // Copia de respaldo de data/rondas.json. Se usa SOLO si el navegador bloquea
  // la carga del JSON (pasa al abrir index.html con doble clic, vía file://).
  // Si editás rondas.json y querés probarlo sin servidor, actualizá también esto.
  const RONDAS_RESPALDO = [
    { id: 1, imagen: "images/ronda-01.jpg", respuesta: "ia", explicacion: "Mirá las manos: tienen dedos de más y los bordes se funden con el fondo.", credito: "Generada con Gemini" },
    { id: 2, imagen: "images/ronda-02.jpg", respuesta: "real", explicacion: "Fijate en los carteles de la calle: el texto se lee perfecto y tiene sentido. La IA todavía suele inventar letras que no forman palabras.", credito: "Foto propia del grupo" },
    { id: 3, imagen: "images/ronda-03.jpg", respuesta: "ia", explicacion: "La piel es demasiado lisa, sin poros ni marcas, y cada aro es distinto. Esa perfección de revista es una pista típica de la IA.", credito: "Generada con Midjourney" },
    { id: 4, imagen: "images/ronda-04.jpg", respuesta: "real", explicacion: "La sombra del perro coincide con la dirección del sol y el pelaje tiene imperfecciones y mugre real. La luz coherente es difícil de falsificar.", credito: "Foto propia del grupo" },
    { id: 5, imagen: "images/ronda-05.jpg", respuesta: "ia", explicacion: "Las ventanas de los edificios no se alinean y algunas líneas rectas se curvan o se derriten. La IA falla mucho con la geometría y la perspectiva.", credito: "Generada con DALL·E" },
    { id: 6, imagen: "images/ronda-06.jpg", respuesta: "real", explicacion: "El mate tiene desgaste, la yerba está desparramada y los reflejos en la mesa coinciden con la ventana. Los objetos cotidianos con historia suelen delatar una foto real.", credito: "Foto propia del grupo" },
    { id: 7, imagen: "images/ronda-07.jpg", respuesta: "ia", explicacion: "Probá leer el cartel: las letras parecen letras, pero no forman ninguna palabra. Es una de las pistas más fáciles de detectar.", credito: "Generada con Gemini" },
    { id: 8, imagen: "images/ronda-08.jpg", respuesta: "real", explicacion: "Cada cara es distinta, los gestos son espontáneos y hay desorden natural en el fondo. En las imágenes de IA las caras del fondo suelen deformarse o repetirse.", credito: "Foto propia del grupo" },
    { id: 9, imagen: "images/ronda-09.jpg", respuesta: "ia", explicacion: "La comida es demasiado perfecta y simétrica, con una luz de estudio que no viene de ningún lado. Mirá también el vapor: forma figuras raras que no siguen el aire.", credito: "Generada con Stable Diffusion" },
    { id: 10, imagen: "images/ronda-10.jpg", respuesta: "real", explicacion: "En las zonas oscuras hay ruido digital granulado y el horizonte tiene detalles que no se repiten. La IA tiende a suavizar todo y a copiar patrones.", credito: "Foto propia del grupo" }
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
    btnSiguiente: $("btn-siguiente"),
    finalPuntaje: $("final-puntaje"),
    finalTotal: $("final-total"),
    finalMensaje: $("final-mensaje"),
    btnCompartir: $("btn-compartir"),
    btnReiniciar: $("btn-reiniciar"),
    btnComo: $("btn-como"),
    panelComo: $("panel-como"),
    btnCerrarComo: $("btn-cerrar-como"),
    toast: $("toast"),
    anuncio: $("anuncio")
  };

  const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Estado ---------- */

  let todasLasRondas = [];
  const estado = {
    rondas: [],
    indice: 0,
    aciertos: 0,
    respondida: false,
    tokenImagen: 0
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
    estado.rondas = mezclar(todasLasRondas);
    estado.indice = 0;
    estado.aciertos = 0;
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

    ui.finalTotal.textContent = total;
    ui.finalMensaje.textContent = mensajeSegunPuntaje(puntaje, total);
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

  /* ---------- Panel "Cómo se hizo" ---------- */

  function abrirPanel() {
    const panel = ui.panelComo;
    if (typeof panel.showModal === "function") {
      panel.showModal();
    } else {
      panel.setAttribute("open", "");
    }
    ui.btnCerrarComo.focus();
  }

  function cerrarPanel() {
    const panel = ui.panelComo;
    if (typeof panel.close === "function") {
      panel.close();
    } else {
      panel.removeAttribute("open");
    }
    ui.btnComo.focus();
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
    ui.btnComo.addEventListener("click", abrirPanel);
    ui.btnCerrarComo.addEventListener("click", cerrarPanel);

    // Cerrar el panel tocando afuera
    ui.panelComo.addEventListener("click", (e) => {
      if (e.target === ui.panelComo) {
        const r = ui.panelComo.getBoundingClientRect();
        const adentro = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!adentro) cerrarPanel();
      }
    });
    ui.panelComo.addEventListener("close", () => ui.btnComo.focus());

    // Atajos de teclado: R = Real, I = IA, N = Siguiente
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || ui.panelComo.open) return;
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
    todasLasRondas = await cargarRondas();
    ui.finalTotal.textContent = todasLasRondas.length;
    ui.btnEmpezar.disabled = false;
    ui.pantallas.inicio.classList.add("entrar");
  }

  iniciar();
})();
