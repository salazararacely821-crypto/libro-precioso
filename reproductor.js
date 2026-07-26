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

// 1. INICIALIZAR Z-INDEX DE LAS HOJAS
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

// 2. NAVEGACIÓN DEL LIBRO (Sin autoplay)
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
        // Evita que cambie de página si se interactúa con botones, slider o tarjeta de propuesta
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

// 3. CONTROL DE MÚSICA (Solo al hacer clic en Play)
if (playBtn && audio) {
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Previene voltear la página al dar clic al botón
        
        if (audio.paused) {
            audio.play().then(() => {
                playBtn.textContent = '⏸';
            }).catch(err => {
                console.error("Error al intentar reproducir:", err);
            });
        } else {
            audio.pause();
            playBtn.textContent = '▶';
        }
    });
}

// Actualizar barra de progreso y tiempos
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

// 4. LÓGICA DE LA PROPUESTA
function responderSi() {
    const seccionPregunta = document.getElementById('seccion-pregunta');
    const seccionMensaje = document.getElementById('seccion-mensaje');
    
    if (seccionPregunta && seccionMensaje) {
        seccionPregunta.style.display = 'none';
        seccionMensaje.style.display = 'block';
    }
}

// Botón "No" esquivo
const btnNo = document.getElementById('btn-no');
if (btnNo) {
    btnNo.addEventListener('mouseover', moverBotonNo);
    btnNo.addEventListener('touchstart', moverBotonNo);
}

function moverBotonNo() {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
}