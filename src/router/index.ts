import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/Index.vue'
import {useUserStore, userLocalStorage} from "@/stores/user";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'index',
            component: HomeView,
            redirect: '/statistics',
            children: [
                {
                    path: '/statistics',
                    name: 'statistics',
                    component: () => import('../views/statistics/index.vue')
                },
                {
                    path: '/file-detect',
                    name: 'file-detect',
                    component: () => import('../views/file-detect/index.vue')
                },
                {
                    path: '/text-detect',
                    name: 'text-detect',
                    component: () => import('../views/text-detect/index.vue')
                },
                {
                    path: '/detect-list',
                    name: 'detect-list',
                    component: () => import('../views/detect-list/index.vue')
                },
                {
                    path: '/about',
                    name: 'about',
                    component: () => import('../views/about/index.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/login/index.vue')
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/signup/index.vue')
        },
    ]
})


router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const localStorage = userLocalStorage()
    console.log("---路由守卫---")
    console.log("username: #" + userStore.username + "#")
    if (to.path == '/login' || to.path == '/signup') {
        console.log("---是login | signup直接进入---")
        next()
        return;
    }
    // 检查是否登录
    if (userStore.username != null && userStore.username != "") {
        console.log("通过认证")
        next()
    } else if (localStorage.username != null && localStorage.username != "") {
        userStore.login(localStorage.username)
        next()
    } else {
        console.log("重定向到login")
        next("/login")
    }
})
export default router
