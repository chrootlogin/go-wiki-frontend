<template>
  <div>
    <div class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title"><span class="fa fa-lock"/> Profile</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  beforeMount: function () {
    if (
      !this.$store.state.user ||
                this.$store.state.user.name === 'anonymous'
    ) {
      this.$toast.open({
        type: 'is-danger',
        message: 'To open your profile, you have to be logged-in!'
      })

      this.$router.push({path: '/login'})
    }
  }
}
</script>
