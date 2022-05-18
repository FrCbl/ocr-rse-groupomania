<template>
  <div class="alert alert--success" v-if="isSuccess">
    Votre publication a été publiée !
  </div>
  <div class="posting">
    <form @submit.prevent="createPost" enctype="multipart/form-data">
      <div class="form-row">
        <input type="text" class="form-row__input" placeholder="Le titre de votre publication" v-model="title">
      </div>
      <div class="form-row">
        <textarea
          id="content"
          class="form-row__input"
          v-model="content"
          v-on:keyup.enter="createPost"
          placeholder="Quelques mots sur votre publication...">
        </textarea>
      </div>
    </form>
    <div class="form-row push">
      <button @click="upload = !upload" class="btn"><Icon icon="gridicons:add-image" color="#be2121" height="30" />Ajouter une image</button>
    </div>
    <form @submit.prevent="createPost" enctype="multipart/form-data">
      <div v-if="upload" class="upload">
        <div class="form-row">
          <label>
            <input type="file" name="image" id="image" class="form-row__input" @change="onSelect ($event)"/>
          </label><br>
        </div>
        <div class="form-row">
          <button class="button">Valider ma publication</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { Icon } from '@iconify/vue'

export default {
  name: 'PostInput',
  emits: ['newPost'],
  components: {
    Icon
  },
  data () {
    return {
      title: '',
      content: '',
      user: {},
      userProfile: {},
      file: '',
      isSuccess: false,
      upload: false,
      avatar: ''
    }
  },
  methods: {
    onSelect (event) {
      this.FILE = event.target.files[0]
      console.log(event)
    },
    async createPost () {
      const token = this.$store.state.user.token
      const formData = new FormData()
      if (this.FILE == null) {
        formData.append('title', this.title)
        formData.append('content', this.content)
      } else {
        formData.append('title', this.title)
        formData.append('content', this.content)
        formData.append('image', this.FILE, this.FILE.name)
      }
      await axios.post('http://localhost:3000/api/post/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          console.log(response.data)
          this.isSuccess = true
          setTimeout(function (scope) {
            scope.isSuccess = false
          }, 2000, this)
          this.upload = false
          this.$emit('newPost', response.data.post)
          document.location.reload()
        })
        .catch((error) => console.log(error))
    }
  },
  mounted: function () {
    if (this.$store.state.user.userId === -1) {
      this.$router.push('/signup')
    } else {
      console.log(this.$store.state.user)
      this.avatar = this.$store.state.user.avatar
    }
  },
  updated: function () {
    if (this.$store.state.user.userId === -1) {
      this.$router.push('/signup')
    } else {
      console.log(this.$store.state.user)
      this.avatar = this.$store.state.user.avatar
    }
  }
}
</script>

<style scoped>
.posting {
  border-radius: 5px;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  margin: 16px  auto;
  gap: 16px;
  background: white;
  max-width: 700px;
}
.form-row__input {
  width: 680px;
  font-family: Arial;
}

@media (max-width: 768px) {
  .push {
    margin-left: auto;
  }
  .form-row__input {
    width: 100%;
  }
  #image {
    font-size: small;
  }
}
</style>
