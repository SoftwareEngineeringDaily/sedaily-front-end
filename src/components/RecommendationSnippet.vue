<template>
    <div v-if='this.displayedItems.length === 0' class='alert alert-info'>
      We are building recommendations for you. Please ensure you are logged in and
      have voted on podcasts :D
    </div>
</template>


<script>
export default {
  props: ['displayedItems']
}
</script>

<style>
</style>
