const slider = document.getElementById('slider');
const resultElement = document.getElementById('result');
let startTime = null;
const socket = io();

// Listen for feedback from the server
socket.on('invalidAttempt', (data) => {
    resultElement.textContent = data.message;
});

socket.on('validCaptcha', (data) => {
    resultElement.textContent = data.message;
    // Optionally reset the slider after success
});

socket.on('cooldownStart', (data) => {
    resultElement.textContent = data.message;
    slider.setAttribute('disabled', true);  // Disable slider during cooldown
});

socket.on('cooldownEnd', (data) => {
    resultElement.textContent = data.message;
    slider.removeAttribute('disabled');  // Re-enable slider after cooldown
});

socket.on('cooldownActive', (data) => {
    resultElement.textContent = data.message;
});

// Record start time when the user interacts with the slider
function handleSliderChange() {
    if (startTime === null) {
        startTime = Date.now();
    }
}

// Send slider position and time difference to server when released
function handleSliderRelease() {
    const position = slider.value;
    const endTime = Date.now();
    const timeDiff = endTime - startTime;

    // Send data to server for validation
    socket.emit('sliderRelease', { position, timeDiff });

    startTime = null;  // Reset start time for next interaction
}

slider.addEventListener('input', handleSliderChange);
slider.addEventListener('mouseup', handleSliderRelease);
