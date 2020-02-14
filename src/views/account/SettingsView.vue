<template>
  <div class='container settings-view'>
    <div class='center-settings'>
    <div class='row'>
    <h3 class=''>Notifications settings: </h3>
    </div>

    <br />
    <div class='row'>

      <label class="container mobile-fix">
        <input
        class="form-check-input"
        type="checkbox"
        name="subscribedFromThreads"
        v-model="subscribedFromThreads"
        >
        <span class="space-text-input">Get emails when people reply to my threads</span>  
        <span class="checkmark"></span>
      </label>
    </div>
    <br />
    <div class='row'>
      <label class="container mobile-fix">
        <input
        class="form-check-input"
        type="checkbox"
        name="subscribedFromCommentReplies"
        v-model="subscribedFromCommentReplies"
        >
        <span class="space-text-input">Get emails when people reply to my comments</span> 
        <span class="checkmark"></span>
      </label>
    </div>

    <br />
    <div class='row'>
      <label class="container mobile-fix">
        <input
        class="form-check-input"
        type="checkbox"
        name="subscribedFromMentions"
        v-model="subscribedFromMentions"
        >
        <span class="space-text-input">Get emails when people mention you in comments</span>
        <span class="checkmark"></span>
      </label>
    </div>

    <br />
    <div class='row'>
      <button @click='save' class='button-submit'> Save </button>
    </div>
    <div class='row'>
      {{msg}}
    </div>

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
      subscribedFromMentions: true,
      subscribedFromCommentReplies: true,
      msg: ''
    }
  },
  beforeMount () {
    // TOOD: fix this, not usually needed.
    this.fetchMyProfileData().then(() => {
      this.subscribedFromThreads = !this.unsubscribedFromThreads
      this.subscribedFromCommentReplies = !this.unsubscribedFromCommentReplies
      this.subscribedFromMentions = !this.unsubscribedFromMentions
    })
  },
  methods: {
    ...mapActions(['updateEmailNotiicationSettings', 'fetchMyProfileData']),
    save () {
      this.updateEmailNotiicationSettings({ emailNotificationSettings: {
        unsubscribedFromThreads: !this.subscribedFromThreads,
        unsubscribedFromMentions: !this.subscribedFromMentions,
        unsubscribedFromCommentReplies: !this.subscribedFromCommentReplies
      }}).then( () => {
        this.msg = 'Succesfully updated your emailsettings.'
      })

    }
  },
  computed: {
    ...mapState({

      unsubscribedFromThreads (state) {
        if (!state.me.emailNotiicationSettings) {
          return false
        }
        return state.me.emailNotiicationSettings.unsubscribedFromThreads
      },

      unsubscribedFromMentions (state) {
        if (!state.me.emailNotiicationSettings) {
          return false
        }
        return state.me.emailNotiicationSettings.unsubscribedFromMentions
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

<style scoped lang="stylus">
@import '../../css/variables'

.container
  input
    position absolute
    opacity 0
    cursor pointer
    height 0
    width 0
  .checkmark
    position absolute
    left 0
    height 20px
    width 20px
    background-color #eee
.container:hover input ~ .checkmark
  background-color #ccc
.container input:checked ~ .checkmark
  background-color primary-color
.checkmark:after
  content ""
  position absolute
  display none
.container input:checked ~ .checkmark:after
  display block
.container .checkmark:after
  left 7px
  top 3px
  width 6px
  height 12px
  border 2px solid white
  border-width 0 3px 3px 0
  -webkit-transform rotate(45deg)
  -ms-transform rotate(45deg)
  transform rotate(45deg)

.center-settings
  position relative
  padding 0 10px 
  margin 0 auto
  width 50%

.space-text-input
  padding-left 6%

@media (max-width: 850px)
  .center-settings
    width 80%
  .space-text-input
    padding-left 0
    word-wrap break-word
  .mobile-fix
    display flex 
    padding-left 10% !important
</style>