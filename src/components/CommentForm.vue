
<template>
  <div v-if="me">

    <vue-tribute :options="options"
    @tribute-replaced="tributeReplaced"
    @tribute-no-match="tributeNoMatch"
    >
    <textarea placeholder='Your comment here...'
    class='comment-box'
    ref='contentTextarea'
    :disabled="isSubmitting"
    type='text'
    v-model='commentContent' />
  </vue-tribute>

  <div v-if="hasMentions">
    <h3> Mentions </h3>
  </div>
  <div v-for="user in mentionedUsers" :key="user._id">
    <profile-label :userData="user">
    </profile-label>
  </div>


    <div v-if="isSubmitting">
      <spinner :show="true"></spinner>
    </div>
    <div v-else>
      <button class='button-submit'
        :disabled="isSubmitting"
        @click='submitComment'>{{submitButtonText}}</button>

      <button v-if="showCancel" class='btn btn-link'
        :disabled="isSubmitting"
        @click='cancelPressed'>Cancel</button>
    </div>
  </div>
</template>

<script>
import VueTribute from '@/components/VueTribute.js'
import ProfileLabel from '@/components/ProfileLabel'
import { debounce, each, map } from 'lodash'
import Spinner from 'components/Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'comment-form',
  props: {
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
          // console.log('tempalte select', item.original.user)
          const img = item.original.user.avatarUrl ? item.original.user.avatarUrl : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
          return `<span><img width="30px" src='${img}'/> ${item.original.value} </span>`
        },
        noMatchTemplate: '',
        allowSpaces: true,
        values: [
        ]
      },
      mentionedUsers: [],
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
    ...mapState({
      me (state) {
        return state.me
      }
    }),
    hasMentions () {
      return this.mentionedUsers.length > 0
    }
  },
  methods: {
    ...mapActions(['searchUsers']),
    handleSelectUser (user) {
      console.log('user?', user)
      this.mentionedUsers.push(user)
    },
    tributeReplaced ({detail}) {
      const {user} = detail.item.original

      // todo: TRY: catch
      // V-model gets out of sync when new element is inserted so updating it:
      this.commentContent = this.$refs.contentTextarea.value
      this.handleSelectUser(user)
    },
    tributeNoMatch: debounce(function (searchQuery)  {
      console.log("tributeNoMatch", searchQuery)
      this.searchUsers({name: searchQuery})
        .then((users) => {
          console.log('users found', users)
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
       console.log('clear list', this.options.values)
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

.comment-box
  width 100%
  padding 20px 10px
  margin-bottom 12px
  border-radius 4px
  border-color #c5c5c5
</style>
