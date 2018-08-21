<template>
  <nav
    class="navbar is-primary"
    role="navigation">
    <div class="navbar-brand">
      <router-link
        to="/"
        class="navbar-item">
        <b-icon icon="pencil"/>
        go-wiki
      </router-link>
      <div
        class="navbar-burger burger"
        data-target="navMain">
        <span/>
        <span/>
        <span/>
      </div>
    </div>

    <div
      id="navMain"
      class="navbar-menu">
      <div class="navbar-start"/>

      <div class="navbar-end">
        <router-link
          v-if="!user"
          to="/register"
          class="navbar-item">
          Register
        </router-link>
        <router-link
          v-if="!user"
          to="/login"
          class="navbar-item">
          Login
        </router-link>
        <router-link
          v-if="user"
          to="/profile"
          class="navbar-item">
          <b-icon icon="face"/>
          &nbsp;{{ user.name }}
        </router-link>
        <a
          v-if="user"
          class="navbar-item"
          @click="logout">
          Logout
        </a>
      </div>
    </div>
  </nav>
</template>

<style>
    #navMain {
        background-color: #222;
    }
</style>

<script>
const CreateSpaceModalForm = {
  props: ['spacename', 'spacekey', 'description', 'loading'],
  template: `
            <form v-on:submit.prevent="createSpace">
                <div class="modal-card" style="width: auto; min-width: 500px">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Create Space</p>
                    </header>
                    <section class="modal-card-body">
                        <b-field label="Space-Name"
                                 :type="errors.has('Space-Name') ? 'is-danger' : ''"
                                 :message="errors.first('Space-Name')">
                            <b-input v-model.trim="spacename"
                                     name="Space-Name"
                                     v-validate="'required'">
                            </b-input>
                        </b-field>

                        <b-field label="Space-Key"
                                 :type="errors.has('Space-Key') ? 'is-danger' : ''"
                                 :message="errors.first('Space-Key')">
                            <b-input v-model.trim="spacekey"
                                     name="Space-Key"
                                     v-validate="'required'">
                            </b-input>
                        </b-field>

                        <b-field label="Description">
                            <b-input type="textarea"
                                     v-model.trim="description"
                                     name="Description">
                            </b-input>
                        </b-field>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" type="button" @click="$parent.close()">Close</button>
                        <button :disabled="errors.any()"
                                v-bind:class="{'is-loading': loading}"
                                class="button is-primary">Create Space
                        </button>
                    </footer>
                </div>
            </form>
        `,
  methods: {
    createSpace: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true

          this.$http.post(this.$store.state.backendURL + '/api/wiki', {
            name: this.spacename,
            key: this.spacekey,
            description: this.description,
            isPublic: true
          }).then(() => {
            this.loading = false

            this.$toast.open({
              type: 'is-success',
              message: 'Creation of wiki space "' + this.spacekey + '" was successfull!'
            })

            this.$parent.close()
            this.$router.push({ path: '/wiki/' + this.spacekey })
          }, res => {
            this.$toast.open({
              type: 'is-warning',
              message: res.body.message
            })

            this.loading = false
          })
        }
      })
    }
  }
}

export default {
  components: {
    CreateSpaceModalForm
  },
  data: function () {
    return {
      isCreateSpaceModalActive: false,
      formCreateSpace: {
        spacename: '',
        spacekey: '',
        description: '',
        loading: false
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    permissions () {
      return this.$store.state.permissions
    }
  },
  methods: {
    logout () {
      this.$store.commit('setUser', {user: null})
      this.$toast.open({
        type: 'is-success',
        message: 'Du wurdest ausgeloggt'
      })

      this.$router.push({path: '/'})
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)
  // Check if there are any nav burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {
        // Get the target from the "data-target" attribute
        var target = $el.dataset.target
        var $target = document.getElementById(target)
        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active')
        $target.classList.toggle('is-active')
      })
    })
  }
})
</script>
