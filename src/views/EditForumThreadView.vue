<template>
  <div>
    <div class='forum-thread-title'>Edit Forum Post</div>
    <br />
    <div v-if="content != null">

      <forum-thread-compose
      :editing="true"
      :submitButtonText="'Edit Thread'"
      :submitCallback="submitCallback"
      :initialTitle="title"
      :initialContent="content"
      :loading="loading"
      :isSubmitting="isSubmitting"
      >
    </forum-thread-compose>
  </div>
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
      isSubmitting: false,
      title: null,
      content: null
    }
  },
  created () {

    this.isLoading = true
    this.fetchForumThread({
      id: this.threadId
    })
    .then(({ forumThread }) => {
      console.log('thread', forumThread)
      this.content = forumThread.content
      this.title = forumThread.title
    })
    .finally(() => {
      this.loading = false
    })
  },
  computed: {
    threadId (state) {
      return state.$route.params.id
    }
  },
  methods: {
    ...mapActions([
      'fetchForumThread',
      'forumThreadEdit'
    ]),
    submitCallback ({content, title}) {
      console.log('submit cb')
      this.forumThreadEdit({
        content,
        title,
        id: this.threadId
      }).then(() => {
        this.isSubmitting = false
        this.$router.replace(`/forum/${this.threadId}`)
      }).catch((error) => {
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
