<template>
  <div>
    <div class='forum-thread-title'>New Forum Post</div>
    <br />
    <forum-thread-compose
      :submitCallback="submitCallback"
      :loading="loading"
      :isSubmitting="isSubmitting"
    >
    </forum-thread-compose>
  </div>
</template>

<script>
import ForumThreadCompose from '@/components/ForumThreadCompose.vue'
import { mapActions } from 'vuex'

export default {
  name: 'new-forum-thread-view',
  components: { ForumThreadCompose },
  data () {
    return {
      loading: true,
      isSubmitting: false
    }
  },
  methods: {
    ...mapActions([
      'forumThreadCreate'
    ]),

    submitCallback ({title, content}) {
      this.forumThreadCreate({
        title,
        content
      })
      .then((response) => {
        this.isSubmitting = false
        this.$router.replace('/forum')
      })
      .catch((error) => {
          this.isSubmitting = false
          this.$toasted.error(error.response.data.message)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../css/variables'

.forum-thread-title
  font-size 2.6rem
  font-weight 200

</style>
