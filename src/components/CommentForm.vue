
<template>
  <div v-if="me" class="comment-container">
    <span class="active-without-border" v-if="isLoggedIn">
      <router-link class="profile-img-link"
      to="/profile"><img class="profile-img" :src="avatarUrl" /></router-link>
    </span>
    <vue-tribute
    class="comment-box__container"
    :options="options"
    @tribute-replaced="tributeReplaced"
    @tribute-no-match="tributeNoMatch"
    >
    <input placeholder='Your comment here...'
    class='comment-box'
    ref='contentTextarea'
    :disabled="isSubmitting"
    type='text'
    v-model='commentContent' />
  </vue-tribute>

    <div v-if="isLoggedIn">
      <div v-if="isSubmitting">
        <spinner :show="true"></spinner>
      </div>
      <div class="buttons-comment" v-else>
        <button class='button-submit'
        :disabled="isSubmitting"
        @click='submitComment'>{{submitButtonText}}</button>

        <button v-if="showCancel" class='btn btn-link'
        :disabled="isSubmitting"
        @click='cancelPressed'><i class="fa fa-times"/></button>
      </div>
    </div>
    <div v-else>
      <router-link to="/login"><button class='button-submit'>{{submitButtonText}}</button></router-link>
    </div>
  </div>
</template>

<script>
import VueTribute from '@/components/VueTribute.js'
import ProfileLabel from '@/components/ProfileLabel'
import { debounce, each, map } from 'lodash'
import Spinner from 'components/Spinner'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'comment-form',
  props: {
    userData: {
      type: Object,
      default: function () {
        return {
          avatarUrl: '',
        }
      }
    },
    content: {
      type: String
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    cancelPressed: {
      type: Function
    },
    isSubmitting: {
      type: Boolean,
      required: true
    },
    submitCallback: {
      type: Function,
      required: true
    },
    existingMentions: {
      type: Array,
      default: () => { return []}
    },
    submitButtonText: {
      type: String,
      default: 'Add Comment'
    }
  },
  components: {
    VueTribute,
    ProfileLabel,
    Spinner
  },
  data () {
    return {
      // Options for auto-complete mentions
      options: {
        menuItemTemplate: function (item) {
          const img = item.original.user.avatarUrl ? item.original.user.avatarUrl : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
          return `<span><img width="30px" src='${img}'/> ${item.original.value} </span>`
        },
        noMatchTemplate: '',
        allowSpaces: true,
        values: [
        ]
      },
      mentionedUsers: this.existingMentions,
      commentContent: this.content
    }
  },
  mounted() {
    // this.$refs.content.focus()
  },
  watch: {
    commentContent: function() {
      // Check mentions
      const currentMentions = []
      each(this.mentionedUsers, (user) => {
        const mentionText = '@' + user.name
        if( this.commentContent.indexOf(mentionText) >= 0 ) {
          currentMentions.push(user)
        }
      })
      this.mentionedUsers = currentMentions
    },
    content: function() {
      this.commentContent = this.content
    }
  },

  computed: {
    // local computed methods +
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      me (state) {
        return state.me
      },
      alreadySubscribed (state) {
        if (!this.isLoggedIn) return false
        if (state.me && state.me.subscription && state.me.subscription.active) {
          return true
        } else {
          return false
        }
      },
      avatarUrl (state) {
        return this.me.avatarUrl || state.placeholderAvatar
      }
    }),
    hasMentions () {
      return this.mentionedUsers.length > 0
    }
  },
  methods: {
    ...mapActions(['searchUsers']),
    handleSelectUser (user) {
      // Check if contains user already to avoid duplicates.
      let containsUserAlready = false
      each(this.mentionedUsers, function(existingUser) {
        if (existingUser._id.toString() === user._id.toString() ){
          containsUserAlready = true
        }
      });
      if (!containsUserAlready) {
        this.mentionedUsers.push(user)
      }
    },
    tributeReplaced ({detail}) {
      const {user} = detail.item.original

      // todo: TRY: catch
      // V-model gets out of sync when new element is inserted so updating it:
      this.commentContent = this.$refs.contentTextarea.value
      this.handleSelectUser(user)
    },
    tributeNoMatch: debounce(function (searchQuery)  {
      this.searchUsers({name: searchQuery})
        .then((users) => {
          this.setUserList(users)
        })
    }, 10),

    // Remove dupes for now since we have a weird hack:
    alreadyContainsMention (user) {
      let contains = false
      each(this.options.values, (mention) => {
        if (user._id == mention.user._id) {
          contains = true
        }
      })
      return contains
    },
    // TODO: loop over and match. Start with longer matches
    // Search for [space]@_${value} so when we replace while we replace
    // with . What if mention is first character.
    setUserList (userList) {
       this.options.values.splice(0, 10)
       userList.forEach((user) => {
         if (!this.alreadyContainsMention(user)) {
           this.options.values.push(
             { key: user.name, value: user.name, user }
           )
         }
       })
    },

    submitComment () {
      const mentions = map(this.mentionedUsers, (user) => {
        return user._id
      })
      this.mentionedUsers = [] // resetting mentioned users
      this.submitCallback({
        content: this.commentContent,
        mentions: mentions
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'
.button-submit
  outline none
  a
    color white
    &:hover
      text-decoration none
.buttons-comment
  display flex
.comment-container
  display flex
  align-items center
  width: 125%;
  .profile-img
    width 35px
    height 35px
    border-radius 50px
.comment-box
  margin 0 10px
  width 100%
  padding 5px
  padding-left 10px
  border-radius 30px
  border-color #c5c5c5
  resize none
  height inherit
  outline none
  border: 1px solid #ccc;

.comment-box__container
  display flex
  width 100%
  ::-moz-placeholder  /* Mozilla Firefox 19+ */
    line-height:40px;

  ::-webkit-input-placeholder /* Webkit */
    line-height:40px;

  ::-ms-input-placeholder /* IE */
    line-height:40px;

</style>
