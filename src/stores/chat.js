// src/stores/chat.js (unchanged)
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const data = ref([])
  const answer = ref('')
  const streamdiv = ref(false)
  const toggled = ref(false)
  const waiting = ref(false)

  return { data, answer, streamdiv, toggled, waiting }
})
