/**
 * To implement randomized slider mechanics, we will introduce two main elements:
* Randomized initial position: The slider will start at a random position instead of always starting at 0.
* Randomized slider range: We will randomize the maximum value of the slider, which could be different for each challenge (e.g., 0 to 200 instead of 0 to 100).
*/

const slider = document.getElementById('slider');
const instructionElement = document.getElementById('instruction');
const sliderThumb = document.getElementById('slider-thumb');
const resultElement = document.getElementById('result');

let stepIndex = 0;
let startTime = null;  // To store the timestamp when sliding starts
let endTime = null;    // To store the timestamp when sliding ends
let sliderMax = 100;   // Default max value for the slider

const instructions = [
    'Slide to the end',
    'Slide to the middle',
    'Slide to center, release and back to start',
    'Slide to center, release and further to the end'
];

// Randomize slider mechanics
function randomizeSlider() {
    // Randomize slider max value (between 100 and 200)
    sliderMax = Math.floor(Math.random() * 101) + 100;
    slider.setAttribute('max', sliderMax);

    // Randomize initial slider position
    const initialPosition = Math.floor(Math.random() * (sliderMax + 1));
    slider.value = initialPosition;
    sliderThumb.style.left = `${(initialPosition / sliderMax) * 100}%`;

    // Reset the start time for future calculations
    startTime = null;
}

function updateInstruction() {
    if (stepIndex < instructions.length) {
        instructionElement.textContent = instructions[stepIndex];
    } else {
        verifyCaptcha();
    }
}

function handleSliderChange() {
    const position = slider.value;
    sliderThumb.style.left = `${(position / sliderMax) * 100}%`;

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
            return position == sliderMax;  // Adjust based on randomized max value
        case 'Slide to the middle':
            return position == Math.floor(sliderMax / 2);  // Adjust to the middle of the randomized range
        case 'Slide to center, release and back to start':
            return position == Math.floor(sliderMax / 2) && stepIndex > 0;
        case 'Slide to center, release and further to the end':
            return position == sliderMax && stepIndex > 1;
        default:
            return false;
    }
}

function resetSlider() {
    randomizeSlider();  // Randomize the slider position and range
    startTime = null;  // Reset start time for the next interaction
}

function verifyCaptcha() {
    resultElement.textContent = 'Verification successful!';
    console.log("Captcha passed!");
}

// Initialize with a random instruction and randomize the slider
randomizeSlider();
updateInstruction();

slider.addEventListener('input', handleSliderChange);
slider.addEventListener('mouseup', handleSliderRelease);
