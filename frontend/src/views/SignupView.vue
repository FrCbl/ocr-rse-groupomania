<template>
  <div class="identity">
    <h1 class="identity__title" v-if="mode == `login`">Me connecter</h1>
    <h1 class="identity__title" v-else>Je crée mon compte</h1>
    <p v-if="mode == 'login'">Nouveau membre du forum ? <span class="identity__action" @click="switchToCreateAccount()">Créer un compte</span></p>
    <p v-else>Vous êtes déjà incrit ? <span class="identity__action" @click="switchToLogin()">Se connecter</span></p>
    <div class="form-row">
      <input v-model="email" class="form-row__input" type="email" placeholder="Votre email" />
    </div>
    <div class="form-row" v-if="mode == 'create'">
      <input v-model="pseudo" class="form-row__input" type="text" placeholder="Votre pseudonyme" />
    </div>
    <div class="form-row">
      <input v-model="password" class="form-row__input" type="password" placeholder="Votre mot de passe" />
    </div>
    <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
      Email et/ou mot de passe incorrect
    </div>
    <div class="form-row" v-if="mode == 'create' && status == 'error_create'">
      Une inscription a déjà été trouvé avec cet email !
    </div>
    <div class="form-row">
      <button @click="logIn()" class="button" :class="{'button--disabled' : !validFields}" v-if="mode == 'login'">
        <span v-if="status == 'loading'">Connexion en cours...</span>
        <span v-else>Se connecter</span>
      </button>
      <button @click="signUp()" class="button" :class="{'button--disabled' : !validFields}" v-else>
        <span v-if="status == 'loading'">Création du compte...</span>
        <span v-else>Créer un compte</span>
      </button>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'LoginView',
  data: function () {
    return {
      mode: 'login',
      email: '',
      pseudo: '',
      password: ''
    }
  },
  computed: {
    validFields: function () {
      if (this.mode === 'create') {
        if (this.email !== '' && this.pseudo !== '' && this.password !== '') {
          return true
        } else {
          return false
        }
      } else {
        if (this.email !== '' && this.password !== '') {
          return true
        } else {
          return false
        }
      }
    },
    ...mapState(['status'])
  },
  methods: {
    switchToCreateAccount () {
      this.mode = 'create'
    },
    switchToLogin () {
      this.mode = 'login'
    },
    logIn () {
      const self = this
      this.$store.dispatch('logIn', {
        email: this.email,
        password: this.password,
        pseudo: this.pseudo,
        avatar: this.avatar,
        droitsAdmin: this.droitsAdmin
      }).then(function (response) {
        console.log('login userId', response.data.userId)
        self.$router.push(`/profile/${response.data.userId}`)
      }).catch(function (error) {
        console.log(error)
      })
    },
    signUp () {
      const self = this
      this.$store.dispatch('signUp', {
        email: this.email,
        pseudo: this.pseudo,
        password: this.password
      }).then(function (response) {
        self.logIn()
        console.log(response.data.userId)
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.identity {
  margin: 80px auto;
}

</style>
