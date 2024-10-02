const slider1 = document.getElementById('slider-1');
const slider2 = document.getElementById('slider-2');
const instructionElement = document.getElementById('instruction');
const resultElement = document.getElementById('result');
const loadingIcon = document.getElementById('loading-icon');
const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.getElementById('progress-bar-container');

let stepIndex = 0;
let releasedAtCenter = false;

const instructions = [
    'Slide slider 1 to the end',
    'Slide slider 2 to the middle',
    'Slide slider 1 to the center, release, then slide slider 2 to start',
    'Slide slider 1 to center, release, and further to the end'
];

// Simulate fetching instructions from server
function fetchInstruction() {
    loadingIcon.classList.remove('hidden');
    setTimeout(() => {
        loadingIcon.classList.add('hidden');
        stepIndex = Math.floor(Math.random() * instructions.length);
        updateInstruction();
    }, 1000); // Simulate 1 second delay for fetching
}

function updateInstruction() {
    instructionElement.textContent = instructions[stepIndex];
    progressBarContainer.classList.remove('hidden');
}

function handleSliderChange(slider, thumbId) {
    const position = slider.value;
    document.getElementById(thumbId).style.left = `${position}%`;

    if (stepIndex === 0 && slider.id === 'slider-1' && position == 100) {
        resultElement.textContent = 'Good! Next: ' + instructions[1];
        progressBar.style.width = '25%';
    } else if (stepIndex === 1 && slider.id === 'slider-2' && position == 50) {
        resultElement.textContent = 'Halfway there!';
        progressBar.style.width = '50%';
    }
}

function handleSliderRelease(slider) {
    const position = slider.value;

    if (isInstructionCompleted(slider, position)) {
        verifyCaptcha();
    } else {
        resultElement.textContent = 'Incorrect, try again.';
    }
}

function isInstructionCompleted(slider, position) {
    switch (instructions[stepIndex]) {
        case 'Slide slider 1 to the end':
            return position == 100 && slider.id === 'slider-1';
        case 'Slide slider 2 to the middle':
            return position == 50 && slider.id === 'slider-2';
        case 'Slide slider 1 to the center, release, then slide slider 2 to start':
            if (position == 50 && !releasedAtCenter) {
                releasedAtCenter = true;
                resultElement.textContent = 'Now, slide slider 2 to start.';
                return false;
            }
            return position == 0 && slider.id === 'slider-2' && releasedAtCenter;
        case 'Slide slider 1 to center, release, and further to the end':
            if (position == 50 && !releasedAtCenter) {
                releasedAtCenter = true;
                resultElement.textContent = 'Now, slide further to the end.';
                return false;
            }
            return position == 100 && slider.id === 'slider-1' && releasedAtCenter;
        default:
            return false;
    }
}

function verifyCaptcha() {
    resultElement.textContent = 'Verification successful!';
    progressBar.style.width = '100%';
    loadingIcon.classList.remove('hidden');
    setTimeout(() => {
        loadingIcon.classList.add('hidden');
        console.log("Captcha passed!");
    }, 1000); // Simulate server verification delay
}

slider1.addEventListener('input', () => handleSliderChange(slider1, 'slider-thumb-1'));
slider2.addEventListener('input', () => handleSliderChange(slider2, 'slider-thumb-2'));
slider1.addEventListener('mouseup', () => handleSliderRelease(slider1));
slider2.addEventListener('mouseup', () => handleSliderRelease(slider2));

// Initialize with a random instruction
fetchInstruction();
