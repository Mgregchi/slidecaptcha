const slider = document.getElementById('slider');
const instructionElement = document.getElementById('instruction');
const sliderThumb = document.getElementById('slider-thumb');
const resultElement = document.getElementById('result');

let stepIndex = 0;
const instructions = [
    'Slide to the end',
    'Slide to the middle',
    'Slide to center, release and back to start',
    'Slide to center, release and further to the end'
];

function updateInstruction() {
    if (stepIndex < instructions.length) {
        instructionElement.textContent = instructions[stepIndex];
    } else {
        verifyCaptcha();
    }
}

function handleSliderChange() {
    const position = slider.value;
    sliderThumb.style.left = `${position}%`;
}

function handleSliderRelease() {
    const position = slider.value;

    if (isInstructionCompleted(position)) {
        stepIndex++;
        resetSlider();
        updateInstruction();
    }
}

function isInstructionCompleted(position) {
    switch (instructions[stepIndex]) {
        case 'Slide to the end':
            return position == 100;
        case 'Slide to the middle':
            return position == 50;
        case 'Slide to center, release and back to start':
            return position == 50 && stepIndex > 0;
        case 'Slide to center, release and further to the end':
            return position == 100 && stepIndex > 1;
        default:
            return false;
    }
}

function resetSlider() {
    slider.value = 0;
    sliderThumb.style.left = '0%';
}

function verifyCaptcha() {
    resultElement.textContent = 'Verification successful!';
    // Call your function here
    console.log("Captcha passed!");
}

// Initial instruction
updateInstruction();

slider.addEventListener('input', handleSliderChange);
slider.addEventListener('mouseup', handleSliderRelease);
