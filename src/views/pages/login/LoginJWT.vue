<template>
  <div>
    <vs-input
        v-validate="'required|email|min:3'"
        data-vv-validate-on="blur"
        name="email"
        icon-no-border
        icon="icon icon-user"
        icon-pack="feather"
        label-placeholder="Email"
        v-model="email"
        class="w-full mt-10"/>
    <span class="text-danger text-sm">{{ errors.first('email') }}</span>

    <vs-input
        data-vv-validate-on="blur"
        v-validate="'required'"
        type="password"
        name="password"
        icon-no-border
        icon="icon icon-lock"
        icon-pack="feather"
        label-placeholder="Password"
        v-model="password"
        class="w-full mt-10" />
    <span class="text-danger text-sm">{{ errors.first('password') }}</span>

    <div class="flex flex-wrap justify-between mb-3 mt-8">
      <vs-button :disabled="!validateForm" @click="loginJWT">Login</vs-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any() && this.email !== '' && this.password !== ''
    }
  },
  methods: {
    checkLogin () {
      // If user is already logged in notify
      if (this.$store.state.auth.isUserLoggedIn()) {

        // Close animation if passed as payload
        // this.$vs.loading.close()

        this.$vs.notify({
          title: 'Login Attempt',
          text: 'You are already logged in!',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning'
        })

        return false
      }
      return true
    },
    loginJWT () {

      if (!this.checkLogin()) return

      // Loading
      this.$vs.loading()

      const payload = {
        userDetails: {
          email: this.email,
          password: this.password
        }
      }

      this.$store.dispatch('auth/loginJWT', payload)
        .then(() => { this.$vs.loading.close() })
        .catch(error => {
          this.$vs.loading.close()
          this.$vs.notify({
            title: 'Unauthenticated',
            text: error.response.data.message,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        })
    },
    registerUser () {
      if (!this.checkLogin()) return
      this.$router.push('/pages/register').catch(() => {})
    }
  }
}

</script>

