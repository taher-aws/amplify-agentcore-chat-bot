import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";

// Amplify configuration will be added when invoke_agent is implemented
// import { Amplify } from "aws-amplify";
// import outputs from "../amplify_outputs.json";
// Amplify.configure(outputs);

createApp(App).mount("#app");
