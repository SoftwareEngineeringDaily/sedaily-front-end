<template>
  <div>
    <form @submit.prevent="submit">
      <div class="related-link-box">
        <input
          type="text"
          :placeholder="placeholder"
          :disabled="isSubmitting"
          name="url"
          v-model="url" />

        <span
          v-if="isSubmitting"
          class="related-spinner">
          <spinner :show="true" />
        </span>
      </div>

      <div
        v-show="errors.has('url')"
        class="alert alert-danger">
        {{ errors.first('url') }}</div>
    </form>
  </div>
</template>
<script>
import Spinner from '@/components/Spinner'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'related-link-compose',
  components: {
    Spinner
  },

  props: {
    type: {
      type: String,
      default: 'link',
    },
    
    rootEntityType: {
      type: String,
      default: 'post'
    },
  },

  data () {
    return {
      url: '',
      showModal: false,
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
      },
      topicSlug (state) {
        return state.route.params.slug
      },
      placeholder () {
        return `Add a related ${this.type || 'link'}`
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
          const data = {
            type: this.type,
            url: this.url,
          }

          if (this.rootEntityType === 'post') { data.postId = this.postId }
          if (this.rootEntityType === 'topic') { data.topicSlug = this.topicSlug }

          this.relatedLinksCreate(data)
          .then((response) => {
            this.url = ''
            this.isSubmitting = false
            this.showModal = false

            // Fetch comments
            this.relatedLinksFetch(data)
          })
          .catch((error) => {
            this.isSubmitting = false
            this.$toasted.error(error.response.data.message, {
                singleton: true,
                theme: 'bubble',
                position: 'bottom-center',
                duration : 700
            })
          })
        } else {
          this.$toasted.error('Sorry there was a problem :(', {
              singleton: true,
              theme: 'bubble',
              position: 'bottom-center',
              duration : 700
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../css/variables'
.related-actions
  text-align right

.related-link-box
  position relative
  margin 20px 0 0

  input
    width 100%
    padding 8px 10px
    border-radius 4px
    outline none
    border none
    &:focus
      box-shadow 0 0 3px 3px rgba(#a591ff, 0.4)

  .related-spinner
    position absolute
    top 50%
    right 0
    transform translateY(-50%) scale(0.5)

.button-related
  background none
  border none
  font-size 0.8rem
  font-weight 700
  color primary-color
  margin 15px 0 0
  padding-right 0
  outline none
  cursor pointer

.related-title-box
  width 100%
  padding 8px
  margin-bottom 12px
  border 1px solid
  border-radius 4px
  border-color #c4c4c4
</style>
