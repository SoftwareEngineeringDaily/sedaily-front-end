<template>
  <div>
    <div class="row">
      <div
        v-if="errorMsg"
        class="col-12 alert alert-danger">
        {{ errorMsg }}
      </div>
    </div>

    <div class="row">
      <div class="col-sm-8">
        <input
          v-validate="'required'"
          v-model='title'
          :disabled="isSubmitting"
          data-vv-validate-on="input"
          placeholder='The title of your post'
          class='forum-title-box'
          name="title"
          type='text' />
      </div>
    </div>

    <div
      v-show="errors.has('title')"
      class="alert alert-danger">
      {{ errors.first('title') }}
    </div>

    <div class="row">
      <div class="col-sm-8">
        <textarea
          v-validate="'required'"
          :disabled="isSubmitting"
          :value="content"
          data-vv-validate-on="input"
          placeholder='Your content here..'
          class='forum-content-box'
          type='text'
          name="content"
          @input="update" />
      </div>
    </div>

    <div
      v-show="errors.has('content')"
      class="alert alert-danger">
      {{ errors.first('content') }}
    </div>

    <div class="row">
      <div class='col-sm-12'>
        <span>
          <div v-if="isSubmitting">
            <spinner :show="true"></spinner>
          </div>
          <span v-else>
            <button
              :disabled="isSubmitting"
              class='button-submit'
              @click='submit'>Submit Post</button>
          </span>
        </span>

        <img
          class='markdown-icon'
          v-if="!shouldShowMarkDownHelp"
          src="@/assets/icons/Aa.png"
          @click='toggleMarkdownHelp'
          alt='Markdown Info'>

        <img
          class='markdown-icon'
          v-else
          src="@/assets/icons/x.png"
          @click='toggleMarkdownHelp'
          alt='Markdown Info'>

        <transition name="fade">
          <span class='preview-hint' v-if="shouldShowPreview">
            See preview below
          </span>
        </transition>
      </div>
    </div>

    <br>
    <div class="row" v-if="shouldShowMarkDownHelp">
      <div class="col-md-8 markdown-info">
        <h2> Markdown Info </h2>
        <ul>
          <li> New lines are honored. </li>
          <li> URSL are auto detected and become clickable. They need http(s). </li>
        </ul>
      </div>
    </div>
    <br>
    <transition name="fade">
      <div class="row"  v-if="shouldShowPreview">
        <div class="col-sm-12">
          <forum-thread-body
          :title="title"
          :content="content"></forum-thread-body>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Spinner from 'components/Spinner'
import ForumThreadBody from '@/components/ForumThreadBody.vue'
import { debounce } from 'lodash'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'forum-thread-compose',
  components: {
    Spinner,
    ForumThreadBody
  },
  data () {
    return {
      title: '',
      content: '',
      errorMsg: null,
      isSubmitting: false,
      shouldShowMarkDownHelp: false,
      loading: true
    }
  },

  computed: {
    // local computed methods +
    ...mapState({
      me (state) {
        return state.me
      }
    }),

    shouldShowPreview () {
      return this.title.length > 0 || this.content.length > 0
    }
  },
  methods: {
    ...mapActions([
      'forumThreadCreate',
      'fetchForumThreads'
    ]),

    toggleMarkdownHelp () {
      this.shouldShowMarkDownHelp = !this.shouldShowMarkDownHelp
    },

    update: debounce(function (e) {
      this.content = e.target.value
    }, 200),
    submit () {
      this.errorMsg = null
      return this.$validator.validateAll().then((result) => {
        if (result) {
          this.isSubmitting = true
          this.forumThreadCreate({
            title: this.title,
            content: this.content
          })
            .then((response) => {
              this.content = ''
              this.title = ''
              this.isSubmitting = false
              this.$router.replace('/forum')
            })
            .catch((error) => {
              this.errorMsg = `Sorry were errors submitting :(: ${error.response.data.message}`
              this.isSubmitting = false
              this.$toasted.error(error.response.data.message)
            })
        } else {
          this.errorMsg = 'Sorry there are invalid fields on the form :('
        }
      })
    }
  }
}
</script>


<style scoped lang="stylus">
@import './../css/variables'

.forum-content-box
  width 100%
  padding 20px 10px
  margin-bottom 12px
  border-radius 4px
  border 1px solid #c5c5c5
  min-height 200px

.button-submit
  border 0

.preview-hint
  padding-top 10px
  padding-left 5px
  color #8c8c8c
  font-family Roboto-Italic

.forum-title-box
  width 100%
  padding 10px
  margin-bottom 12px
  border none
  border-bottom 1px solid #ccc

.markdown-icon
  max-width 15px
  margin 5px 20px
  cursor pointer
.markdown-info
  background #F9F9F9
  padding 20px
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
