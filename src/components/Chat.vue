<!-- Chat.vue -->
<template>
  <div class="chat-container">
    <div class="messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']"
      >
        <strong>{{ message.role === 'user' ? 'You' : 'AI' }}: </strong>
        <span v-html="message.content"></span>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="input-form">
      <textarea
        v-model="newMessage"
        placeholder="Type your message..."
        @keyup.enter="sendMessage"
        rows="3"
      ></textarea>
      <button class="send-button" type="submit" :disabled="isLoading">
        {{ isLoading ? 'Sending...' : 'Send' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// API endpoint configuration
const API_URL = 'http://localhost:3001'

// State
const messages = ref([])
const newMessage = ref('')
const isLoading = ref(false)

// Methods
const sendMessage = async () => {
  if (!newMessage.value || isLoading.value) return

  // Add user message to history
  const userMessage = {
    role: 'user',
    content: newMessage.value.trim(),
  }
  messages.value.push(userMessage)

  isLoading.value = true

  try {
    // Prepare chat history for API (excluding the latest message)
    const history = messages.value.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }))

    // Send request to backend
    const response = await axios.post(`${API_URL}/chat`, {
      history,
      chat: newMessage.value.trim(),
    })

    // Add AI response to history
    messages.value.push({
      role: 'model',
      content: response.data.text,
    })
  } catch (error) {
    console.error('Error sending message:', error)
    messages.value.push({
      role: 'model',
      content: 'Sorry, there was an error processing your request.',
    })
  } finally {
    newMessage.value = ''
    isLoading.value = false
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  font-family: 'Inter', sans-serif;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message {
  margin: 15px 0;
  padding: 15px;
  border-radius: 10px;
  animation: slideIn 0.3s ease-out;
  transition: transform 0.2s ease;
}

.message:hover {
  transform: translateY(-2px);
}

.user-message {
  background: linear-gradient(45deg, #007bff, #00c6ff);
  color: white;
  margin-left: 25%;
  position: relative;
}

.user-message::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-left-color: #007bff;
}

.ai-message {
  background: rgba(255, 255, 255, 0.95);
  margin-right: 25%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
}

.ai-message::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 20px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: rgba(255, 255, 255, 0.95);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8em;
  opacity: 0.8;
}

.role {
  font-weight: 600;
}

.timestamp {
  color: #999;
}

.message-content {
  line-height: 1.5;
}

.input-form {
  display: flex;
  gap: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(5px);
}

textarea {
  flex-grow: 1;
  padding: 15px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  resize: vertical;
  transition: all 0.3s ease;
}

textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
}

.send-button {
  padding: 15px 30px;
  background: linear-gradient(45deg, #007bff, #00c6ff);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
}

.send-button:disabled {
  background: linear-gradient(45deg, #666, #999);
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
