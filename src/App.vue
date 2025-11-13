<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import Chat from './components/Chat.vue';
</script>

<template>
  <Authenticator>
    <template #default="{ signOut }">
      <main class="app-shell">
        <header class="app-header">
          <button type="button" @click="signOut" class="sign-out-button">Sign out</button>
        </header>
        <Chat />
      </main>
    </template>
  </Authenticator>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
}

.sign-out-button {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.sign-out-button:hover {
  background-color: #c82333;
}
</style>
