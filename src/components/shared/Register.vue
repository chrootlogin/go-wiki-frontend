<template>
  <div>
    <div class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title"><span class="fa fa-lock"/> Register</h1>
        </div>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <form @submit.prevent="login">
          <b-field
            :type="errors.has('Username') ? 'is-danger' : ''"
            :message="errors.first('Username')"
            label="Username">
            <b-input
              v-validate="'required'"
              v-model.trim="username"
              name="Username"/>
          </b-field>

          <b-field
            :type="errors.has('Password') ? 'is-danger' : ''"
            :message="errors.first('Password')"
            label="Password">
            <b-input
              v-validate="'required'"
              v-model="password"
              type="password"
              name="Password"/>
          </b-field>

          <b-field
            :type="errors.has('Email') ? 'is-danger' : ''"
            :message="errors.first('Email')"
            label="Email">
            <b-input
              v-validate="'required'"
              v-model="email"
              type="email"
              name="Email"/>
          </b-field>

          <button
            :disabled="errors.any()"
            :class="{'is-loading': loading}"
            class="button is-primary">Register new account
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: '',
      email: '',
      loading: false
    }
  },
  methods: {
    login: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true

          this.$http.post(this.$store.state.backendURL + '/user/register', {
            username: this.username,
            password: this.password,
            email: this.email
          }).then(() => {
            this.loading = false

            this.$toast.open({
              type: 'is-success',
              message: 'Registration was successfull.'
            })

            this.$router.push({path: '/login'})
          }, () => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
