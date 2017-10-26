<template>
    <div v-if='this.displayedPosts.length === 0' class='alert alert-info'>
      We are building recommendations for you. Please ensure you are logged in and
      have voted on podcasts :D
    </div>
</template>


<script>
export default {
  props: ['displayedPosts']
}
</script>

<style>
</style>
