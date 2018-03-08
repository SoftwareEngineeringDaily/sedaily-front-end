<template>
  <div>
    <textarea
      v-validate="'required|url'"
      v-model="url"
      :disabled="isSubmitting"
      placeholder="Add a related link..."
      class="related-link-box"
      name="url"
      type="text" />
    <div
      v-show="errors.has('url')"
      class="alert alert-danger">
      {{ errors.first('url') }}</div>

    <input
      v-validate="'required'"
      v-model="title"
      :disabled="isSubmitting"
      placeholder="Add a short title..."
      class="related-title-box"
      name="title"
      type="text">

    <div
      v-show="errors.has('title')"
      class="alert alert-danger">
      {{ errors.first('title') }}</div>

    <span v-if="isSubmitting">
      <spinner :show="true" />
    </span>

    <div v-else>
      <button
        :disabled="isSubmitting"
        class="button-submit"
        @click.prevent="submit">Add New Link</button>
    </div>
  </div>
</template>

<script>
import Spinner from '~/components/Spinner'
import { mapState, mapActions } from 'vuex'

export default {
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
      me ({ auth }) {
        return auth ? auth.user : null
      }
    }),
    postId () {
      return this.$route.params.id
    }
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
              // Fetch comments
              this.relatedLinksFetch({
                postId: this.postId
              })
            })
            .finally(() => {
              this.isSubmitting = false
            })
        } else {
          this.$toast.error('Sorry there was a problem :(')
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.related-link-box
  width 100%
  padding 10px
  margin-bottom 12px
  border-radius 4px
  border-color #c5c5c5

.related-title-box
  width 100%
  padding 10px
  margin-bottom 12px
  border none
  border-bottom 1px solid #ccc
</style>
