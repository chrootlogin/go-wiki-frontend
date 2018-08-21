import Vue from 'vue'
// Global Components
import App from './components/App.vue'
import Home from './components/shared/Home.vue'
import Nav from './components/shared/Nav.vue'
import Register from './components/shared/Register.vue'
import Login from './components/shared/Login.vue'
import Notification from './components/shared/Notification.vue'
import Profile from './components/shared/Profile.vue'
import GetPage from './components/wiki/GetPage.vue'
import CreateEditPage from './components/wiki/CreateEditPage.vue'

Vue.component('login', Login)
Vue.component('navbar', Nav)
Vue.component('notification', Notification)

export const GlobalComponents = {
  App,
  Register,
  Login,
  Profile
}

export const LocalComponents = {
  Home
}

export const WikiComponents = {
  GetPage,
  CreateEditPage
}
