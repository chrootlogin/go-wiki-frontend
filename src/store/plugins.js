import {STORAGE_KEY} from './mutations'

const localStoragePlugin = store => {
  store.subscribe((mutation, {user}) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  })
}

export default [localStoragePlugin]
