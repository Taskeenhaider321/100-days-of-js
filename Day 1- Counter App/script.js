'use strict';

const result = document.getElementById("result-screen");
const plusBtn = document.getElementById('plus-btn');
const minusBtn = document.getElementById('minus-btn');
const resetBtn = document.getElementById('reset-btn');

let counter = parseInt(result.textContent.trim())

plusBtn.addEventListener('click', () => {
    counter++;
    updateScreen()
});

minusBtn.addEventListener('click', () => {
    if (counter > 0) counter--;
    updateScreen()
});

resetBtn.addEventListener('click', () => {
    counter = 0;
    updateScreen()
});

function updateScreen() {
    result.textContent = counter;
}