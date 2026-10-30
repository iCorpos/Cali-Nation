const ESTANDAR_CALI = 14;
let registros = [];
let camara = null;
let calculando = false;

function validarLogin() {
    let usuario = document.getElementById('usuario').value;
    let clave = document.getElementById('clave').value;

    if (usuario === 'CVC' && clave === 'Lluvias') {
        document.getElementById('login').classList.add('oculto');
        document.getElementById('panel').classList.remove('oculto');
        document.getElementById('error-login').textContent = '';
        document.getElementById('clave').value = '';
    } else {
        document.getElementById('error-login').textContent = 'Usuario o contraseña incorrectos.';
    }
}

function cerrarSesion() {
    document.getElementById('panel').classList.add('oculto');
    document.getElementById('login').classList.remove('oculto');
    document.getElementById('usuario').value = '';
    document.getElementById('clave').value = '';
    if (camara !== null) {
        camara.getTracks().forEach(function(pista) {
            pista.stop();
        });
        camara = null;
    }
    document.getElementById('video').srcObject = null;
    document.getElementById('video').classList.add('oculto');
    document.getElementById('mensaje-camara').textContent = 'Cámara apagada.';
}

function convertirMinutos(hora) {
    let partes = hora.split(':');
    return Number(partes[0]) * 60 + Number(partes[1]);
}

function registrarLluvia() {
    if (calculando) return;

    let direccion = document.getElementById('direccion').value.trim();
    let inicio = document.getElementById('inicio').value;
    let fin = document.getElementById('fin').value;
    let cantidad = document.getElementById('precipitacion').value;
    let responsable = document.getElementById('responsable').value.trim();
    let error = document.getElementById('error-registro');

    if (direccion === '' || inicio === '' || fin === '' || cantidad === '' || responsable === '') {
        error.textContent = 'Completa todos los datos.';
        return;
    }

    let precipitacion = Number(cantidad);
    let tiempoTotal = (convertirMinutos(fin) - convertirMinutos(inicio)) / 60;
    if (!Number.isFinite(precipitacion) || precipitacion < 0) {
        error.textContent = 'La precipitación debe ser un número mayor o igual a cero.';
        return;
    }
    if (tiempoTotal <= 0) {
        error.textContent = 'La hora de fin debe ser posterior a la hora de inicio.';
        return;
    }

    // Fórmula del Caso B con el tiempo expresado en horas.
    let calculo = precipitacion * ESTANDAR_CALI * tiempoTotal;
    let ajuste = 0;
    let horaInicio = convertirMinutos(inicio);
    if (horaInicio >= 900 && horaInicio <= 1080) {
        ajuste = calculo * 0.053;
    }
    let resultadoFinal = calculo + ajuste;
    if (!Number.isFinite(calculo) || !Number.isFinite(resultadoFinal)) {
        error.textContent = 'El valor ingresado es demasiado grande para calcularlo.';
        return;
    }

    error.textContent = '';
    calculando = true;
    document.getElementById('boton-registrar').disabled = true;
    document.getElementById('resultado').textContent = '';
    document.getElementById('reloj').classList.remove('oculto');

    setTimeout(function() {
        let comparacion;
        if (precipitacion === ESTANDAR_CALI) {
            comparacion = 'Igual al estándar de 14 mm.';
        } else if (precipitacion > ESTANDAR_CALI) {
            comparacion = 'Por encima del estándar de 14 mm.';
        } else {
            comparacion = 'Por debajo del estándar de 14 mm.';
        }

        document.getElementById('reloj').classList.add('oculto');
        document.getElementById('resultado').textContent =
            'Zona: ' + direccion + '\n' +
            'Registrado por: ' + responsable + '\n' +
            'Duración: ' + tiempoTotal.toFixed(2) + ' horas.\n' +
            'Precipitación registrada: ' + precipitacion + ' mm.\n' +
            comparacion + '\n' +
            'Cálculo (precipitación × 14 × horas): ' + calculo.toFixed(2) + '\n' +
            'Ajuste del 5,3 % sobre el cálculo: ' + ajuste.toFixed(2) + '\n' +
            'Resultado final: ' + resultadoFinal.toFixed(2);

        registros.push({ direccion: direccion, precipitacion: precipitacion });
        dibujarGrafica();
        setTimeout(function() {
            validarClaveSeguridad();
        }, 500);
    }, 1500);
}

function validarClaveSeguridad() {
    let clave = prompt('Escribe CLIMA para registrar otra zona:');
    calculando = false;
    document.getElementById('boton-registrar').disabled = false;

    if (clave === 'CLIMA') {
        document.getElementById('direccion').value = '';
        document.getElementById('inicio').value = '';
        document.getElementById('fin').value = '';
        document.getElementById('precipitacion').value = '';
        document.getElementById('responsable').value = '';
        document.getElementById('foto').classList.add('oculto');
    } else {
        alert('Clave incorrecta. Debes iniciar sesión nuevamente.');
        cerrarSesion();
    }
}

function dibujarGrafica() {
    let grafica = document.getElementById('grafica');
    grafica.textContent = '';
    let maximo = ESTANDAR_CALI;
    for (let i = 0; i < registros.length; i++) {
        if (registros[i].precipitacion > maximo) {
            maximo = registros[i].precipitacion;
        }
    }
    for (let i = 0; i < registros.length; i++) {
        let texto = document.createElement('div');
        texto.className = 'dato-zona';
        texto.textContent = registros[i].direccion + ': ' + registros[i].precipitacion + ' mm';
        let fondo = document.createElement('div');
        fondo.className = 'fondo-barra';
        let barra = document.createElement('div');
        barra.className = 'barra';
        barra.style.width = (registros[i].precipitacion / maximo * 100) + '%';
        fondo.appendChild(barra);
        grafica.appendChild(texto);
        grafica.appendChild(fondo);
    }
}

async function encenderCamara() {
    try {
        if (camara === null) {
            camara = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        document.getElementById('video').srcObject = camara;
        document.getElementById('video').classList.remove('oculto');
        document.getElementById('mensaje-camara').textContent = 'Cámara encendida.';
    } catch (error) {
        document.getElementById('mensaje-camara').textContent = 'No se pudo abrir la cámara. Revisa el permiso del navegador y que haya una cámara conectada.';
    }
}

function tomarFoto() {
    let video = document.getElementById('video');
    let foto = document.getElementById('foto');
    if (camara === null || video.videoWidth === 0) {
        document.getElementById('mensaje-camara').textContent = 'Primero enciende la cámara y espera a que aparezca el video.';
        return;
    }
    foto.width = video.videoWidth;
    foto.height = video.videoHeight;
    let contexto = foto.getContext('2d');
    contexto.drawImage(video, 0, 0, foto.width, foto.height);
    foto.classList.remove('oculto');
    document.getElementById('mensaje-camara').textContent = 'Foto capturada.';
}
