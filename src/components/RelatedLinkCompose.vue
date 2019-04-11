<template>
  <div>
    <button v-if="!showModal" class='button-related' id="show-modal" @click="showModal = true">+ Add New Link</button>
    <button v-else class='button-related' id="show-modal" @click="showModal = false">+ Add New Link</button>
    <div v-if="showModal" @close="showModal = false">
      <textarea
        placeholder='Add a related link...'
        class='related-link-box'
        :disabled="isSubmitting"
        name="url"
        v-validate="'required|url'"
        type='text'
        v-model='url' />

      <div
        v-show="errors.has('url')"
        class="alert alert-danger">
        {{ errors.first('url') }}</div>

      <input
        placeholder='Add a short title...'
        class='related-title-box'
        :disabled="isSubmitting"
        name="title"
        v-validate="'required'"
        type='text'
        v-model='title' />

      <div
        v-show="errors.has('title')"
        class="alert alert-danger">
        {{ errors.first('title') }}</div>

      <span v-if="isSubmitting">
        <spinner :show="true" />
      </span>

      <div v-else>
        <button
          class='button-submit'
          :disabled="isSubmitting"
          @click.prevent='submit'>Submit</button>
      </div>
    </div>
  </div>
</template>
<script>
import Spinner from 'components/Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'related-link-compose',
  components: {
    Spinner
  },
  data () {
    return {
      url: '',
      showModal: false,
      title: '',
      isSubmitting: false,
      loading: true
    }
  },

  computed: {
    // local computed methods +
    ...mapState({
      me (state) {
        return state.me
      },
      postId (state) {
        return state.route.params.id
      }
    })
  },
  methods: {
    ...mapActions([
      'relatedLinksCreate',
      'relatedLinksFetch'
    ]),
    submit () {
      return this.$validator.validateAll().then((result) => {
        if (result) {
          this.isSubmitting = true
          this.relatedLinksCreate({
            postId: this.postId,
            title: this.title,
            url: this.url
          })
            .then((response) => {
              this.url = ''
              this.title = ''
              this.isSubmitting = false
              // Fetch comments
              this.relatedLinksFetch({
                postId: this.postId
              })
            })
            .catch((error) => {
              this.isSubmitting = false
              this.$toasted.error(error.response.data.message, { 
                  singleton: true,
                  theme: "bubble", 
                  position: "bottom-center", 
                  duration : 700
              })
            })
        } else {
          this.$toasted.error('Sorry there was a problem :(', { 
              singleton: true,
              theme: "bubble", 
              position: "bottom-center", 
              duration : 700
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'
.button-submit
  float right
.related-link-box
  width 100%
  padding 10px
  margin-bottom 12px
  border-radius 4px
  border-color #c4c4c4
.button-related
  background none
  border none
  font-size 1rem
  font-weight 600
  color primary-color
  margin 15px 0
  outline none
  cursor pointer
.related-title-box
  width 100%
  padding 10px
  margin-bottom 12px
  border 1px solid
  border-radius 4px
  border-color #c4c4c4
</style>
