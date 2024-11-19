// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

// Components
import App from "./App.vue"

// Composables
import { createApp } from "vue"
import { createVuetify } from "vuetify"


const app = createApp(App)

const vuetify = createVuetify({
    theme: {
        defaultTheme: "light",
    }
});

app.use(vuetify);

app.mount("#app")
