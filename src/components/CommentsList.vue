<template>
  <div>
    <div v-for="comment in comments"> Comment: {{comment.content}}  </div>
  </div>
</template>

<script>
export default {
  name: 'comments-list',
  props: ['comments']
}
</script>


<style>
</style>
