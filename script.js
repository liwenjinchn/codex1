document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (toggle) {
        toggle.addEventListener('click', () => {
            body.classList.toggle('nav-open');
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            body.classList.remove('nav-open');
        });
    });

    const ranges = document.querySelectorAll('.playground input[type="range"]');
    const valueDisplays = document.querySelectorAll('.playground .value');
    const activationSelect = document.getElementById('activation');
    const weightedSumEl = document.getElementById('weighted-sum');
    const activatedOutputEl = document.getElementById('activated-output');
    const outputBar = document.getElementById('output-bar');

    function formatNumber(value) {
        return Number.parseFloat(value).toFixed(3);
    }

    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    function relu(x) {
        return Math.max(0, x);
    }

    function tanh(x) {
        return Math.tanh ? Math.tanh(x) : (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
    }

    function normalizeOutput(activation, value) {
        switch (activation) {
            case 'sigmoid':
                return value; // already between 0 and 1
            case 'tanh':
                return (value + 1) / 2; // map -1..1 -> 0..1
            case 'relu':
            default:
                return Math.min(relu(value) / 3, 1); // assume interesting range within 0..3
        }
    }

    function updateBarColor(activation, value) {
        if (activation === 'tanh' && value < 0) {
            return 'linear-gradient(180deg, rgba(244, 114, 182, 0.8), rgba(192, 132, 252, 0.35))';
        }
        return 'linear-gradient(180deg, rgba(56, 189, 248, 0.7), rgba(56, 189, 248, 0.25))';
    }

    function updateValues() {
        const values = {};
        ranges.forEach((range) => {
            values[range.id] = Number.parseFloat(range.value);
            const display = Array.from(valueDisplays).find((span) => span.dataset.target === range.id);
            if (display) {
                display.textContent = formatNumber(range.value);
            }
        });

        const weightedSum = values.weight1 * values.input1 + values.weight2 * values.input2 + values.bias;
        let activated;
        const activation = activationSelect ? activationSelect.value : 'relu';

        switch (activation) {
            case 'sigmoid':
                activated = sigmoid(weightedSum);
                break;
            case 'tanh':
                activated = tanh(weightedSum);
                break;
            case 'relu':
            default:
                activated = relu(weightedSum);
        }

        if (weightedSumEl) {
            weightedSumEl.textContent = formatNumber(weightedSum);
        }
        if (activatedOutputEl) {
            activatedOutputEl.textContent = formatNumber(activated);
        }
        if (outputBar) {
            const normalized = normalizeOutput(activation, activated);
            outputBar.style.height = `${Math.max(0, Math.min(normalized, 1)) * 100}%`;
            outputBar.style.background = updateBarColor(activation, activated);
        }
    }

    if (ranges.length) {
        ranges.forEach((range) => {
            range.addEventListener('input', updateValues);
        });
        if (activationSelect) {
            activationSelect.addEventListener('change', updateValues);
        }
        updateValues();
    }
});
