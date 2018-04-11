<template>
  <div class='container'>
    <div class='row'>
    <h3 class='col-md-12'> Turn off your notifications: </h3>
    </div>

    <br />
    <div class='row'>

      <label class="col-md-8 form-check-label">
        <input
        class="form-check-input"
        type="checkbox"
        name="subscribedFromThreads"
        v-model="subscribedFromThreads"
        >
        Get emails when people reply to my threads
      </label>
    </div>
    <br />
    <div class='row'>
      <label class="col-md-8 form-check-label">
        <input
        class="form-check-input"
        type="checkbox"
        name="subscribedFromCommentReplies"
        v-model="subscribedFromCommentReplies"
        >
        Get emails when people reply to my comments
      </label>
    </div>
    <br />
    <div class='row'>
      <button @click='save' class='btn btn-success'> Save </button>
    </div>
    <div class='row'>
      {{msg}}
    </div>

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
      subscribedFromCommentReplies: true,
      msg: ''
    }
  },
  beforeMount () {
    // TOOD: fix this, not usually needed.
    this.fetchMyProfileData().then(() => {
      this.subscribedFromThreads = !this.unsubscribedFromThreads
      this.subscribedFromCommentReplies = !this.unsubscribedFromCommentReplies
    })
  },
  methods: {
    ...mapActions(['updateEmailNotiicationSettings', 'fetchMyProfileData']),
    save () {
      this.updateEmailNotiicationSettings({ emailNotificationSettings: {
        unsubscribedFromThreads: !this.subscribedFromThreads,
        unsubscribedFromCommentReplies: !this.subscribedFromCommentReplies
      }}).then( () => {
        this.msg = 'Succesfully updated your emailsettings.'
      })

    }
  },
  computed: {
    ...mapState({

      unsubscribedFromThreads (state) {
        console.log('-------**state', state.me.emailNotiicationSettings)
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
