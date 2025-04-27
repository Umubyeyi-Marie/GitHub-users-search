import React from 'react';
import DisplayInfo from './components/Info';
import { ThemeProvider } from './components/ThemeContext'; // Make sure path is correct

function App() {
  return (
   <div>
    <ThemeProvider>
      <DisplayInfo />
    </ThemeProvider>
    </div>
  );
}

export default App;

