    let history = [];

    // Load from localStorage
    const savedHistory = localStorage.getItem('randomHistory');
    if (savedHistory) {
      history = JSON.parse(savedHistory);
      updateHistoryDisplay();
    }

    function generateNumber() {
      const minInput = document.getElementById('minValue');
      const maxInput = document.getElementById('maxValue');
      const errorDiv = document.getElementById('error');
      const resultNumber = document.getElementById('resultNumber');
      const resultRange = document.getElementById('resultRange');
      const generateBtn = document.getElementById('generateBtn');

      errorDiv.style.display = 'none';

      const min = parseInt(minInput.value);
      const max = parseInt(maxInput.value);

      if (isNaN(min) || isNaN(max)) {
        showError('Please enter valid numbers for both minimum and maximum values.');
        return;
      }

      if (min >= max) {
        showError('Minimum value must be less than maximum value.');
        return;
      }

      if (max - min > 1000000) {
        showError('Range is too large. Please use a smaller range.');
        return;
      }

      generateBtn.disabled = true;
      generateBtn.textContent = '🎲 Generating...';

      setTimeout(() => {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

        resultNumber.classList.remove('animate-number');
        setTimeout(() => {
          resultNumber.textContent = randomNum.toLocaleString();
          resultNumber.classList.add('animate-number');
          resultRange.textContent = `Range: ${min.toLocaleString()} - ${max.toLocaleString()}`;
        }, 50);

        addToHistory(randomNum, min, max);

        generateBtn.disabled = false;
        generateBtn.textContent = '🎯 Generate Random Number';
      }, 500);
    }

    function showError(message) {
      const errorDiv = document.getElementById('error');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }

    function addToHistory(number, min, max) {
      const historyItem = {
        number: number,
        range: `${min}-${max}`,
        timestamp: new Date().toLocaleTimeString()
      };

      history.unshift(historyItem);

      if (history.length > 10) {
        history = history.slice(0, 10);
      }

      localStorage.setItem('randomHistory', JSON.stringify(history));
      updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
      const historySection = document.getElementById('historySection');
      const historyList = document.getElementById('historyList');

      if (history.length === 0) {
        historySection.style.display = 'none';
        return;
      }

      historySection.style.display = 'block';
      historyList.innerHTML = '';

      history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.textContent = item.number.toLocaleString();
        div.title = `Generated at ${item.timestamp} (Range: ${item.range})`;
        historyList.appendChild(div);
      });
    }

    function clearHistory() {
      history = [];
      localStorage.removeItem('randomHistory');
      updateHistoryDisplay();
    }

    document.getElementById('minValue').addEventListener('input', () => {
      document.getElementById('error').style.display = 'none';
    });

    document.getElementById('maxValue').addEventListener('input', () => {
      document.getElementById('error').style.display = 'none';
    });

    document.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        generateNumber();
      }
    });

    document.getElementById('minValue').focus();