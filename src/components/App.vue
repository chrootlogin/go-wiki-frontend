<template>
  <div>
    <div
      v-if="environment === 'development'">
      <div class="has-background-warning">
        <div class="container content">
          <i
            class="fa fa-exclamation-triangle"
            aria-hidden="true"/> Warning! You're running in development mode!
        </div>
      </div>
    </div>
    <navbar/>
    <notification/>
    <router-view/>
  </div>
</template>

<style>
    .notices .toast.is-success {
        background: #00822d
    }

    .field .help {
        width: 100%;
    }

    .field.has-addons {
        flex-wrap: wrap;
    }
</style>

<script>
export default {
  computed: {
    environment () {
      return process.env.NODE_ENV
    }
  },
  mounted () {
    this.setConfiguration()

    // when user is set, reload permissions
    /* this.$store.subscribe((mutation, state) => {
                if(mutation.type === "setUser") {
                    this.setPermissions();
                }
            });
            this.setPermissions(); */
  },
  methods: {
    // set global permissions
    setPermissions () {
      this.$http.get(this.$store.state.backendURL + '/api/user/permissions')
        .then(res => {
          this.$store.commit('setPermissions', {
            permissions: res.body
          })
        })
    },
    // set configuration
    setConfiguration () {
      this.$http.get(this.$store.state.backendURL + '/api/config')
        .then(res => {
          this.$store.commit('setConfiguration', {
            configuration: res.body
          })
        })
    }
  }
}
</script>
