<template>
  <div class="identity">
    <div>
      <h4 class="identity__title">{{ user.pseudo }}</h4>
      <p class="identity__title">Inscrit(e), sur le réseau social, depuis le {{ user.inscriptionDate }}</p>
    </div>
    <div v-if="user.avatar">
       <img :src="user.avatar" alt="Avatar">
    </div>
    <div v-else>
      <img src="../assets/images/rse/mystery_member_default.jpg" alt="avatar">
    </div>
    <button @click="upload = !upload" class="btn"><Icon icon="gridicons:add-image" color="#be2121" height="30" /> Mettre à jour mon avatar</button>
    <div v-if="upload">
      <file-upload @newavatar="getNewavatar"/>
    </div>
    <div class="form-row">
      <button @click="logout()" class="button">Se déconnecter</button>
    </div>
    <button @click="deleteUser(user)"  class="btn delt">
      <Icon icon="emojione:cross-mark-button" color="#be2121" height="15" />
      Supprimer définitivement mon profil
    </button>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload.vue'
import axios from 'axios'
import { Icon } from '@iconify/vue'
import { mapActions } from 'vuex'

export default {
  name: 'ProfileView',
  props: ['initRect'],
  components: {
    FileUpload,
    Icon
  },
  data () {
    return {
      user: {},
      upload: false,
      userProfile: {},
      pseudo: '',
      avatar: '',
      inscriptionDate: ''
    }
  },
  methods: {
    getNewavatar (value) {
      console.log(value)
      this.$store.state.user.avatar = value
      this.upload = false
      setTimeout(function (scope) { scope.location.reload() }, 2000, this)
      location.reload()
    },
    logout: function () {
      this.$store.commit('logout')
      this.$router.push('/signup')
      const user = this.$store.state.user
      this.$store.dispatch('logout', user)
      location.reload()
    },
    ...mapActions(['deleteUser']),
    deleteUser () {
      const user = this.$store.state.user
      this.$store.dispatch('deleteUser', user)
    }
  },
  mounted: function () {
    if (this.$store.state.user.userId === -1) {
      this.$router.push('/signup')
      return
    }
    axios.get(`http://localhost:3000/api/user/profile/${this.$store.state.user.userId}`, {
      headers: {
        Authorization: `Bearer ${this.$store.state.user.token}`
      }
    })
      .then((res) => {
        this.user = res.data.user
        this.$store.commit('userProfile', res.data.user)
      })
      .catch(err => console.log(err.message))
  }
}
</script>

<style scoped>

.identity__title {
  padding-bottom: 10px;
  color: #0048A8;
}

img {
  max-width: 100%;
  width: 350px;
  object-fit: cover;
  margin: 0 auto;
}
.btn {
  margin-top: 20px;
}
.delt {
  font-size: 14px;
  text-decoration: underline;
  margin-top: 30px;
}

</style>
