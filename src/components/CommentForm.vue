
<template>
  <div v-if="me">

    <div class="container">
      <h1>vue-tribute Demo</h1>
      <h3>Simple text input</h3>
      <vue-tribute :options="options"
      >
        <input type="text" placeholder="@...">
      </vue-tribute>
      <br />
      <h3>Textarea</h3>
      <vue-tribute :options="options"

        @tribute-replaced="tributeReplaced"
        v-on:tribute-replaced="tributeReplaced"
        @tribute-no-match="tributeNoMatch"
        v-on:tribute-no-match="tributeNoMatch()"
      >
        <textarea placeholder="@..."></textarea>
      </vue-tribute>
      <br />
      <h3>contenteditable element</h3>
      <vue-tribute :options="options">
        <div class="content-editable" contenteditable="true" placeholder="@..."></div>
      </vue-tribute>
      <br />
      <button @click="append" class="btn">Append New Item</button>
    </div>




    <textarea placeholder='Your comment here...'
    class='comment-box'
    ref='content'
    :disabled="isSubmitting"
    type='text'
    v-model='commentContent' />



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
      autocomplete: '@',
      options: {
        values: [
          { key: 'Collin Henderson', value: 'syropian' },
          { key: 'Sarah Drasner', value: 'sarah_edo' },
          { key: 'Evan You', value: 'youyuxi' },
          { key: 'Adam Wathan', value: 'adamwathan' }
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
      console.log('atList', this.atList)
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
    handleSelectUser (user) {
      console.log('user?', user)
    },
    tributeReplaced (e) {
      console.log('tributeReplaced', e)
    },
    tributeNoMatch (e) {
      console.log("tributeNoMatch", e)
    },
    append() {
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
