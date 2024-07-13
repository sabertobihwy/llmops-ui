<script setup lang="ts">
import { userAccountStore } from '@/stores/account'

const accountStore = userAccountStore()

function updateName() {
  accountStore.update({ name: 'wenyan' })
}
</script>

<template>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>
  <p>homepage</p>
  <p>name is {{ accountStore.account.name }}</p>
  <p>email is {{ accountStore.account.email }}</p>
  <a-button type="primary" @click="updateName">updateName</a-button>
  <a-button @click="accountStore.clear">reset</a-button>
  <router-link to="/space/app">redirect to app list</router-link>
</template>

<style scoped></style>
