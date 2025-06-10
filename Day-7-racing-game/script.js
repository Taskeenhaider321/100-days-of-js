// Game state
const gameState = {
    shapes: ['circle', 'square', 'triangle', 'diamond'],
    intervals: {},
    positions: {},
    speeds: {},
    isMoving: {},
    winner: null,
    raceFinished: false
};

// Initialize game
function initGame() {
    gameState.shapes.forEach(shape => {
        gameState.positions[shape] = 10;
        gameState.speeds[shape] = 50;
        gameState.isMoving[shape] = false;

        // Set up speed slider listeners
        const speedSlider = document.getElementById(`${shape}-speed`);
        const speedValue = document.getElementById(`${shape}-speed-value`);

        speedSlider.addEventListener('input', (e) => {
            gameState.speeds[shape] = parseInt(e.target.value);
            speedValue.textContent = e.target.value;
        });
    });

    resetRace();
}

// Start individual shape movement
function startShape(shape) {
    if (gameState.isMoving[shape] || gameState.raceFinished) return;

    gameState.isMoving[shape] = true;
    const shapeElement = document.getElementById(shape);
    shapeElement.classList.add('moving');

    gameState.intervals[shape] = setInterval(() => {
        moveShape(shape);
    }, 50);
}

// Stop individual shape movement
function stopShape(shape) {
    if (!gameState.isMoving[shape]) return;

    gameState.isMoving[shape] = false;
    const shapeElement = document.getElementById(shape);
    shapeElement.classList.remove('moving');

    if (gameState.intervals[shape]) {
        clearInterval(gameState.intervals[shape]);
        delete gameState.intervals[shape];
    }
}

// Move shape logic
function moveShape(shape) {
    const trackWidth = document.querySelector('.track-line').offsetWidth;
    const finishLine = trackWidth - 80; // Account for shape width and finish line

    const speed = gameState.speeds[shape] / 10; // Convert to pixels per frame
    gameState.positions[shape] += speed;

    // Update shape position
    const shapeElement = document.getElementById(shape);
    shapeElement.style.left = `${gameState.positions[shape]}px`;

    // Update progress bar
    const progress = Math.min((gameState.positions[shape] / finishLine) * 100, 100);
    document.getElementById(`${shape}-progress`).style.width = `${progress}%`;

    // Check for winner
    if (gameState.positions[shape] >= finishLine && !gameState.raceFinished) {
        declareWinner(shape);
    }
}

// Declare winner
function declareWinner(shape) {
    gameState.raceFinished = true;
    gameState.winner = shape;

    // Stop all shapes
    stopAllShapes();

    // Show winner announcement
    const announcement = document.getElementById('winner-announcement');
    const shapeNames = {
        circle: 'Red Circle',
        square: 'Teal Square',
        triangle: 'Yellow Triangle',
        diamond: 'Purple Diamond'
    };

    announcement.innerHTML = `
                🏆 WINNER! 🏆<br>
                ${shapeNames[shape]} wins the race!<br>
                <small>🎉 Congratulations! 🎉</small>
            `;
    announcement.style.display = 'block';

    // Add celebration effect
    setTimeout(() => {
        announcement.style.animation = 'bounce 0.6s ease-in-out 3';
    }, 100);
}

// Start all shapes
function startAllShapes() {
    if (gameState.raceFinished) return;

    gameState.shapes.forEach(shape => {
        startShape(shape);
    });
}

// Stop all shapes
function stopAllShapes() {
    gameState.shapes.forEach(shape => {
        stopShape(shape);
    });
}

// Reset race
function resetRace() {
    // Stop all movements
    stopAllShapes();

    // Reset game state
    gameState.raceFinished = false;
    gameState.winner = null;

    // Reset positions and UI
    gameState.shapes.forEach(shape => {
        gameState.positions[shape] = 10;

        const shapeElement = document.getElementById(shape);
        shapeElement.style.left = '10px';
        shapeElement.classList.remove('moving');

        // Reset progress bars
        document.getElementById(`${shape}-progress`).style.width = '0%';
    });

    // Hide winner announcement
    document.getElementById('winner-announcement').style.display = 'none';
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case ' ': // Spacebar
            e.preventDefault();
            startAllShapes();
            break;
        case 'r':
        case 'R':
            resetRace();
            break;
        case 's':
        case 'S':
            stopAllShapes();
            break;
    }
});

// Add sound effects (using Web Audio API)
function playSound(frequency, duration) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Add sound effects to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        playSound(800, 0.1);
    });
});

// Initialize the game when page loads
window.addEventListener('load', initGame);

// Add responsive behavior
window.addEventListener('resize', () => {
    // Recalculate positions on resize
    gameState.shapes.forEach(shape => {
        if (gameState.isMoving[shape]) {
            const trackWidth = document.querySelector('.track-line').offsetWidth;
            const finishLine = trackWidth - 80;
            const progress = Math.min((gameState.positions[shape] / finishLine) * 100, 100);
            document.getElementById(`${shape}-progress`).style.width = `${progress}%`;
        }
    });
});