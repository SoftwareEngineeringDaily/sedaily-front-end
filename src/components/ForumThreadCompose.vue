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
      placeholder='The title of your post'
      class='forum-title-box'
      :disabled="isSubmitting"
      name="title"
      v-validate="'required'"
      type='text'
      v-model='title' />
    </div>
  </div>

  <div
    v-show="errors.has('title')"
    class="alert alert-danger">
    {{ errors.first('title') }}
  </div>

<div class="row">
  <div class="col-sm-8">
    <textarea placeholder='Your content here..'
    class='forum-content-box'
    :disabled="isSubmitting"
    type='text'
    name="content"
    v-validate="'required'"
    :value="content"
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
        <button class='button-submit'
        :disabled="isSubmitting"
        @click='submit'>Submit Post</button>
      </span>
    </span>
    <transition name="fade">
      <span class='preview-hint' v-if="shouldShowPreview">
        See preview below
      </span>
    </transition>
  </div>
</div>

<br>
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
    Spinner, ForumThreadBody
  },
  data () {
    return {
      title: '',
      content: '',
      errorMsg: null,
      isSubmitting: false,
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
  padding-left 20px
  color #8c8c8c
  font-family Roboto-Italic

.forum-title-box
  width 100%
  padding 10px
  margin-bottom 12px
  border none
  border-bottom 1px solid #ccc

.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
