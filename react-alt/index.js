import React, { useState, useEffect } from 'react';

const SliderCaptcha = () => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [stepIndex, setStepIndex] = useState(0);

  const instructions = [
    'Slide to the end',
    'Slide to the middle',
    'Slide to center, release and back to start',
    'Slide to center, release and further to the end',
  ];

  useEffect(() => {
    if (stepIndex < instructions.length) {
      setInstruction(instructions[stepIndex]);
    } else {
      verifyCaptcha();
    }
  }, [stepIndex]);

  const handleSliderChange = (e) => {
    setSliderPosition(Number(e.target.value));
  };

  const handleSliderRelease = () => {
    if (isInstructionCompleted()) {
      setStepIndex((prevIndex) => prevIndex + 1);
      resetSlider();
    }
  };

  const isInstructionCompleted = () => {
    switch (instructions[stepIndex]) {
      case 'Slide to the end':
        return sliderPosition === 100;
      case 'Slide to the middle':
        return sliderPosition === 50;
      case 'Slide to center, release and back to start':
        return sliderPosition === 50 && stepIndex > 0; // Must have moved to middle first
      case 'Slide to center, release and further to the end':
        return sliderPosition === 100 && stepIndex > 1; // Must have moved to end after middle
      default:
        return false;
    }
  };

  const resetSlider = () => {
    setSliderPosition(0);
  };

  const verifyCaptcha = () => {
    setIsVerified(true);
    // Call the function you want to execute after verification
    console.log("Captcha passed!");
  };

  return (
    <div>
      <h2>Slider CAPTCHA</h2>
      <p>{instruction}</p>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        onMouseUp={handleSliderRelease}
        style={{ width: '300px' }}
      />
      <div style={{ width: '300px', height: '10px', background: '#ddd', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: `${sliderPosition}%`,
            width: '10px',
            height: '10px',
            background: 'blue',
            transition: 'left 0.1s ease',
          }}
        />
      </div>
      {isVerified && <p>Verification successful!</p>}
    </div>
  );
};

export default SliderCaptcha;
