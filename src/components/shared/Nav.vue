<template>
  <nav
    class="navbar is-primary"
    role="navigation">
    <div class="navbar-brand">
      <router-link
        to="/"
        class="navbar-item">
        <i
          class="fa fa-pencil"
          aria-hidden="true"/> {{ configuration.title }}
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
          v-if="!user && configuration.registration"
          to="/register"
          class="navbar-item">
          Register
        </router-link>
        <router-link
          v-if="!user"
          to="/login"
          class="navbar-item">
          <i
            class="fa fa-sign-in"
            aria-hidden="true"/> Login
        </router-link>
        <router-link
          v-if="user"
          to="/profile"
          class="navbar-item">
          <i
            class="fa fa-user"
            aria-hidden="true"/>&nbsp;{{ user.name }}
        </router-link>
        <a
          v-if="user"
          class="navbar-item"
          @click="logout">
          <i
            class="fa fa-sign-out"
            aria-hidden="true"/> Logout
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
export default {
  computed: {
    user () {
      return this.$store.state.user
    },
    permissions () {
      return this.$store.state.permissions
    },
    configuration () {
      return this.$store.state.configuration
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
