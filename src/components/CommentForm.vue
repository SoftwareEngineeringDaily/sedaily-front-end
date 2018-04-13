
<template>
  <div v-if="me">
    <textarea placeholder='Your comment here...'
      class='comment-box'
      ref='content'
      :disabled="isSubmitting"
      type='text'
      v-model='commentContent' />

    <at :members="members">
      <div contenteditable></div>
    </at>

    <input ref="autocomplete" v-model="autocomplete"/>

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
import At from 'vue-at'
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
    At,
    Spinner
  },
  data () {
    return {
      autocomplete: '@',
      members: ['Roxie Miles', 'grace.carroll', '小浩'],
      mentionsMatches: [],
      commentContent: this.content
    }
  },
  mounted() {
    // this.$refs.content.focus()
  },
  watch: {
    commentContent: function() {
      // If @ is preceded by space  then:
      /*
      if (this.commentContent.indexOf('@') > 0) {
        this.autocomplete = '@'
        this.mentionsMatches = []
        this.$refs.autocomplete.focus()

      }*/
    },
    autocomplete: debounce(function() {
      const name = this.autocomplete.substr(1)
      this.searchUsers({name}).then((users) => {
        console.log('autocomplete', this.autocomplete)
        console.log('results', users)
        this.mentionsMatches = users;
      })

    }, 80),
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
