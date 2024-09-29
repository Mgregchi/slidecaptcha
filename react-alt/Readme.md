A React-based slider CAPTCHA solution that requires users to complete a series of sliding tasks to verify their humanity. This interactive CAPTCHA provides a user-friendly alternative to traditional methods.

## Features

- **Interactive Instructions**: Users receive specific tasks to complete using a slider.
- **React Component**: Built with React for easy integration into any React application.
- **Customizable**: Modify instructions and styles to suit your project.
- **State Management**: Utilizes React's state management for dynamic updates.

## Demo

To see SlideCaptcha in action, clone the repository and run the application locally.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mgregchi/slidecaptcha.git
   cd slidecaptcha/react-alt
   ```

2. **Navigate to the project directory** and install dependencies:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm start
   ```

4. **Open your browser** and go to `http://localhost:3000` to see the CAPTCHA in action.

## Usage

1. Integrate the `SliderCaptcha` component into your React application:
   ```jsx
   import SliderCaptcha from './SliderCaptcha';

   function App() {
       return (
           <div>
               <h1>Welcome to My App</h1>
               <SliderCaptcha />
           </div>
       );
   }
   ```

2. Follow the displayed instructions on the slider.
3. Upon completing all tasks, a verification message will appear.

## Customization

- **Instructions**: Modify the instructions in the `SliderCaptcha` component to change the tasks presented to users.
- **Styles**: Update the CSS to customize the look and feel of the slider and its container.
