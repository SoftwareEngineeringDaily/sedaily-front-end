<template>
  <div class="select-post">
    <ais-instant-search :search-client="algoliaSearchClient" v-bind:index-name="algoliaIndex">
      <ais-configure :hits-per-page.camel="6" />
      <ais-autocomplete>
        <div class="" slot-scope="{ currentRefinement, indices, refine }">
          
          <b-input
            autocomplete="off"
            type="search"
            :placeholder="placeholder"
            v-model="search"
            @input="val => { refine(val) }" />

          <div v-if="currentRefinement" class="options-panel">
            <ul v-for="index in indices" :key="index.label">
              <li v-for="hit in index.hits" :key="hit.objectID">
                <button @click="onClickPost(hit, refine)">
                  {{hit._title}}
                </button>
              </li>
            </ul>
          </div>

        </div>
      </ais-autocomplete>
    </ais-instant-search>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import algoliasearch from 'algoliasearch/lite';

export default {
  props: {
    value: {
      type: Object
    },
    placeholder: {
      type: String,
      default: 'Select a episode'
    }
  },
  data () {
    return {
      algoliaSearchClient: algoliasearch(
        process.env.ALGOLIA_APP_ID,
        process.env.ALGOLIA_API_KEY
      ),
      algoliaIndex: process.env.ALGOLIA_POSTS_INDEX,
      search: '',
    }
  },

  beforeMount () {
    if (this.value && this.value._id && this.value.title) {
      this.search = this.value.title.rendered
    }
  },

  watch: {
    value (newValue) {
      if (newValue && newValue._id && newValue.title) {
        this.search = newValue.title.rendered
      } else {
        this.search = ''
      }
    }
  },

  methods: {
    onClickPost (post, refine) {
      this.search = post.title.rendered
      refine('')
      this.$emit('input', post)
      this.$emit('onChange', post)
    }
  }
}
</script>

<style scoped lang="stylus">
  .select-post
    position relative

    .spinner
      margin 0 auto
      display block
      width 40px
      height 40px

    .options-panel
      background-color #f8f9fa
      position absolute
      top 42px
      width 100%
      z-index 10

      ul
        margin 0
        padding 0
        list-style none

        button
          background-color transparent
          width 100%
          min-height 60px
          text-align left
          font-size 14px
          border 0
          border-bottom 1px solid #edeaff
</style>
