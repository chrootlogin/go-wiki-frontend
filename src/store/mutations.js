export const STORAGE_KEY = 'go-wiki'

export const state = {
  backendURL: (function () {
    let env = process.env.NODE_ENV
    if (env === 'production') {
      let loc = window.location

      let port = ''
      if (loc.port === '80' || loc.port === '443') {
        port = ':' + loc.port
      }

      return loc.protocol + '//' + loc.host + port
    }

    return 'http://localhost:8000'
  })(),
  user: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null'),
  notification: {},
  permissions: []
}

export const mutations = {
  setUser (state, {user}) {
    state.user = user
  },
  setNotification (state, {notification}) {
    state.notification = notification
  },
  setPermissions (state, {permissions}) {
    state.permissions = permissions
  },
  setConfiguration (state, {configuration}) {
    state.configuration = configuration
  }
}
