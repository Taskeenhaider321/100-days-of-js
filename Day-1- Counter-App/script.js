class AdvancedCounter {
    constructor() {
        this.counter = 0;
        this.totalClicks = 0;
        this.sessionHigh = 0;
        this.stepSize = 1;
        this.minValue = -100;
        this.maxValue = 100;

        this.initializeElements();
        this.loadFromStorage();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.counterDisplay = document.getElementById('counterDisplay');
        this.incrementBtn = document.getElementById('incrementBtn');
        this.decrementBtn = document.getElementById('decrementBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.stepSizeInput = document.getElementById('stepSize');
        this.minValueInput = document.getElementById('minValue');
        this.maxValueInput = document.getElementById('maxValue');
        this.totalClicksDisplay = document.getElementById('totalClicks');
        this.sessionHighDisplay = document.getElementById('sessionHigh');
    }

    bindEvents() {
        this.incrementBtn.addEventListener('click', () => this.increment());
        this.decrementBtn.addEventListener('click', () => this.decrement());
        this.resetBtn.addEventListener('click', () => this.reset());

        this.stepSizeInput.addEventListener('change', (e) => {
            this.stepSize = parseInt(e.target.value) || 1;
            this.saveToStorage();
        });

        this.minValueInput.addEventListener('change', (e) => {
            this.minValue = parseInt(e.target.value) || -100;
            this.saveToStorage();
        });

        this.maxValueInput.addEventListener('change', (e) => {
            this.maxValue = parseInt(e.target.value) || 100;
            this.saveToStorage();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case '+':
                    e.preventDefault();
                    this.increment();
                    break;
                case 'ArrowDown':
                case '-':
                    e.preventDefault();
                    this.decrement();
                    break;
                case 'r':
                case 'R':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.reset();
                    }
                    break;
            }
        });
    }

    increment() {
        const newValue = this.counter + this.stepSize;
        if (newValue <= this.maxValue) {
            this.counter = newValue;
            this.totalClicks++;
            this.updateSessionHigh();
            this.animateCounter();
            this.updateDisplay();
            this.saveToStorage();
        }
    }

    decrement() {
        const newValue = this.counter - this.stepSize;
        if (newValue >= this.minValue) {
            this.counter = newValue;
            this.totalClicks++;
            this.animateCounter();
            this.updateDisplay();
            this.saveToStorage();
        }
    }

    reset() {
        this.counter = 0;
        this.animateCounter();
        this.updateDisplay();
        this.saveToStorage();
    }

    updateSessionHigh() {
        if (this.counter > this.sessionHigh) {
            this.sessionHigh = this.counter;
        }
    }

    animateCounter() {
        this.counterDisplay.classList.add('animate');
        setTimeout(() => {
            this.counterDisplay.classList.remove('animate');
        }, 300);
    }

    updateDisplay() {
        this.counterDisplay.textContent = this.counter;
        this.totalClicksDisplay.textContent = this.totalClicks;
        this.sessionHighDisplay.textContent = this.sessionHigh;

        // Update button states based on limits
        this.incrementBtn.disabled = this.counter >= this.maxValue;
        this.decrementBtn.disabled = this.counter <= this.minValue;

        // Change color based on value
        if (this.counter > 0) {
            this.counterDisplay.style.color = '#27ae60';
        } else if (this.counter < 0) {
            this.counterDisplay.style.color = '#e74c3c';
        } else {
            this.counterDisplay.style.color = '#2c3e50';
        }
    }

    saveToStorage() {
        const data = {
            counter: this.counter,
            totalClicks: this.totalClicks,
            sessionHigh: this.sessionHigh,
            stepSize: this.stepSize,
            minValue: this.minValue,
            maxValue: this.maxValue
        };
        localStorage.setItem('advancedCounter', JSON.stringify(data));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('advancedCounter');
        if (saved) {
            const data = JSON.parse(saved);
            this.counter = data.counter || 0;
            this.totalClicks = data.totalClicks || 0;
            this.sessionHigh = data.sessionHigh || 0;
            this.stepSize = data.stepSize || 1;
            this.minValue = data.minValue || -100;
            this.maxValue = data.maxValue || 100;

            // Update input values
            this.stepSizeInput.value = this.stepSize;
            this.minValueInput.value = this.minValue;
            this.maxValueInput.value = this.maxValue;
        }
    }
}

// Initialize the counter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedCounter();
});