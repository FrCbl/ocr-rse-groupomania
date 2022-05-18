<template>
  <div v-for="post in allPosts" :key="post.postId" class="post">
    <PostItem :post='post'/>
  </div>
</template>

<script>
import PostItem from '@/components/PostItem.vue'

export default {
  props: ['allPosts', 'post'],
  components: {
    PostItem
  },
  data: () => {
    return {}
  },
  mounted: () => {
    console.log('PostList mounted')
  }
}
</script>

<style lang="scss" scoped>

</style>
