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
  props: {
    postId: {
      type: String,
      required: true
    }
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
    ...mapState({
      me ({ auth }) {
        return auth ? auth.user : null
      }
    })
  },
  methods: {
    async submit () {
      const valid = await this.$validator.validateAll()
      if (valid) {
        this.isSubmitting = true

        try {
          const options = {
            url: this.url,
            title: this.title
          }

          const requestUrl = `/posts/${this.postId}/related-link`
          await this.$axios.post(requestUrl, options)

          this.$emit('relatedLinkCreated')
        } finally {
          this.isSubmitting = false
        }
      } else {
        this.$toast.error('Sorry there was a problem :(')
      }
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
