<template>
  <div class="related-container">
    <h6 class="section-title">Related Episodes</h6>
    <div class="episode-row" v-for="episode in relatedEpisodes" :key="episode._id">
      <router-link
        class="episode-link"        
        :to="{ name: 'Post', params: { id: episode._id, postTitle: episode.slug} }" >
        {{episode.title.rendered}}
      </router-link>
      <div class="col-remove">
        <button v-if="episode.userGenerated" @click="remove(episode)" class='button-delete'>
          <i class="fa fa-trash"/>
        </button>
      </div>
    </div>
    <div v-if="isLoggedIn" class="related-input">
      <spinner :show="savingRelatedEpisode"/>
      <SelectPostInput
        v-show="!savingRelatedEpisode"
        v-model="newRelatedEpisode"
        @onChange="onChangeRelatedEpisode"
        placeholder="Add a related episode" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectPostInput from '@/components/SelectPostInput'
import Spinner from '@/components/Spinner'

export default {
  name: 'related-episode-list',
  components: {
    SelectPostInput,
    Spinner
  },
  props: {
    post: {
      type: Object
    },
    relatedEpisodes: {
      type: Array
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  data () {
    return {
      username: null,
      savingRelatedEpisode: false,
      newRelatedEpisode: {}
    }
  },
  methods: {
    ...mapActions([
      'saveRelatedEpisode',
      'removeRelatedEpisode'
    ]),

    onChangeRelatedEpisode () {
      this.savingRelatedEpisode = true

      const options = {
        postId: this.post._id,
        episodeSlug: this.newRelatedEpisode.slug
      }

      this.saveRelatedEpisode(options).then(() => {
        this.$emit('onChange')
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.savingRelatedEpisode = false
        this.newRelatedEpisode = {}
      })
    },

    remove (episode) {
      this.savingRelatedEpisode = true

      const options = {
        postId: this.post._id,
        episodeSlug: episode.slug
      }

      this.removeRelatedEpisode(options).then(() => {
        this.$emit('onChange')
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.savingRelatedEpisode = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">
h6
  margin-bottom 5px

.section-title
  margin 0 0 10px
  font-size 0.8rem

.related-container
  margin 0 0 20px
  padding 1.5rem
  background #e9ecef

  .spinner
    margin 0 auto
    display block

  .episode-row
    display flex
    align-items start

  .episode-link
    flex 1
    display block
    margin-bottom 10px
    font-size 14px
    font-weight normal
    color #1a0dab
  
  .col-remove
    width 31px
    text-align right

    button
      background none
      outline none
      border none
      color #c4c4c4
      padding 0 5px
  
  .related-input
      margin-top 10px

      .spinner
        width 40px
        height 40px

      &>>> input
        outline none
        border 0
        font-size 14px

        &:focus
          outline none
          -webkit-box-shadow 0 0 3px 3px rgba(165,145,255,0.4)
          box-shadow 0 0 3px 3px rgba(165,145,255,0.4)

</style>
