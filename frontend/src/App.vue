<template>
  <header class="top-menu">
    <nav class="top-menu">
      <router-link to="/"><Icon icon="healthicons:forum" color="#0048A8" height="30" class="icon" /> Forum</router-link>
      <router-link to="/profile/:userId"><Icon icon="gis:globe-users" color="#0048A8" height="30" class="icon"/> Mon profil</router-link>
      <router-link to="/users"><Icon icon="fluent:people-community-20-filled" color="#0048A8" height="30" class="icon"/> Communauté</router-link>      
      <router-link to="/signup"><Icon icon="majesticons:login-line" color="#0048A8" height="30" class="icon"/> Se connecter</router-link>
    </nav>
    <router-link to="/"><img src="./assets/images/groupomania/icon-left-font-monochrome-white.png" alt="Logo Groupomania" class="top-menu-logo"></router-link>
  </header>
  <router-view/>
</template>

<style lang="scss">

.top-menu{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  background: rgb(149, 153, 173);
    .top-menu-logo {
      width: 22rem;
    }
    img {
      width: 3rem;
      display: inline;
      vertical-align: middle;
    }
}

nav {
  padding: 20px;
  width: 35rem;
  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #be2121;
    }
  }
}

</style>

<script>
import { Icon } from '@iconify/vue'
import axios from 'axios'

export default {
  data: () => {
    return {
      user: {},
      userProfile: {},
      userId: '',
      avatar: ''
    }
  },
  props: ['avatarSmall'],
  components: {
    Icon
  },
  methods: {
  },
  mounted () {
    const ls = localStorage.getItem('user')
    if (ls) {
      console.log('1')
      const user = JSON.parse(ls)
      const token = user.token
      console.log('2', user)
      console.log(token)
      axios.get('http://localhost:3000/api/user/auth', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        console.log(res)
        this.$store.dispatch('fill', user)
        this.avatar = this.$store.state.userProfile.avatar
      }).catch(err => console.log(err))
    }
  },
  updated: function () {
    console.log(this.$store.state.user)
  }
}
</script>
