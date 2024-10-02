const slider = document.getElementById('slider');
const instructionElement = document.getElementById('instruction');
const sliderThumb = document.getElementById('slider-thumb');
const resultElement = document.getElementById('result');
const loadingIcon = document.getElementById('loading-icon');

let stepIndex = 0;
let releasedAtCenter = false;

const instructions = [
    'Slide to the end',
    'Slide to the middle',
    'Slide to center, release and back to start',
    'Slide to center, release and further to the end'
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
}

function handleSliderChange() {
    const position = slider.value;
    sliderThumb.style.left = `${position}%`;
}

function handleSliderRelease() {
    const position = slider.value;

    if (isInstructionCompleted(position)) {
        verifyCaptcha();
    } else {
        resultElement.textContent = 'Incorrect, try again.';
    }
}

function isInstructionCompleted(position) {
    switch (instructions[stepIndex]) {
        case 'Slide to the end':
            return position == 100;
        case 'Slide to the middle':
            return position == 50;
        case 'Slide to center, release and back to start':
            if (position == 50 && !releasedAtCenter) {
                releasedAtCenter = true;
                resultElement.textContent = 'Now, slide back to start.';
                return false;
            }
            return position == 0 && releasedAtCenter;
        case 'Slide to center, release and further to the end':
            if (position == 50 && !releasedAtCenter) {
                releasedAtCenter = true;
                resultElement.textContent = 'Now, slide further to the end.';
                return false;
            }
            return position == 100 && releasedAtCenter;
        default:
            return false;
    }
}

function verifyCaptcha() {
    resultElement.textContent = 'Verification successful!';
    loadingIcon.classList.remove('hidden');
    setTimeout(() => {
        loadingIcon.classList.add('hidden');
        console.log("Captcha passed!");
    }, 1000); // Simulate server verification delay
}

function resetSlider() {
    slider.value = 0;
    sliderThumb.style.left = '0%';
    releasedAtCenter = false;
}

// Initialize with a random instruction
fetchInstruction();

slider.addEventListener('input', handleSliderChange);
slider.addEventListener('mouseup', handleSliderRelease);
