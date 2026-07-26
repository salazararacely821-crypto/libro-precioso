// Variables globales
let paginaActual = 0;
const paginas = document.querySelectorAll('.pagina');
const totalPaginas = paginas.length;

// Elementos del reproductor
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// 1. COMPROBAR SI YA RESPONDIÓ PREVIAMENTE (Guardado local)
document.addEventListener('DOMContentLoaded', () => {
    const respuestaGuardada = localStorage.getItem('respuesta_propuesta');
    if (respuestaGuardada) {
        mostrarRespuestaGuardada(respuestaGuardada);
    }
});

function mostrarRespuestaGuardada(tipoRespuesta) {
    const seccionPregunta = document.getElementById('seccion-pregunta');
    const seccionMensaje = document.getElementById('seccion-mensaje');
    const seccionMensajeNo = document.getElementById('seccion-mensaje-no');

    if (seccionPregunta) seccionPregunta.style.display = 'none';

    if (tipoRespuesta === 'si' && seccionMensaje) {
        if (seccionMensajeNo) seccionMensajeNo.style.display = 'none';
        seccionMensaje.style.display = 'block';
    } else if (tipoRespuesta === 'no' && seccionMensajeNo) {
        if (seccionMensaje) seccionMensaje.style.display = 'none';
        seccionMensajeNo.style.display = 'block';
    }
}

// 2. INICIALIZAR Z-INDEX DE LAS HOJAS
function actualizarZIndex() {
    paginas.forEach((pagina, index) => {
        if (index < paginaActual) {
            pagina.style.zIndex = index + 1;
        } else {
            pagina.style.zIndex = totalPaginas - index;
        }
    });
}
actualizarZIndex();

// 3. NAVEGACIÓN DEL LIBRO
function siguientePagina() {
    if (paginaActual < totalPaginas) {
        paginas[paginaActual].classList.add('volteada');
        paginaActual++;
        actualizarZIndex();
    }
}

function paginaAnterior() {
    if (paginaActual > 0) {
        paginaActual--;
        paginas[paginaActual].classList.remove('volteada');
        actualizarZIndex();
    }
}

// Evento para pasar página al hacer clic en las hojas
paginas.forEach((pagina) => {
    pagina.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('.card-propuesta') || e.target.closest('.reproductor-card')) {
            return;
        }
        if (pagina.classList.contains('volteada')) {
            paginaAnterior();
        } else {
            siguientePagina();
        }
    });
});

// 4. CONTROL DE MÚSICA
if (playBtn && audio) {
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (audio.paused) {
            audio.play().then(() => {
                playBtn.textContent = '⏸';
            }).catch(err => {
                console.error("Error al intentar reproducir audio:", err);
            });
        } else {
            audio.pause();
            playBtn.textContent = '▶';
        }
    });
}

if (audio && progress) {
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const porcentaje = (audio.currentTime / audio.duration) * 100;
            progress.value = porcentaje;
            if (currentTimeEl) currentTimeEl.textContent = formatearTiempo(audio.currentTime);
            if (durationEl) durationEl.textContent = formatearTiempo(audio.duration);
        }
    });

    progress.addEventListener('input', () => {
        const nuevoTiempo = (progress.value / 100) * audio.duration;
        audio.currentTime = nuevoTiempo;
    });
}

function formatearTiempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

// 5. LÓGICA DE LA PROPUESTA Y GUARDADO DEFINITIVO
function responderSi() {
    localStorage.setItem('respuesta_propuesta', 'si');
    mostrarRespuestaGuardada('si');
}

function responderNo() {
    localStorage.setItem('respuesta_propuesta', 'no');
    mostrarRespuestaGuardada('no');
}
