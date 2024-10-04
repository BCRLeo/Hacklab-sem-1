// main.js
import { DoFunction } from './Functions.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");
    
    const myButton = document.getElementById('MyButton');
    const outputDiv = document.getElementById('output');

    if (!myButton) {
        console.error("Button with ID 'MyButton' not found.");
        return;
    }

    if (!outputDiv) {
        console.error("Div with ID 'output' not found.");
        return;
    }

    myButton.addEventListener('click', () => {
        console.log("Button clicked.");
        const result = DoFunction();
        console.log("DoFunction returned:", result);
        outputDiv.textContent = result;
    });
});



