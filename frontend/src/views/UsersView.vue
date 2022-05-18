<template>
  <h2>Les salarié(e)s inscrit(e)s sur le forum</h2>
  <div v-for="user in users" :key="user.userID" class="user">
    <div>
      <h3 class="user__info">{{ user.pseudo }}</h3>
    </div>
    <div v-if="user.avatar">
      <img :src="user.avatar" alt="avatar" class="imgCirc"></div>
    <div v-else>
      <img src="../assets/images/rse/mystery_member_default.jpg" alt="avatar" class="imgCirc">
    </div>    
    <button @click="deleteUser(user)" v-if="users.userID == this.$store.state.user.userId || this.$store.state.userProfile.droitsAdmin > 0" class="btn">
      <Icon icon="ion:trash-bin-sharp" color="#BE2121" height="40" />
    </button>
  </div>
</template>

<script>

import axios from 'axios'
import { Icon } from '@iconify/vue'

export default {
  data () {
    return {
      users: [],
      user: {}
    }
  },
  components: {
    Icon
  },
  methods: {
    deleteUser (user) {
      const token = this.$store.state.user.token
      console.log(user.userID)
      axios.delete(`http://localhost:3000/api/user/profile/${user.userID}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          console.log(res)
          location.reload()
        })
        .catch(err => console.log(err.message))
    }
  },
  mounted () {
    console.log(this.$store.state.user.token)
    if (this.$store.state.user.userId === -1) {
      this.$router.push('/signup')
      return
    }
    axios.get('http://localhost:3000/api/user/users', { headers: { Authorization: `Bearer ${this.$store.state.user.token}` } })
      .then((res) => {
        console.log(res.data)
        this.users = res.data.users
      })
      .catch(err => console.log(err.message))
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  gap: 16px;
};
.user {
  max-width: 100%;
  width: 350px;
  display: flex;
  justify-content: space-around;
  gap: 16px;
  background: white;
  padding: 10px;
  margin: 10px auto;
  border: 1px solid #0048A8;
}
.user__info {
  margin: 16px 0px;
  text-align: left;
  font-weight: 500;
  gap: 16px;
}

</style>
