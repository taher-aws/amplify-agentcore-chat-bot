<script setup lang="ts">
import '@/assets/main.css';
import { ref } from 'vue';

// Store chat messages
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const messages = ref<Message[]>([]);
const inputMessage = ref('');
const isLoading = ref(false);

// Dummy invoke_agent method - will be implemented later
async function invokeAgent(message: string): Promise<string> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return "Hi from agent";
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isLoading.value) {
    return;
  }

  const userMessage: Message = {
    id: Date.now().toString(),
    text: inputMessage.value,
    sender: 'user',
    timestamp: new Date()
  };

  messages.value.push(userMessage);
  const messageText = inputMessage.value;
  inputMessage.value = '';
  isLoading.value = true;

  try {
    const agentResponse = await invokeAgent(messageText);
    
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: agentResponse,
      sender: 'agent',
      timestamp: new Date()
    };

    messages.value.push(agentMessage);
  } catch (error) {
    console.error('Error invoking agent:', error);
  } finally {
    isLoading.value = false;
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
</script>

<template>
  <main class="chat-container">
    <h1>Chat Interface</h1>
    
    <!-- Chat messages area -->
    <div class="messages-container">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message', message.sender === 'user' ? 'user-message' : 'agent-message']"
      >
        <div class="message-content">
          {{ message.text }}
        </div>
      </div>
      
      <div v-if="isLoading" class="message agent-message">
        <div class="message-content">
          Thinking...
        </div>
      </div>

      <div v-if="messages.length === 0" class="empty-state">
        Start a conversation by typing a message below
      </div>
    </div>

    <!-- Input area -->
    <div class="input-container">
      <input 
        v-model="inputMessage"
        type="text"
        placeholder="Type your message..."
        @keypress="handleKeyPress"
        :disabled="isLoading"
        class="message-input"
      />
      <button 
        @click="sendMessage"
        :disabled="!inputMessage.trim() || isLoading"
        class="send-button"
      >
        Send
      </button>
    </div>
  </main>
</template>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  text-align: center;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-style: italic;
}

.message {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  margin-left: auto;
}

.agent-message {
  align-self: flex-start;
  background-color: #e9ecef;
  color: #333;
  margin-right: auto;
}

.message-content {
  line-height: 1.4;
}

.input-container {
  display: flex;
  gap: 10px;
  padding: 10px 0;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #007bff;
}

.message-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.send-button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.send-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
