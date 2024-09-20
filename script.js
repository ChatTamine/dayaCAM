const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const downloadBtn = document.getElementById('download-btn');
const switchBtn = document.getElementById('switch-btn'); // Nuevo botón
let currentStream = null;
let useFrontCamera = true; // Variable para rastrear qué cámara se está utilizando

// Función para detener el stream actual
const stopStream = () => {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
};

// Función para iniciar la cámara
const startCamera = (facingMode) => {
    stopStream();
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode } // Configuramos si es frontal o trasera
    })
    .then(stream => {
        currentStream = stream;
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error al acceder a la cámara: ', err);
    });
};

// Inicializamos con la cámara frontal
startCamera('user');

// Cambiar entre cámara frontal y trasera
switchBtn.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera; // Cambiamos el estado de la cámara
    startCamera(useFrontCamera ? 'user' : 'environment'); // 'user' es frontal, 'environment' es trasera
});

// Capturar la foto
captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Añadir el marco de la Kiss Cam
    const kissFrame = document.getElementById('kiss-frame');
    kissFrame.onload = () => {
        context.drawImage(kissFrame, 0, 0, canvas.width, canvas.height);

        // Mostrar el botón de descarga y el canvas
        downloadBtn.style.display = 'inline';
        canvas.style.display = 'block';
        video.style.display = 'none';
    };

    // En caso de que la imagen del marco ya esté cargada
    if (kissFrame.complete) {
        kissFrame.onload();
    }
});

// Descargar la foto
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'kiss-cam-photo.png';
    link.click();
});

