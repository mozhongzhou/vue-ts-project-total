<template>
  <div class="calculator" @keydown="handleKeydown" tabindex="0">
    <div class="display">{{ displayValue }}</div>
    <div class="history">
      <div v-for="(entry, index) in history" :key="index" class="history-entry">
        {{ entry }}
      </div>
    </div>
    <div class="buttons">
      <button @click="clear">C</button>
      <button @click="appendNumber('7')">7</button>
      <button @click="appendNumber('8')">8</button>
      <button @click="appendNumber('9')">9</button>
      <button @click="appendOperation('/')">/</button>
      <button @click="appendNumber('4')">4</button>
      <button @click="appendNumber('5')">5</button>
      <button @click="appendNumber('6')">6</button>
      <button @click="appendOperation('*')">*</button>
      <button @click="appendNumber('1')">1</button>
      <button @click="appendNumber('2')">2</button>
      <button @click="appendNumber('3')">3</button>
      <button @click="appendOperation('-')">-</button>
      <button @click="appendNumber('0')">0</button>
      <button @click="appendNumber('.')">.</button>
      <button @click="compute">=</button>
      <button @click="appendOperation('+')">+</button>
      <button @click="appendOperation('^')">^</button>
      <button @click="appendOperation('√')">√</button>
      <button @click="appendOperation('(')">(</button>
      <button @click="appendOperation(')')">)</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'Calculator',
  setup() {
    const displayValue = ref('0');
    const expression = ref('');

    const clear = () => {
      displayValue.value = '0';
      expression.value = '';
    };

    const appendNumber = (number: string) => {
      if (number === '.' && expression.value.slice(-1) === '.') return;
      expression.value += number;
      displayValue.value = expression.value;
    };

    const appendOperation = (op: string) => {
      if (op === '-' && (expression.value === '' || /[\+\-\*\/\(\^√]$/.test(expression.value))) {
        expression.value += '-';
        displayValue.value = expression.value;
        return;
      }
      if (op === '(' && /[\d\)]$/.test(expression.value)) {
        expression.value += '*(';
      } else if (op === ')' && /[\+\-\*\/\(\^√]$/.test(expression.value)) {
        return;
      } else if (/[\+\-\*\/\(\^√]$/.test(expression.value) && op !== '(') {
        return;
      } else {
        expression.value += op;
      }
      displayValue.value = expression.value;
    };

    const compute = () => {
      try {
        const result = eval(expression.value.replace(/√/g, 'Math.sqrt').replace(/\^/g, '**'));
        displayValue.value = result.toString();
        expression.value = result.toString();
      } catch (e) {
        displayValue.value = 'Error';
        expression.value = '';
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key;
      if (!isNaN(Number(key))) {
        appendNumber(key);
      } else if (key === '.') {
        appendNumber(key);
      } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '^' || key === '√' || key === '(' || key === ')') {
        appendOperation(key);
      } else if (key === 'Enter' || key === '=') {
        compute();
      } else if (key === 'Backspace') {
        clear();
      }
    };

    onMounted(() => {
      const calculatorElement = document.querySelector('.calculator');
      if (calculatorElement) {
        calculatorElement.focus();
      }
    });

    return {
      displayValue,
      clear,
      appendNumber,
      appendOperation,
      compute,
      handleKeydown,
    };
  },
});
</script>

<style scoped>
.calculator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  outline: none;
}

.display {
  width: 260px;
  height: 60px;
  background: #222;
  color: white;
  font-size: 2em;
  text-align: right;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.history {
  width: 260px;
  background: #f0f0f0;
  color: #333;
  font-size: 1em;
  text-align: right;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
  max-height: 100px;
  overflow-y: auto;
}

.history-entry {
  margin-bottom: 5px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

button {
  width: 60px;
  height: 60px;
  font-size: 1.5em;
  background: #f0f0f0;
  border: none;
  cursor: pointer;
}

button:active {
  background: #ccc;
}
</style>