<template>
  <div>
        <textarea placeholder='Add a related link...'
        class='related-link-box'
        :disabled="isSubmitting"
        name="url"
        v-validate="'required|url'"
        type='text'
        v-model='url' />
        <div v-show="errors.has('url')"
        class="alert alert-danger">
        {{ errors.first('url') }}</div>

        <input placeholder='Add a short title...'
        class='related-title-box'
        :disabled="isSubmitting"
        name="title"
        v-validate="'required'"
        type='text'
        v-model='title' />
        <div v-show="errors.has('title')"
        class="alert alert-danger">
        {{ errors.first('title') }}</div>

        <span v-if="isSubmitting">
          <spinner :show="true"></spinner>
        </span>
        <div v-else="isSubmitting">
          <button class='button-submit'
          :disabled="isSubmitting"
          @click.prevent='submit'>
          Add New Link
          </button>

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
    ...mapActions(['relatedLinksCreate', 'relatedLinksFetch']),
    submit () {
      this.$validator.validateAll().then((result) => {
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
            this.$nextTick(() => {
              this.errors.clear()
            })
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
    padding: 10px;
    margin-bottom: 12px;
    border-radius: 4px;
    border-color: #c5c5c5;
  }

  .related-title-box {
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    border: none;
    border-bottom: 1px solid #ccc;
  }

</style>
