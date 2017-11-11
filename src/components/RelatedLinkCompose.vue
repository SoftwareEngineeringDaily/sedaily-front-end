<template>
  <div>
        <textarea placeholder='Add a related link...'
        class='related-link-box'
        :disabled="isSubmitting"
        name="url"
        v-validate="'required|url'"
        type='text'
        v-model='url' />
        <span v-if="isSubmitting">
          <spinner :show="true"></spinner>
        </span>
        <div v-else="isSubmitting">
          <button class='btn-success'
          :disabled="isSubmitting"
          @click.prevent='submit'>
          Add New Link
          </button>

          <div v-show="errors.has('url')"
          class="alert alert-danger">
          {{ errors.first('url') }}</div>
        </div>
  </div>
</template>

<script>
/* @flow */
import Spinner from './Spinner'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'related-link-compose',
  components: {
    Spinner
  },
  data () {
    return {
      url: '',
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
    ...mapActions(['relatedLinksCreate', 'relatedLinksFetch']),
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.isSubmitting = true
          this.relatedLinksCreate({
            postId: this.postId,
            url: this.url
          })
          .then((response) => {
            this.url = ''
            this.isSubmitting = false
            // Fetch comments
            this.relatedLinksFetch({
              postId: this.postId
            })
          })
          .catch((error) => {
            this.isSubmitting = false
            alert(error.response.data.message)
          })
        } else {
          alert('Sorry there was a problem :(')
        }
      })
    }
  }
}
</script>

<style scoped>
  .related-link-box {
    width: 100%;
    padding: 0px 5px;
    margin-bottom: 12px;
    border-radius: 2px;
    border-color: #c5c5c5;
  }
</style>
