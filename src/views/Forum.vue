<template>
  <div>
    <h1> Forum </h1>
  </div>
</template>

<script>
import ForumThreadSummary from '@/components/ForumThreadSummary'
export default {
  name: 'forum',
  components: {
    ForumThreadSummary
  },
  data () {
    return {
      loading: true
    }
  }
}

</script>

<style scoped lang="stylus">
</style>
