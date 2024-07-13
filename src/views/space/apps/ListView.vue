<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>

<template>
  <p>AI application list</p>
  <p>value is {{ counterStore.count }}</p>
  <router-link to="/home">Back to Homepage</router-link>
</template>

<style scoped></style>
