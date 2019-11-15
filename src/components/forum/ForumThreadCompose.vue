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
          data-vv-delay="100"
          data-vv-validate-on="input"
          placeholder='The title of your post'
          class='forum-title-box'
          name="title"
          type='text' />
      </div>
    </div>

    <div class="row">
      <div class="col-sm-8 alert alert-danger"
        v-show="errors.has('title')">
        {{ errors.first('title') }}
      </div>
    </div>

    <div class="row">
      <div class="col-sm-8">
        <textarea
          v-validate="'required'"
          :disabled="isSubmitting"
          data-vv-validate-on="input"
          placeholder='Your content here..'
          class='forum-content-box'
          type='text'
          v-model='content'
          name="content"
          @input="update" />
      </div>
    </div>

    <div class="row">
      <div class="col-sm-8 alert alert-danger"
        v-show="errors.has('content')">
        {{ errors.first('content') }}
      </div>
    </div>

    <div class="row">
      <div class='col-sm-12'>
        <span>
          <div v-if="isSubmitting">
            <spinner :show="true"></spinner>
          </div>
          <span v-else>
            <form v-on:submit.prevent="checkIfRecaptchaVerified">
              <vue-recaptcha @verify="markRecaptchaAsVerified" sitekey="6LdFYXEUAAAAACdpxlLQNTNeowenA_04MhDxcNlM"></vue-recaptcha>
              <div class="row">
                <div class="col-sm-8 alert alert-danger"
                  v-show="(this.threadForm.recaptchaVerified === false)">
                  The recaptcha field is required.
                </div>
              </div>
            <button
              :disabled="isSubmitting"
              class='button-submit'
              @click='submit'>{{submitButtonText}}</button>
            </form>
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
          <li> URLS are auto detected and become clickable. They need http(s). </li>
        </ul>
      </div>
    </div>
    <br>
    <transition name="fade">
      <div class="row"  v-if="shouldShowPreview">
        <div class="col-sm-12">
          <forum-thread-body
            :title="title"
            :content="content" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import ForumThreadBody from '@/components/forum/ForumThreadBody'
import { debounce } from 'lodash'
import { mapState, mapActions } from 'vuex'
import VueRecaptcha from 'vue-recaptcha';
export default {
  name: 'forum-thread-compose',
  props: {
    editing: {
        type: Boolean,
        default: false
    },
    submitCallback: {
      type: Function,
      required: true
    },
    submitButtonText: {
      type: String,
      default: 'Create Thread'
    },
    initialTitle: {
      type: String,
      default: ''
    },
    initialContent: {
      type: String,
      default: ``
    },
    loading: {
      type: Boolean,
      default: false
    },
    isSubmitting: {
      type: Boolean,
      default: false
    },
    initialErrorMsg: {
      type: String,
      default: null
    }
  },
  components: {
    Spinner,
    ForumThreadBody,
    VueRecaptcha
  },
  data () {
    return {
      title: this.initialTitle,
      content: this.initialContent,
      errorMsg: this.initialErrorMsg,
      shouldShowMarkDownHelp: false,
      threadForm: {
        recaptchaVerified: null
      },
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
    toggleMarkdownHelp () {
      this.shouldShowMarkDownHelp = !this.shouldShowMarkDownHelp

      this.$ga.event({
        eventCategory: 'forum',
        eventAction: 'Toggle markdown help',
        eventLabel: `shouldShowMarkDownHelp ${this.shouldShowMarkDownHelp}`
      })
    },

    update: debounce(function (e) {
      this.content = e.target.value
    }, 200),
    submit () {
      this.errorMsg = null
      return this.$validator.validateAll().then((result) => {
        const recaptchaResponse = grecaptcha.getResponse();
        if (result && this.threadForm.recaptchaVerified === true) {
          this.$store.dispatch('verifyRecaptcha', {
            recaptchaResponse
          })
            .then((response) => {
              this.submitCallback({
                title: this.title,
                content: this.content
              })
            })
            .catch(() => {
              this.$toasted.error('There was an error with your recaptcha submission.')
            })
        } else {
          if (this.threadForm.recaptchaVerified === null) {
            this.threadForm.recaptchaVerified = false;
          }
          this.errorMsg = 'Sorry there are invalid fields on the form :('
        }
      })
    },
    markRecaptchaAsVerified(response) {
      this.threadForm.recaptchaVerified = true;
    },
    checkIfRecaptchaVerified() {
      if (!this.threadForm.recaptchaVerified) {
        return true;
      }
    }
  }
}
</script>


<style scoped lang="stylus">
@import './../../css/variables'

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
  font-style italic

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
