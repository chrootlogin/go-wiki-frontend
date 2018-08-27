<template>
  <div>
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
  mounted: function () {
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
      this.$http.get(this.$store.state.backendURL + '/api/user/permissions').then(res => {
        this.$store.commit('setPermissions', {
          permissions: res.body
        })
      })
    },
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
