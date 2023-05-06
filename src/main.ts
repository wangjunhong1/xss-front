import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import piniaPluginPersist from 'pinia-plugin-persist'
import VueCookies from "vue3-cookies";
import './assets/main.css'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersist))
app.use(ElementPlus)
app.use(router)
app.use(VueCookies)

// @ts-ignore
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
