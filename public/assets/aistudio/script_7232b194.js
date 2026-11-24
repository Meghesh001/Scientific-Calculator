let currentInput = '';
let isDegree = true;

const display = document.getElementById('display');
const history = document.getElementById('history');

function toggleMode() {
    isDegree = !isDegree;
    document.getElementById('modeBtn').textContent = isDegree ? 'DEG' : 'RAD';
}

function appendValue(value) {
    currentInput += value;
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
    history.textContent = '';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

function toRadians(value) {
    return isDegree ? (value * Math.PI) / 180 : value;
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}


function sinDeg(x) { return Math.sin(toRadians(x)); }
function cosDeg(x) { return Math.cos(toRadians(x)); }
function tanDeg(x) { return Math.tan(toRadians(x)); }


function convertPostfix(expr, symbol, wrap) {
    let result = expr;
    let idx;
    while ((idx = result.indexOf(symbol)) !== -1) {
        let start;
        if (result[idx - 1] === ')') {
            let depth = 0;
            let i = idx - 1;
            for (; i >= 0; i--) {
                if (result[i] === ')') depth++;
                if (result[i] === '(') depth--;
                if (depth === 0) { start = i; break; }
            }
        } else {
            let i = idx - 1;
            while (i >= 0 && /[0-9.]/.test(result[i])) i--;
            start = i + 1;
        }
        const group = result.slice(start, idx);
        result = result.slice(0, start) + wrap(group) + result.slice(idx + symbol.length);
    }
    return result;
}

function scientific(func) {
    switch (func) {
        
        case 'sin':   currentInput += 'sin('; break;
        case 'cos':   currentInput += 'cos('; break;
        case 'tan':   currentInput += 'tan('; break;
        case 'log':   currentInput += 'log('; break;
        case 'ln':    currentInput += 'ln(';  break;
        case 'sqrt':  currentInput += '√(';   break;

        
        case 'square':
            if (currentInput) currentInput = '(' + currentInput + ')²';
            break;
        case 'factorial':
            if (currentInput) currentInput = '(' + currentInput + ')!';
            break;
        case 'inverse':
            if (currentInput) currentInput = '1/(' + currentInput + ')';
            break;
        case 'abs':
            if (currentInput) currentInput = '|' + currentInput + '|';
            break;
    }
    display.value = currentInput;
}

function calculate() {
    try {
        history.textContent = currentInput + ' =';

        let expression = currentInput;

    
        expression = expression.replace(/\|([^|]*)\|/g, 'Math.abs($1)');

    
        expression = convertPostfix(expression, '²', g => `Math.pow(${g},2)`);
        expression = convertPostfix(expression, '!', g => `factorial(${g})`);

    
        expression = expression.replace(/π/g, Math.PI);
        expression = expression.replace(/e/g, Math.E);
        expression = expression.replace(/\^/g, '**');

    
        expression = expression.replaceAll('√(', 'Math.sqrt(');
        expression = expression.replaceAll('sin(', 'sinDeg(');
        expression = expression.replaceAll('cos(', 'cosDeg(');
        expression = expression.replaceAll('tan(', 'tanDeg(');
        expression = expression.replaceAll('log(', 'Math.log10(');
        expression = expression.replaceAll('ln(', 'Math.log(');

        let result = eval(expression);

        currentInput = isFinite(result) ? result.toString() : 'Error';
        display.value = currentInput;
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (/[0-9.]/.test(key)) {
        appendValue(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendValue(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});