<template>
  <div class="calculator-container">
    <div class="calculator" @keydown="handleKeydown" tabindex="0">
      <!-- 显示当前输入或计算结果 -->
      <div class="display">{{ displayValue }}</div>
      <!-- 显示历史记录 -->
      <div class="history">
        <div v-for="(entry, index) in history" :key="index" class="history-entry">
          {{ entry.expression }} = {{ entry.result }}
        </div>
      </div>
      <!-- 按钮区域 -->
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
    <!-- 备忘录区域 -->
    <div class="memo">
      <h3>Memo</h3>
      <ul>
        <li v-for="(entry, index) in memo" :key="index">{{ entry.expression }} = {{ entry.result }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'Calculator',
  setup() {
    // 定义响应式变量
    const displayValue = ref('0'); // 显示的值
    const expression = ref(''); // 当前输入的表达式
    const history = ref<{ expression: string, result: string }[]>([]); // 历史记录
    const memo = ref<{ expression: string, result: string }[]>([]); // 备忘录

    // 清除当前输入和显示
    const clear = () => {
      displayValue.value = '0';
      expression.value = '';
    };

    // 添加数字到表达式
    const appendNumber = (number: string) => {
      // 防止重复添加小数点
      if (number === '.' && expression.value.slice(-1) === '.') return;
      expression.value += number;
      displayValue.value = expression.value;
    };

    // 添加操作符到表达式
    const appendOperation = (op: string) => {
      // 处理负号
      if (op === '-' && (expression.value === '' || /[\+\-\*\/\(\^√]$/.test(expression.value))) {
        expression.value += '-';
        displayValue.value = expression.value;
        return;
      }
      // 处理乘号和左括号
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

    // 计算表达式
    const compute = () => {
      try {
        // 使用 eval 计算表达式，替换 √ 和 ^ 为 JavaScript 可识别的操作
        const result = eval(expression.value.replace(/√/g, 'Math.sqrt').replace(/\^/g, '**'));
        displayValue.value = result.toString();
        // 将表达式和结果添加到历史记录和备忘录
        history.value.push({ expression: expression.value, result: result.toString() });
        memo.value.push({ expression: expression.value, result: result.toString() });
        expression.value = result.toString();
      } catch (e) {
        displayValue.value = 'Error';
        expression.value = '';
      }
    };

    // 处理键盘输入
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

    // 在组件挂载后自动聚焦到计算器
    onMounted(() => {
      const calculatorElement = document.querySelector('.calculator') as HTMLElement;
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
      history,
      memo,
    };
  },
});
</script>

<style scoped>
.calculator-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 50px;
}

.calculator {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.memo {
  margin-left: 20px;
  width: 300px; /* 调整宽度 */
}

.memo h3 {
  margin: 0;
  padding: 0;
}

.memo ul {
  list-style-type: none;
  padding: 0;
}

.memo li {
  background: #f0f0f0;
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
}
</style>