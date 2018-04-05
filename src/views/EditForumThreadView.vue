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
  beforeMount () {
    this.isLoading = true
    this.fetchForumThread({
      id: this.entityId
    })
    .then((thread) => {
      console.log('thread', thread)
      this.title = thread.title
      this.content = thread.content
    })
    .finally(() => {
      this.loading = false
    })
  },
  computed: {
    entityId (state) {
      return state.route.params.id
    },
    threadId (state) {
      return state.route.params.id
    }
  },
  methods: {
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
