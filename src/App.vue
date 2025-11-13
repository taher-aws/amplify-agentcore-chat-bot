<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import Chat from './components/Chat.vue';
</script>

<template>
  <Authenticator>
    <template #default="{ signOut }">
      <div class="app-container">
        <header class="app-header">
          <div class="header-content">
            <div class="logo">
              <div class="logo-icon">🤖</div>
              <h1>AI Assistant</h1>
            </div>
            <button type="button" @click="signOut" class="sign-out-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Sign Out
            </button>
          </div>
        </header>
        <Chat />
      </div>
    </template>
  </Authenticator>
</template>

<style>
/* Global Amplify Authenticator Dark Theme Override */
:root {
  --amplify-colors-background-primary: #0a0a0a;
  --amplify-colors-background-secondary: #1a1a2e;
  --amplify-colors-font-primary: #ffffff;
  --amplify-colors-font-secondary: rgba(255, 255, 255, 0.7);
  --amplify-colors-brand-primary-10: #667eea;
  --amplify-colors-brand-primary-80: #667eea;
  --amplify-colors-brand-primary-90: #764ba2;
  --amplify-colors-brand-primary-100: #764ba2;
}

[data-amplify-authenticator] {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-amplify-authenticator] [data-amplify-container] {
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 2rem;
}

[data-amplify-authenticator] input {
  background: rgba(30, 30, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: white;
}

[data-amplify-authenticator] input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

[data-amplify-authenticator] button[type="submit"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

[data-amplify-authenticator] button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

.app-header {
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(79, 70, 229, 0.3);
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.sign-out-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: rgba(220, 53, 69, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.sign-out-button:hover {
  background: rgba(220, 53, 69, 0.3);
  border-color: #ff6b6b;
  transform: translateY(-1px);
}

.sign-out-button svg {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.875rem 1rem;
  }

  .logo h1 {
    font-size: 1.1rem;
  }

  .sign-out-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .logo h1 {
    font-size: 1rem;
  }

  .logo-icon {
    font-size: 1.25rem;
  }

  .sign-out-button span {
    display: none;
  }

  .sign-out-button {
    padding: 0.5rem;
  }
}
</style>
