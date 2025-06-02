class ColorGenerator {
    constructor() {
        this.currentColor = { r: 0, g: 0, b: 0 };
        this.history = JSON.parse(localStorage.getItem('colorHistory')) || [];
        this.maxHistory = 10;

        this.initializeElements();
        this.bindEvents();
        this.generateRandomColor();
        this.updateHistory();
    }

    initializeElements() {
        this.colorDisplay = document.getElementById('colorDisplay');
        this.hexValue = document.getElementById('hexValue');
        this.rgbValue = document.getElementById('rgbValue');
        this.hslValue = document.getElementById('hslValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.paletteBtn = document.getElementById('paletteBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.palette = document.getElementById('palette');
        this.historyContainer = document.getElementById('history');
        this.notification = document.getElementById('notification');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateRandomColor());
        this.paletteBtn.addEventListener('click', () => this.generatePalette());
        this.clearBtn.addEventListener('click', () => this.clearHistory());
        this.colorDisplay.addEventListener('click', () => this.copyToClipboard(this.hexValue.textContent));

        // Add click events for color values
        document.querySelectorAll('.color-value').forEach(element => {
            element.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                const value = e.currentTarget.querySelector('.color-code').textContent;
                this.copyToClipboard(value);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.generateRandomColor();
            }
        });
    }

    generateRandomColor() {
        this.generateBtn.classList.add('loading');

        setTimeout(() => {
            this.currentColor = {
                r: Math.floor(Math.random() * 256),
                g: Math.floor(Math.random() * 256),
                b: Math.floor(Math.random() * 256)
            };

            this.updateDisplay();
            this.addToHistory(this.currentColor);
            this.updateBodyBackground();
            this.generateBtn.classList.remove('loading');
        }, 200);
    }

    updateDisplay() {
        const { r, g, b } = this.currentColor;
        const hex = this.rgbToHex(r, g, b);
        const hsl = this.rgbToHsl(r, g, b);

        // Update color display
        this.colorDisplay.style.background = `rgb(${r}, ${g}, ${b})`;
        this.colorDisplay.style.color = this.getContrastColor(r, g, b);

        // Update color values with animation
        this.animateValueChange(this.hexValue, hex);
        this.animateValueChange(this.rgbValue, `rgb(${r}, ${g}, ${b})`);
        this.animateValueChange(this.hslValue, `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    }

    animateValueChange(element, newValue) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';

        setTimeout(() => {
            element.textContent = newValue;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 150);
    }

    generatePalette() {
        this.paletteBtn.classList.add('loading');
        this.palette.innerHTML = '';

        setTimeout(() => {
            const baseColor = this.currentColor;
            const colors = this.generateHarmoniousColors(baseColor, 5);

            colors.forEach((color, index) => {
                setTimeout(() => {
                    const colorDiv = document.createElement('div');
                    colorDiv.className = 'palette-color fade-in';
                    colorDiv.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
                    colorDiv.title = this.rgbToHex(color.r, color.g, color.b);

                    colorDiv.addEventListener('click', () => {
                        this.currentColor = color;
                        this.updateDisplay();
                        this.addToHistory(color);
                        this.copyToClipboard(this.rgbToHex(color.r, color.g, color.b));
                    });

                    this.palette.appendChild(colorDiv);
                }, index * 100);
            });

            this.paletteBtn.classList.remove('loading');
        }, 200);
    }

    generateHarmoniousColors(baseColor, count) {
        const colors = [baseColor];
        const hsl = this.rgbToHsl(baseColor.r, baseColor.g, baseColor.b);

        for (let i = 1; i < count; i++) {
            const newHue = (hsl.h + (360 / count) * i) % 360;
            const newColor = this.hslToRgb(newHue, hsl.s, hsl.l);
            colors.push(newColor);
        }

        return colors;
    }

    addToHistory(color) {
        const hex = this.rgbToHex(color.r, color.g, color.b);

        // Remove if already exists
        this.history = this.history.filter(c => c !== hex);

        // Add to beginning
        this.history.unshift(hex);

        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(0, this.maxHistory);
        }

        localStorage.setItem('colorHistory', JSON.stringify(this.history));
        this.updateHistory();
    }

    updateHistory() {
        this.historyContainer.innerHTML = '';

        this.history.forEach((hex, index) => {
            setTimeout(() => {
                const colorDiv = document.createElement('div');
                colorDiv.className = 'history-color fade-in';
                colorDiv.style.background = hex;
                colorDiv.title = hex;

                colorDiv.addEventListener('click', () => {
                    const rgb = this.hexToRgb(hex);
                    this.currentColor = rgb;
                    this.updateDisplay();
                    this.copyToClipboard(hex);
                });

                this.historyContainer.appendChild(colorDiv);
            }, index * 50);
        });
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('colorHistory');
        this.updateHistory();
        this.showNotification('History cleared!');
    }

    updateBodyBackground() {
        const { r, g, b } = this.currentColor;
        const lightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (lightness > 128) {
            document.body.style.background = `linear-gradient(135deg, rgb(${r}, ${g}, ${b}) 0%, rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)}) 100%)`;
        } else {
            document.body.style.background = `linear-gradient(135deg, rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}) 0%, rgb(${r}, ${g}, ${b}) 100%)`;
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification(`${text} copied to clipboard!`);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification(`${text} copied to clipboard!`);
        }
    }

    showNotification(message) {
        this.notification.textContent = message;
        this.notification.classList.add('show');

        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 2000);
    }

    getContrastColor(r, g, b) {
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}

// Initialize the color generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ColorGenerator();
});