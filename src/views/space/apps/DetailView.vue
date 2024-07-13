<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { openai_app } from '@/services/app'
import { useRoute } from 'vue-router'

interface Msg {
  role: string
  content: string
}

// const
const query = ref('')
const messages = ref<Msg[]>([])
const isLoading = ref(false)
const route = useRoute()

const clearMsg = () => {
  messages.value = []
}

const send = async () => {
  if (!query.value) {
    Message.error('input cannot be empty')
    return
  }
  if (isLoading.value) {
    Message.error('回复还没加载完成，请稍后')
    return
  }
  // get human msg
  const humanMsg = query.value
  messages.value.push({
    role: 'human',
    content: humanMsg,
  })
  try {
    // clear human msg
    query.value = ''
    isLoading.value = true
    // send to openai
    //  const resp = await post<ApiResponse>('/openai', { body: { query: humanMsg } })
    const resp = await openai_app(route.params.api_key as string, humanMsg)
    // extract info
    const content = resp.data.content
    messages.value.push({
      role: 'ai',
      content: content,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!--  outer container, h - screen -->
  <div class="min-h-screen">
    <!--    top nav; px:left & right padding-->
    <header class="flex h-[74px] bg-gray-100 border-b border-gray-200 px-4">top nav</header>
    <!--    bottom container-->
    <div class="flex flex-row h-[calc(100vh-74px)]">
      <!--      left 2/3-->
      <div class="w-2/3 bg-gray-50 h-full">
        <header class="flex items-center h-16 border-b border-gray-200 px-7 text-xl text-gray-70">
          应用编排
        </header>
        <div class="flex flex-row h-full">
          <div class="flex-1 border-r border-gray-200 p-6">人设与回复逻辑</div>
          <div class="flex-1 p-6">应用能力</div>
        </div>
      </div>
      <!--      right 1/3-->
      <div class="flex flex-col w-1/3 bg-white h-full">
        <header
          class="flex flex-shrink-0 items-center h-16 border-b border-gray-200 px-7 text-xl text-gray-70 shadow-sm"
        >
          浏览与调试
        </header>
        <!--        chat history-->
        <div class="h-full min-h-0 px-6 py-7 overflow-x-hidden overflow-y-scroll scrollbar-w-none">
          <!--        人类消息-->
          <div class="flex flex-row gap-2 mb-6" v-for="message in messages" :key="message.content">
            <a-avatar
              v-if="message.role === 'human'"
              class="flex-shrink-0"
              :size="30"
              :style="{ backgroundColor: '#3370ff' }"
            >
              WY
            </a-avatar>
            <a-avatar
              v-else
              class="flex-shrink-0"
              :size="30"
              :style="{ backgroundColor: '#00d0b6' }"
            >
              <icon-apps />
            </a-avatar>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700">
                {{ message.role === 'human' ? 'wenyan' : 'chatgpt' }}
              </div>
              <div
                v-if="message.role === 'human'"
                class="bg-blue-700 text-white border border-blue-800 px-4 py-3 rounded-2xl leading-5"
              >
                {{ message.content }}
              </div>
              <div
                v-else
                class="bg-gray-100 text-gray-900 border border-gray-50 px-4 py-3 rounded-2xl leading-5"
              >
                {{ message.content }}
              </div>
            </div>
          </div>
          <!--          loading-->
          <div v-if="isLoading" class="flex flex-row gap-2 mb-6">
            <a-avatar class="flex-shrink-0" :size="30" :style="{ backgroundColor: '#00d0b6' }">
              <icon-apps />
            </a-avatar>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700">chatgpt</div>
              <div
                class="bg-gray-100 text-gray-900 border border-gray-50 px-4 py-3 rounded-2xl leading-5"
              >
                <icon-loading />
              </div>
            </div>
          </div>
          <!--         no content -->
          <div v-if="!messages.length" class="flex flex-col items-center mt-[20vh] gap-2">
            <a-avatar
              class="flex-shrink-0"
              :size="50"
              :style="{ backgroundColor: '#00d0b6' }"
              shape="square"
            >
              <icon-apps />
            </a-avatar>
            <div class="text-3xl font-semibold text-gray-700">chat-gpt-3.5</div>
          </div>
        </div>
        <!--        input box-->
        <div class="w-full flex-shrink-0 flex flex-col">
          <!--          top-->
          <div class="px-6 flex items-center gap-4">
            <a-button class="flex-shrink-0" type="text" shape="circle" @click="clearMsg">
              <template #icon>
                <icon-empty :size="16" :style="{ color: '#374151' }"></icon-empty>
              </template>
            </a-button>
            <div
              class="h-[50px] flex items-center flex-1 gap-2 px-4 border border-gray-900 rounded-2xl"
            >
              <input type="text" class="flex-1 outline-0" v-model="query" @keyup.enter="send" />
              <a-button type="text" shape="circle">
                <template #icon>
                  <icon-plus-circle size="16" :style="{ color: '#374151' }" />
                </template>
              </a-button>
              <a-button type="text" shape="circle" @click="send">
                <template #icon>
                  <icon-send size="16" :style="{ color: '#3491FA' }" />
                </template>
              </a-button>
            </div>
          </div>
          <!--          bottom-->
          <div class="text-center text-gray-500 text-xs py-4">内容由AI生成</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
