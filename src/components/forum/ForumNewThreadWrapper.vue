<template>
  <div>
    <div class='forum-thread-title'>New Forum Post</div>
    <br />
    <forum-thread-compose
      :submitCallback="submitCallback"
      :initialContent="initialContent"
      :loading="loading"
      :isSubmitting="isSubmitting"
    >
    </forum-thread-compose>
  </div>
</template>

<script>
import ForumThreadCompose from '@/components/forum/ForumThreadCompose'
import { mapActions } from 'vuex'

export default {
  name: 'new-forum-thread-wrapper',
  props: {
    initialContent: {
      type: String,
      required: true
    }
  },

  beforeMount () {
    this.$ga.event({
      eventCategory: 'forum',
      eventAction: 'new thread form loaded',
      eventLabel: 'viewing /new-thread'
    })
  },
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
          this.$toasted.error(error.response.data.message, { 
              singleton: true,
              theme: "bubble", 
              position: "bottom-center", 
              duration : 700
          })
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variables'

.forum-thread-title
  font-size 2.6rem
  font-weight 200

</style>
