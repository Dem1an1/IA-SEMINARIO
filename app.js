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
    { id: 1, imagen: "images/ronda-01.jpg", respuesta: "ia", explicacion: "Mirá las manos que sostienen el mate: la mano derecha tiene seis dedos y algunas falanges se deforman al agarrar la calabaza.", credito: "Generada con IA (Gemini)" },
    { id: 2, imagen: "images/ronda-02.jpg", respuesta: "real", explicacion: "Fijate en los carteles de la vidriera: cada palabra en inglés y cada número del horario se leen perfecto. La IA suele deformar las letras chicas.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 3, imagen: "images/ronda-03.jpg", respuesta: "ia", explicacion: "La piel es demasiado lisa, casi sin poros, y cada aro es completamente distinto: uno es una argolla dorada y el otro un colgante plateado.", credito: "Generada con IA (Gemini)" },
    { id: 4, imagen: "images/ronda-04.jpg", respuesta: "real", explicacion: "Mirá el pelaje del perro y los pastos desenfocados adelante: hay pelos sueltos, bigotes irregulares y tierra real en el suelo. La IA suele alisar todo.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 5, imagen: "images/ronda-05.jpg", respuesta: "ia", explicacion: "Las ventanas y los balcones no mantienen una alineación coherente entre pisos y varias rejas de hierro se tuercen. La IA falla seguido con la arquitectura.", credito: "Generada con IA (Gemini)" },
    { id: 6, imagen: "images/ronda-06.jpg", respuesta: "real", explicacion: "La calabaza del mate tiene marcas reales de desgaste, el cincelado de la virola es irregular y la yerba desparramada muestra palo, polvo y hojas todas distintas.", credito: "Foto real libre (Wikimedia Commons)" },
    { id: 7, imagen: "images/ronda-07.jpg", respuesta: "ia", explicacion: "Probá leer el cartel del kiosco y las hojas de precios: parecen palabras, pero son letras inventadas sin ningún sentido. Es una de las pistas más claras.", credito: "Generada con IA (Gemini)" },
    { id: 8, imagen: "images/ronda-08.jpg", respuesta: "real", explicacion: "Los gestos son espontáneos, las manos entrelazadas tienen anatomía normal y la trama del poncho mantiene su dibujo en los pliegues sin derretirse.", credito: "Foto real sin copyright (Unsplash · CC0)" },
    { id: 9, imagen: "images/ronda-09.jpg", respuesta: "ia", explicacion: "Fijate en el tenedor: tiene cinco dientes y el de la punta se tuerce raro. Además, el vapor del guiso dibuja rulos simétricos imposibles.", credito: "Generada con IA (Gemini)" },
    { id: 10, imagen: "images/ronda-10.jpg", respuesta: "real", explicacion: "En las zonas oscuras se nota el grano real del sensor de la cámara y la textura de las rocas volcánicas con nieve nunca repite el mismo patrón.", credito: "Foto real sin copyright (Unsplash · CC0)" }
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

  function mostrarPromedioFinal(puntaje, total) {
    if (!configSupabase() || !estado.stats) {
      ui.finalPromedio.hidden = true;
      return;
    }
    const prevPartidas = Number(estado.stats.partidas) || 0;
    const prevProm = estado.stats.promedio !== null ? Number(estado.stats.promedio) : 0;
    const nuevasPartidas = prevPartidas + 1;
    const nuevoProm = Math.round(((prevProm * prevPartidas + puntaje) / nuevasPartidas) * 10) / 10;

    estado.stats.partidas = nuevasPartidas;
    estado.stats.promedio = nuevoProm;

    const promTexto = Number.isInteger(nuevoProm) ? String(nuevoProm) : String(nuevoProm).replace(".", ",");
    ui.finalPromedio.textContent = "El promedio de las " + nuevasPartidas + " personas que jugaron es " + promTexto + " de " + total;
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
    estado.rondas = mezclar(todasLasRondas);
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

    ui.finalTotal.textContent = total;
    ui.finalMensaje.textContent = mensajeSegunPuntaje(puntaje, total);
    registrarPartida(puntaje);
    mostrarPromedioFinal(puntaje, total);
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
    todasLasRondas = await cargarRondas();
    ui.finalTotal.textContent = todasLasRondas.length;
    ui.btnEmpezar.disabled = false;
    ui.pantallas.inicio.classList.add("entrar");
  }

  iniciar();
})();
