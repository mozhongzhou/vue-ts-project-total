<template>
  <div class="container">
    <h1>Number Sorter</h1>
    <input v-model="numbers" placeholder="Enter numbers separated by spaces" />
    <button @click="sortNumbers">Sort Numbers</button>
    <div v-if="sortedNumbers.length">
      <h3>Sorted Numbers:</h3>
      <p>{{ sortedNumbers.join(' ') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const numbers = ref('')
const sortedNumbers = ref<number[]>([])

const sortNumbers = async () => {
  try {
    const response = await axios.post('http://localhost:3000/sort', {
      numbers: numbers.value.split(' ').map(Number)
    })
    sortedNumbers.value = response.data.sortedNumbers
  } catch (error) {
    console.error('Error sorting numbers:', error)
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

input {
  margin-right: 10px;
  padding: 5px;
}

button {
  padding: 5px 10px;
}

h3 {
  margin-top: 20px;
}
</style>