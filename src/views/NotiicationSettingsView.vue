<template>
  <div>
    <h3> Turn off your notifications: </h3>

    <br />

    <label class="form-check-label">
      <input
      class="form-check-input"
      type="checkbox"
      name="subscribedFromThreads"
      v-model="subscribedFromThreads"
      >
      Get emails when people reply to my threads
    </label>
    <br />
    <br />

    <label class="form-check-label">
      <input
      class="form-check-input"
      type="checkbox"
      name="subscribedFromCommentReplies"
      v-model="subscribedFromCommentReplies"
      >
      Get emails when people reply to my comments
    </label>

  </div>
</template>
<script>
import Spinner from '@/components/Spinner'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'notiication-settings',
  data () {
    return {
      loading: true,
      subscribedFromThreads: true,
      subscribedFromCommentReplies: true
    }
  },
  beforeMount () {
    this.subscribedFromThreads = !this.unsubscribedFromThreads
    this.subscribedFromCommentReplies = !this.unsubscribedFromCommentReplies
  },
  methods: {
    ...mapActions(['updateEmailNotiicationSettings'])
  },
  computed: {
    ...mapState({

      unsubscribedFromThreads (state) {
        if (!state.me.emailNotiicationSettings) {
          return false
        }
        return state.me.emailNotiicationSettings.unsubscribedFromThreads
      },
      unsubscribedFromCommentReplies (state) {
        if (!state.me.emailNotiicationSettings) {
          return false
        }
        return state.me.emailNotiicationSettings.unsubscribedFromCommentReplies

      }
    })
  }
}
</script>
