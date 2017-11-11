<template>
  <div>
        <textarea placeholder='Add a related link...'
        :disabled="isSubmitting"
        type='text'
        v-model='url' />
        <div v-if="isSubmitting">
          <spinner :show="true"></spinner>
        </div>
        <div v-else="isSubmitting">
          <button class='btn-success'
          :disabled="isSubmitting"
          @click='submit'>
          Add Related Link
          </button>
        </div>
  </div>
</template>

<script>
/* @flow */
import UpdateProfile from './UpdateProfile.vue'
import Spinner from './Spinner'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'related-link-compose',
  components: {
    UpdateProfile,
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
    }
  }
}
</script>

<style scoped>
  .related-link-box {
    width: 100%;
    padding: 20px 10px;
    margin-bottom: 12px;
    border-radius: 7px;
    border-color: #c5c5c5;
  }
</style>
