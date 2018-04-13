
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

  <button @click="append" class="btn btn-success">Append New Item</button>

    <div v-for="user in mentionsMatches" :key="user._id">
      <h3> {{user.name}} </h3>
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
import { debounce } from 'lodash'
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
    Spinner
  },
  data () {
    return {
      // Options for auto-complete mentions
      options: {
        menuItemTemplate: function (item) {
          console.log('tempalte select', item.original.user)
          const img = item.original.user.avatarUrl ? item.original.user.avatarUrl : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
          return `<span><img width="30px" src='${img}'/> ${item.original.value} </span>`
        },
        noMatchTemplate: '',
        allowSpaces: true,
        values: [
        ]
      },
      mentionsMatches: [],
      commentContent: this.content
    }
  },
  mounted() {
    // this.$refs.content.focus()
  },
  watch: {
    commentContent: function() {
      console.log('commentContent', this.commentContent)
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
    })
  },
  methods: {
    ...mapActions(['searchUsers']),
    handleSelectUser (user) {
      console.log('user?', user)
    },
    tributeReplaced (e) {
      console.log('tributeReplaced', e)
    },
    tributeNoMatch: debounce(function (searchQuery)  {
      console.log("tributeNoMatch", searchQuery)
      this.searchUsers({name: searchQuery})
        .then((users) => {
          console.log('users found', users)
          this.setUserList(users)
        })
    }, 100),

    // TODO: loop over and match. Start with longer matches
    // Search for [space]@_${value} so when we replace while we replace
    // with . What if mention is first character.
    setUserList (userList) {
       this.options.values.splice(0, this.options.values.length + 1)
       userList.forEach((user) => {
         this.options.values.push(
           { key: user.name, value: user.name, user }
         )
       })
       console.log('clear list', this.options.values)
    },

    append() {
      let self = this;
      console.log('model:', this.commentContent)
      console.log('textarea raw value:', this.$refs.contentTextarea.value)
      // this.$refs.inp.map( (m, k) => {
        // m.value = self.allItems[k].name
      // })

      let kv = Math.random()
      .toString(36)
      .slice(2)
      this.options.values.push({
        key: kv,
        value: kv
      })
    },
    submitComment () {
      console.log('this.entityId', this.entityId)
      this.submitCallback({
        content: this.commentContent
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
