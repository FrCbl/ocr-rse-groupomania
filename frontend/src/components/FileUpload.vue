<template>
  <div class="file">
    <form @submit.prevent="onSubmit" enctype="multipart/form-data">
      <div class="form-row">
        <label>
          <input type="file" name="image" id="image" class="form-row__input" @change="onSelect ($event)"/>
        </label><br>
      </div>
      <div class="form-row">
        <button class="button">Valider</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'FileUpload',
  emits: ['newavatar'],
  data () {
    return {
      user: {},
      file: ''
    }
  },
  methods: {
    onSelect (event) {
      this.file = event.target.files[0]
      console.log(event)
    },
    onSubmit () {
      const token = this.$store.state.user.token
      const fd = new FormData()
      fd.append('image', this.file, this.file.name)
      axios.put(`http://localhost:3000/api/user/profile/${this.$store.state.user.userId}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).then((response) => {
        console.log('SUCCES !!', response.data.avatarUrl)
        this.$emit('newavatar', response.data.avatarUrl)        
      }).catch((error) => console.log('ECHEC !!', error))
    }
  }
}
</script>
