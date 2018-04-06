<template>
  <div>
    <div class='forum-thread-title'>Edit Forum Post</div>
    <br />
    <forum-thread-compose
      :editing ="true"
      :submitCallback="submitCallback"
      :initialTitle="title"
      :initialContent="content"
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
      isSubmitting: false,
      title: '',
      content: ''
    }
  },
  created () {
    console.log('Editing thread', this.threadId)

    this.isLoading = true
    this.fetchForumThread({
      id: this.threadId
    })
    .then(({ forumThread }) => {
      console.log('thread', forumThread)
      this.title = forumThread.title
      this.content = forumThread.content
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
      'fetchForumThread'
    ]),
    submitCallback () {
      console.log('submit cb')
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
