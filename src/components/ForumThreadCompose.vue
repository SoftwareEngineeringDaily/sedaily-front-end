<template>
  <div>

    <div
      v-if="errorMsg"
      class="alert alert-danger">
      {{ errorMsg }}
    </div>

    <div>
      <input
      placeholder='Add a short title...'
      class='forum-title-box'
      :disabled="isSubmitting"
      name="title"
      v-validate="'required'"
      type='text'
      v-model='title' />
    </div>

    <div
      v-show="errors.has('title')"
      class="alert alert-danger">
      {{ errors.first('title') }}
    </div>

    <div>
      <textarea placeholder='Your content here..'
      class='forum-content-box'
      :disabled="isSubmitting"
      type='text'
      name="content"
      v-validate="'required'"
      v-model='content' />
    </div>

    <div
      v-show="errors.has('content')"
      class="alert alert-danger">
      {{ errors.first('content') }}
    </div>

    <div v-if="isSubmitting">
      <spinner :show="true"></spinner>
    </div>
    <div v-else>
      <button class='button-submit'
        :disabled="isSubmitting"
        @click='submit'>Create Forum Post</button>
    </div>
  </div>

</template>

<script>
import Spinner from 'components/Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'forum-thread-compose',
  components: {
    Spinner
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
    })
  },
  methods: {
    ...mapActions([
      'forumThreadCreate',
      'fetchForumThreads'
    ]),
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
              this.content = null
              this.title = null
              this.isSubmitting = false
              // Fetch comments
              this.fetchForumThreads({
              })
            })
            .catch((error) => {
              this.errorMsg = `Sorry were errors submitting :(: ${error.response.data.message}`
              this.isSubmitting = false
              this.$toasted.error(error.response.data.message)
            })
        } else {
          this.errorMsg = 'Sorry are invalid fields on the form :('
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
  border-color #c5c5c5


.forum-title-box
  width 100%
  padding 10px
  margin-bottom 12px
  border none
  border-bottom 1px solid #ccc


</style>
