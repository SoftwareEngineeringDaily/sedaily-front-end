<template>
  <multiselect
    v-model="selection"
    id="topics"
    label="label"
    track-by="name"
    :placeholder="placeholder"
    open-direction="bottom"
    :max="3"
    :options="options"
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
    @search-change="onSearch"
    @remove="onRemove"
    @select="onAdd">

    <span slot="noResult">No twitter users found.</span>

  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapState, mapActions } from 'vuex'
import { delay } from '@/utils/post.utils'

export default {
  name: 'twitter-users-search',

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
    onAdd: {
      type: Function,
      default: () => {},
    }
  },

  data() {
    return {
      isLoading: false,
      selection: this.value,
      options: [],
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

  methods: {
    ...mapActions([
      'twitterUsersSearch',
    ]),

    onSearch (query) {
      if (!query) {
        return
      }

      this.isLoading = true

      delay(async () => {
        try {
          const users = await this.twitterUsersSearch(query)
          this.options = users
        }
        catch (err) {
          console.error('err ', err)
        }

        this.isLoading = false
      }, 300)

    },

    limitText (count) {
      return `and ${count} other twitter users`
    },

    clearAll () {
      this.$store.commit('twitterUsersSearch', [])
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
  font-weight 700
  background-color #1da1f2
  border-radius 2px

  .multiselect__tag-icon
    line-height 30px

    &:after
      color #f5f8fa

    &:hover,
    &:focus
      background #1da1f2

      &:after
        color #fff

>>> .multiselect__option.multiselect__option--highlight
  &,
  &:after
    background-color #a591ff

</style>
