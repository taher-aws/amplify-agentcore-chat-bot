<script setup lang="ts">
import '@/assets/main.css';
import { ref, onMounted, nextTick } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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
const sessionId = ref<string>('');
const messagesContainer = ref<HTMLElement | null>(null);

// Lambda API configuration
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

// Initialize session ID on mount
onMounted(() => {
  sessionId.value = crypto.randomUUID();
  console.log('Session ID:', sessionId.value);
});

// Parse and sanitize markdown
function parseMarkdown(text: string): string {
  const rawHtml = marked.parse(text) as string;
  return DOMPurify.sanitize(rawHtml);
}

// Scroll to bottom of messages
async function scrollToBottom() {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

// Invoke agent via Lambda API
async function invokeAgent(message: string): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: message,
        sessionId: sessionId.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling agent API:', error);
    throw error;
  }
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

  await scrollToBottom();

  try {
    const agentResponse = await invokeAgent(messageText);
    
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: agentResponse,
      sender: 'agent',
      timestamp: new Date()
    };

    messages.value.push(agentMessage);
    await scrollToBottom();
  } catch (error) {
    console.error('Error invoking agent:', error);
    
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      sender: 'agent',
      timestamp: new Date()
    };
    messages.value.push(errorMessage);
    await scrollToBottom();
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
    <div class="messages-container" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">✨</div>
        <h2>Start a conversation</h2>
        <p>Ask me anything and I'll help you find the information you need</p>
      </div>

      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message-wrapper', message.sender === 'user' ? 'user-wrapper' : 'agent-wrapper']"
      >
        <div :class="['message', `${message.sender}-message`]">
          <div 
            v-if="message.sender === 'agent'" 
            class="message-content markdown-content"
            v-html="parseMarkdown(message.text)"
          />
          <div v-else class="message-content">
            {{ message.text }}
          </div>
        </div>
      </div>
      
      <div v-if="isLoading" class="message-wrapper agent-wrapper">
        <div class="message agent-message loading-message">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="input-container">
      <div class="input-wrapper">
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  color: #ffffff;
  overflow: hidden;
  min-height: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem 1.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  scroll-behavior: smooth;
  min-height: 0;
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.7);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
  opacity: 0.7;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.empty-state h2 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.empty-state p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.message-wrapper {
  display: flex;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-wrapper {
  justify-content: flex-end;
}

.agent-wrapper {
  justify-content: flex-start;
}

.message {
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  word-wrap: break-word;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.user-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.agent-message {
  background: rgba(30, 30, 46, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-bottom-left-radius: 0.25rem;
}

.loading-message {
  padding: 1.25rem 1.5rem;
}

.message-content {
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Markdown Styles */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
  color: #a5b4fc;
}

.markdown-content :deep(h1) { font-size: 1.5em; }
.markdown-content :deep(h2) { font-size: 1.3em; }
.markdown-content :deep(h3) { font-size: 1.1em; }

.markdown-content :deep(p) {
  margin: 0.75em 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.75em 0;
  padding-left: 1.5em;
}

.markdown-content :deep(li) {
  margin: 0.25em 0;
}

.markdown-content :deep(code) {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: #a5b4fc;
}

.markdown-content :deep(pre) {
  background: rgba(0, 0, 0, 0.4);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #e0e0e0;
}

.markdown-content :deep(a) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid rgba(102, 126, 234, 0.5);
}

.markdown-content :deep(a:hover) {
  border-bottom-color: #667eea;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: #a5b4fc;
}

.markdown-content :deep(blockquote) {
  border-left: 3px solid #667eea;
  padding-left: 1em;
  margin: 1em 0;
  color: rgba(255, 255, 255, 0.8);
}

.typing-indicator {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.input-container {
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(79, 70, 229, 0.3);
  padding: 1.5rem;
  flex-shrink: 0;
}

.input-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 0.875rem 1.25rem;
  background: rgba(30, 30, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
}

.message-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.message-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.message-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button {
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-button:active:not(:disabled) {
  transform: translateY(0);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .messages-container {
    padding: 1rem;
  }

  .message {
    max-width: 85%;
    padding: 0.875rem 1rem;
  }

  .input-container {
    padding: 1rem;
  }

  .message-input {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .send-button {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 480px) {
  .message {
    max-width: 90%;
    font-size: 0.9rem;
  }

  .empty-state h2 {
    font-size: 1.25rem;
  }

  .empty-state p {
    font-size: 0.9rem;
  }
}
</style>
