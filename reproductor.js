let paginaActual = 0;
const paginas = document.querySelectorAll('.pagina');
const totalPaginas = paginas.length;

function inicializarPaginas() {
    paginas.forEach((pagina, index) => {
        pagina.style.zIndex = totalPaginas - index;
        pagina.classList.remove('pasada');
    });

    // Verificar si ya respondió anteriormente en este navegador
    comprobarRespuestaGuardada();
}

function siguientePagina() {
    if (paginaActual < totalPaginas - 1) {
        paginas[paginaActual].classList.add('pasada');
        paginaActual++;
    }
}

function paginaAnterior() {
    if (paginaActual > 0) {
        paginaActual--;
        paginas[paginaActual].classList.remove('pasada');
    }
}

paginas.forEach((pagina, index) => {
    pagina.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.classList.contains('btn-play')) {
            return;
        }
        if (index === paginaActual) {
            siguientePagina();
        }
    });
});

/* REPRODUCTOR DE MÚSICA */
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

if (playBtn && audio) {
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = '❚❚';
        } else {
            audio.pause();
            playBtn.textContent = '▶';
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const porcentaje = (audio.currentTime / audio.duration) * 100;
            progress.value = porcentaje;

            let mins = Math.floor(audio.currentTime / 60);
            let secs = Math.floor(audio.currentTime % 60);
            if (secs < 10) secs = '0' + secs;
            currentTimeEl.textContent = `${mins}:${secs}`;
        }
    });

    progress.addEventListener('input', () => {
        if (audio.duration) {
            const nuevoTiempo = (progress.value / 100) * audio.duration;
            audio.currentTime = nuevoTiempo;
        }
    });
}

/* ==========================================
   RESPUESTAS DE LA PROPUESTA CON PERSISTENCIA
   ========================================== */

function responderSi() {
    localStorage.setItem('respuestaPropuesta', 'si');
    mostrarMensajeExito();
}

function responderNo() {
    localStorage.setItem('respuestaPropuesta', 'no');
    mostrarMensajeNo();
}

function mostrarMensajeExito() {
    const secPregunta = document.getElementById('seccion-pregunta');
    const secMensaje = document.getElementById('seccion-mensaje');
    const secMensajeNo = document.getElementById('seccion-mensaje-no');

    if (secPregunta) secPregunta.style.display = 'none';
    if (secMensajeNo) secMensajeNo.style.display = 'none';
    if (secMensaje) secMensaje.style.display = 'block';
}

function mostrarMensajeNo() {
    const secPregunta = document.getElementById('seccion-pregunta');
    const secMensaje = document.getElementById('seccion-mensaje');
    const secMensajeNo = document.getElementById('seccion-mensaje-no');

    if (secPregunta) secPregunta.style.display = 'none';
    if (secMensaje) secMensaje.style.display = 'none';
    if (secMensajeNo) secMensajeNo.style.display = 'block';
}

// Al cargar, consulta si ya se guardó alguna respuesta previamente
function comprobarRespuestaGuardada() {
    const respuesta = localStorage.getItem('respuestaPropuesta');
    if (respuesta === 'si') {
        mostrarMensajeExito();
    } else if (respuesta === 'no') {
        mostrarMensajeNo();
    }
}

inicializarPaginas();
