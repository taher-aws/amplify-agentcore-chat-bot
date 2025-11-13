import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";

async function bootstrap() {
  try {
    const outputsModule = await import("../amplify_outputs.json");
    const outputs = outputsModule.default ?? outputsModule;
    Amplify.configure(outputs);
  } catch (error) {
    console.warn("Amplify outputs not found; skipping Amplify.configure().");
  } finally {
    createApp(App).mount("#app");
  }
}

bootstrap();
