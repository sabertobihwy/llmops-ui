import { defineStore } from 'pinia'
import { ref } from 'vue'

const initAccount = {
  name: 'imooc',
  email: 'jhewew@gmail.com',
}
export const userAccountStore = defineStore('account', () => {
  // 1. define data
  const account = ref({ ...initAccount })

  // 2.
  function update(params: any) {
    Object.assign(account.value, params) // account里面有value; Object.assign里传递什么更新什么
  }

  function clear() {
    account.value = { ...initAccount }
  }

  return { account, update, clear }
})
