<template>
  <div class="calculator">
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
      <button @click="chooseOperation('/')">/</button>
      <button @click="appendNumber('4')">4</button>
      <button @click="appendNumber('5')">5</button>
      <button @click="appendNumber('6')">6</button>
      <button @click="chooseOperation('*')">*</button>
      <button @click="appendNumber('1')">1</button>
      <button @click="appendNumber('2')">2</button>
      <button @click="appendNumber('3')">3</button>
      <button @click="chooseOperation('-')">-</button>
      <button @click="appendNumber('0')">0</button>
      <button @click="appendNumber('.')">.</button>
      <button @click="compute">=</button>
      <button @click="chooseOperation('+')">+</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Calculator',
  setup() {
    const displayValue = ref('0');
    const currentOperand = ref('');
    const previousOperand = ref('');
    const operation = ref<string | null>(null);
    const history = ref<string[]>([]);

    const clear = () => {
      displayValue.value = '0';
      currentOperand.value = '';
      previousOperand.value = '';
      operation.value = null;
      history.value = [];
    };

    const appendNumber = (number: string) => {
      if (number === '.' && currentOperand.value.includes('.')) return;
      currentOperand.value = currentOperand.value.toString() + number.toString();
      displayValue.value = currentOperand.value;
    };

    const chooseOperation = (op: string) => {
      if (currentOperand.value === '') return;
      if (previousOperand.value !== '') {
        compute();
      }
      operation.value = op;
      previousOperand.value = currentOperand.value;
      currentOperand.value = '';
      history.value.push(`${previousOperand.value} ${operation.value}`);
    };

    const compute = () => {
      let computation;
      const prev = parseFloat(previousOperand.value);
      const current = parseFloat(currentOperand.value);
      if (isNaN(prev) || isNaN(current)) return;
      switch (operation.value) {
        case '+':
          computation = prev + current;
          break;
        case '-':
          computation = prev - current;
          break;
        case '*':
          computation = prev * current;
          break;
        case '/':
          computation = prev / current;
          break;
        default:
          return;
      }
      currentOperand.value = computation.toString();
      operation.value = null;
      previousOperand.value = '';
      displayValue.value = currentOperand.value;
      history.value.push(`= ${currentOperand.value}`);
    };

    return {
      displayValue,
      clear,
      appendNumber,
      chooseOperation,
      compute,
      history,
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