<template>
  <div class="home">
    <PostInput @newPost="getNewPost"/>
    <div v-for="post in allPosts" :key="post.postId" class="post">
      <PostItem :post='post'/>
    </div>
  </div>
</template>

<script>
import PostInput from '@/components/PostInput.vue'
import PostItem from '@/components/PostItem.vue'
import axios from 'axios'
// @ is an alias to /src
export default {
  name: 'HomeView',
  components: {
    PostInput,
    PostItem
  },
  // emits: ['postMessage'],
  data: () => {
    return {
      user: {},
      allPosts: [{
        postId: '',
        avatar: '',
        pseudo: '',
        title: '',
        PJ: '',
        content: '',
        likes: Number
      }],
      likes: [],
      postId: null,
      comment: false,
      content: '',
      contentCom: '',
      comments: []
    }
  },
  methods: {
    getNewPost (value) {
      console.log(value)
      this.allPosts.unshift(value)
      this.avatar = this.$store.state.user.avatar
    }
  },
  mounted () {
    const token = this.$store.state.user.token
    if (token) {
      axios
        .get('http://localhost:3000/api/post/',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        ).then((res) => {
          console.log(res.data)
          this.allPosts = res.data.posts
        }).catch(err => console.log(err.message))
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 720px;
  margin: 0px auto;
  max-width: 100%;
  padding: 10px;
}
.post {
  //box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 5px;
  padding: 10px;
  max-width: 720px;
  margin: 20px 0px;
  background: white;
  color: #2c3e50;
    a{
      text-decoration: none;
      color: #2c3e50;
    }
}
@media (max-width: 768px) {
  .home {
    width: unset;
  }
}
</style>
