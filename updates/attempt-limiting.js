/**
 * To implement attempt limiting with a cooldown period after a set number of failed CAPTCHA attempts, we can follow this approach:

Plan:
Track failed attempts: Keep count of the number of failed attempts.
Disable CAPTCHA interaction: Once the user exceeds the allowed number of attempts (e.g., 3), we disable the slider and show a cooldown message.
Cooldown period: Introduce a 30-second cooldown before allowing the user to try again.
Updated Implementation:
Failed Attempts Tracking: Add a counter to track how many incorrect attempts the user has made.
Cooldown Timer: After 3 incorrect attempts, disable the slider for 30 seconds, then re-enable it.

TODO:
    After the, refresh the page to generate a new CAPTCHA challenge.
 */


const slider = document.getElementById('slider');
const instructionElement = document.getElementById('instruction');
const sliderThumb = document.getElementById('slider-thumb');
const resultElement = document.getElementById('result');

let stepIndex = 0;
let startTime = null;  // To store the timestamp when sliding starts
let endTime = null;    // To store the timestamp when sliding ends
let sliderMax = 100;   // Default max value for the slider
let failedAttempts = 0;  // Count of failed CAPTCHA attempts
const maxAttempts = 3;  // Maximum allowed failed attempts
const cooldownPeriod = 30000;  // 30 seconds cooldown period
let cooldownTimer = null;  // Store cooldown timer

const instructions = [
    'Slide to the end',
    'Slide to the middle',
    'Slide to center, release and back to start',
    'Slide to center, release and further to the end'
];

// Randomize slider mechanics
function randomizeSlider() {
    sliderMax = Math.floor(Math.random() * 101) + 100;  // Randomize max value between 100 and 200
    slider.setAttribute('max', sliderMax);

    const initialPosition = Math.floor(Math.random() * (sliderMax + 1));  // Randomize initial position
    slider.value = initialPosition;
    sliderThumb.style.left = `${(initialPosition / sliderMax) * 100}%`;

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

    if (startTime === null) {
        startTime = Date.now();  // Record the start time
    }
}

function handleSliderRelease() {
    const position = slider.value;

    endTime = Date.now();
    const timeDiff = endTime - startTime;  // Calculate the time difference

    if (isInstructionCompleted(position, timeDiff)) {
        verifyCaptcha();
    } else {
        failedAttempts++;  // Increment failed attempts
        if (failedAttempts >= maxAttempts) {
            triggerCooldown();
        } else {
            resultElement.textContent = `Incorrect, try again. (${failedAttempts}/${maxAttempts} attempts)`;
        }
    }
}

function isInstructionCompleted(position, timeDiff) {
    const timeLimit = 2000;  // 2 seconds time limit

    if (timeDiff < timeLimit) {
        resultElement.textContent = 'Too fast! Possible bot detected.';
        return false;
    }

    switch (instructions[stepIndex]) {
        case 'Slide to the end':
            return position == sliderMax;
        case 'Slide to the middle':
            return position == Math.floor(sliderMax / 2);
        case 'Slide to center, release and back to start':
            return position == Math.floor(sliderMax / 2) && stepIndex > 0;
        case 'Slide to center, release and further to the end':
            return position == sliderMax && stepIndex > 1;
        default:
            return false;
    }
}

function resetSlider() {
    randomizeSlider();
    startTime = null;
}

function verifyCaptcha() {
    resultElement.textContent = 'Verification successful!';
    console.log("Captcha passed!");
    resetSlider();  // Optionally reset the slider after success
}

function triggerCooldown() {
    // Disable the slider
    slider.setAttribute('disabled', true);
    resultElement.textContent = `Too many failed attempts. Please wait for 30 seconds.`;
    
    // Start cooldown timer
    cooldownTimer = setTimeout(() => {
        failedAttempts = 0;  // Reset failed attempts
        resultElement.textContent = 'You can try again.';
        slider.removeAttribute('disabled');  // Re-enable the slider
        resetSlider();  // Optionally reset the slider after the cooldown
    }, cooldownPeriod);
}

// Initialize with a random instruction and randomize the slider
randomizeSlider();
updateInstruction();

slider.addEventListener('input', handleSliderChange);
slider.addEventListener('mouseup', handleSliderRelease);
