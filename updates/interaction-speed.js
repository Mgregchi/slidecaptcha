/**
 * Anti-Bot Captcha with Interaction Speed Verification
 * This script is used to verify the user's interaction speed with the slider.
 * 
 * We will compare the time taken by the user to complete the action and the position of the slider.
 * We'll also tell user how fast they completed the action and if they are too fast, we'll show a warning.
 * 
 * Also confirm the challenge is not expired. So the server should store the timestamp when the challenge was generated.
 */

const slider = document.getElementById('slider');
const instructionElement = document.getElementById('instruction');
const sliderThumb = document.getElementById('slider-thumb');
const resultElement = document.getElementById('result');

let stepIndex = 0;
let startTime = null;  // To store the timestamp when sliding starts
let endTime = null;    // To store the timestamp when sliding ends

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

    // Record the start time when the user first interacts with the slider
    if (startTime === null) {
        startTime = Date.now();  // Timestamp in milliseconds
    }
}

function handleSliderRelease() {
    const position = slider.value;

    // Record the end time when the user releases the slider
    endTime = Date.now();
    const timeDiff = endTime - startTime;  // Calculate the time difference in milliseconds

    if (isInstructionCompleted(position, timeDiff)) {
        verifyCaptcha();
    } else {
        resultElement.textContent = 'Incorrect, try again.';
    }
}

function isInstructionCompleted(position, timeDiff) {
    const timeLimit = 2000;  // 2 seconds time limit for the action

    // Check if the user took longer than 2 seconds to complete the action
    if (timeDiff < timeLimit) {
        resultElement.textContent = 'Too fast! Possible bot detected.';
        return false;
    }

    // Now compare the position based on the current instruction
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
    startTime = null;  // Reset start time for the next interaction
}

function verifyCaptcha() {
    resultElement.textContent = 'Verification successful!';
    console.log("Captcha passed!");
}

// Initial instruction
updateInstruction();

slider.addEventListener('input', handleSliderChange);
slider.addEventListener('mouseup', handleSliderRelease);
