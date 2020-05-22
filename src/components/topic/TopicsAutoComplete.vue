<template>
  <multiselect
    v-model="selection"
    id="topics"
    label="name"
    track-by="_id"
    :placeholder="placeholder"
    open-direction="bottom"
    :options="topics"
    :multiple="multiple"
    :searchable="true"
    :loading="isLoading"
    :internal-search="false"
    :clear-on-select="false"
    :close-on-select="true"
    :options-limit="20"
    :limit-text="limitText"
    :max-height="300"
    :show-no-results="true"
    :hide-selected="true"
    @search-change="onSearch">

    <span slot="noResult">No topics found.</span>

  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'topics-auto-complete',

  components: {
    Multiselect,
  },

  props: {
    value: {
      type: [
        Array,
        Object,
      ],
    },
    placeholder: {
      type: String,
      default: 'Search topics',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isLoading: false,
      selection: this.value,
    }
  },

  watch: {
    value (to, from) {
      if (to !== from) {
        this.selection = to
      }
    },

    selection (value) {
      this.$emit('input', value)
    },
  },

  computed: {
    ...mapState({
      topics ({ topics }) {
        return topics.searchedAllTopics || []
      }
    }),
  },

  methods: {
    ...mapActions([
      'setSearchedAllTopics',
    ]),

    ...mapActions([
      'getSearchedTopics',
    ]),

    async onSearch (query) {
      this.isLoading = true
      await this.getSearchedTopics(query)
      this.isLoading = false
    },

    limitText (count) {
      return `and ${count} other countries`
    },

    clearAll () {
      this.$store.commit('setSearchedAllTopics', [])
    },
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped lang="stylus">
.noResult
  font-size 14px

>>> .multiselect__select
  height 48px

>>> .multiselect__input,
>>> .multiselect__single
  padding 4px 0 4px 8px
  font-size 14px
  line-height 22px

>>> .multiselect__placeholder
  padding 4px 0 4px 8px

>>> .multiselect__tags
  min-height 48px
  border 1px solid #ced4da

>>> .multiselect__tag
  padding 8px 26px 8px 10px
  background-color #222
  border-radius 2px

  .multiselect__tag-icon
    line-height 30px

    &:after
      color #ccc

    &:hover,
    &:focus
      background #222

      &:after
        color #fff

>>> .multiselect__option.multiselect__option--highlight
  &,
  &:after
    background-color #a591ff

</style>
