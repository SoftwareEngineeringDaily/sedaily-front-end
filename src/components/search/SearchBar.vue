<template>
  <ais-instant-search :search-client="searchClient" v-bind:index-name="index">
    <ais-configure :hits-per-page.camel="8" />
    <ais-autocomplete>
      <div class="search" slot-scope="{ currentRefinement, indices, refine }">

        <div class="search-bar" :class="{ open: searchActive, focus: isFocused }">
          <span class="search-icon" >
            <svg fill="currentColor" viewBox="0 0 512 512">
              <path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path>
            </svg>
          </span>
          <input
            id="search"
            class="search-bar-input"
            type="search"
            ref="input"
            placeholder="Search"
            :value="value"
            @input="$event => {
              refine($event.currentTarget.value)
              value = $event.currentTarget.value
            }"
            @focus="toggleFocus"
            @blur="toggleFocus"
            @keyup.enter="onSearch" />
        </div>
        <template v-if="currentRefinement">
          <ul v-for="index in indices" :key="index.label">
            <li v-for="hit in index.hits" :key="hit.objectID">
                <router-link :to="postPrettyUrl(hit)" :post="hit">
                  <ais-highlight attribute="_title" :hit="hit"/>
                </router-link>
            </li>
          </ul>
        </template>

      </div>
    </ais-autocomplete>
  </ais-instant-search>
</template>

<script>
import isFunction from 'lodash/isFunction'
import algoliasearch from 'algoliasearch/lite';
import { postPrettyUrl } from '../../utils/post.utils';
import 'instantsearch.css/themes/algolia-min.css';

export default {
  data() {
    return {
      searchClient: algoliasearch(
        process.env.ALGOLIA_APP_ID,
        process.env.ALGOLIA_API_KEY
      ),
      index: process.env.ALGOLIA_POSTS_INDEX,
      value: this.$route.query.query,
      isFocused: false,
      searchActive: true,
      postPrettyUrl: (post) => {
        return postPrettyUrl(post)
      },
    };
  },
  mounted() {
    if (!this.value) {
      return
    }

    this.onSearch({ target: { value: this.value } })
  },
  methods: {
    toggleFocus() {
      setTimeout(() => {
        this.isFocused = !this.isFocused
      }, 300)
    },

    async onSearch({ target }) {
      if (!target.value) {
        return (this.$route.name !== 'PostsAll') ? this.$router.push({ name: 'PostsAll' }) : false
      }

      this.$store.commit('setNextPage', { nextPage: 0 })

      try {
        if (!this.$route.query.query || this.$route.query.query !== target.value) {
          await this.$router.push({ name: 'Search', query: { query: target.value } })
        }
      }
      catch (err) {
        console.error('err ', err)
      }

      window.scrollTo(0, 0)
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../css/variables';

.search-bar
  display flex
  min-width 25px

  @media (max-width 600px)
    width 100%
    background-color #dee2e6
    padding 10px
    margin-right 0

  .search-icon
    cursor: pointer
    vertical-align: unset
    align-items: center
    display: inline-flex
    width: unset
    height: unset
    margin-left 5px
    filter: none

    svg
      pointer-events: none;
      margin-left: 0;
      height: 1.5rem;
      width: 1.5rem;

  input
    padding: 0
    padding-left 8px
    text-overflow: ellipsis
    width: 0
    z-index: 900
    border-width: 0px
    border-style: initial
    border-color: initial
    border-image: initial
    transition all .3s cubic-bezier(0.19, 1, 0.22, 1) 0s

    @media (max-width 600px)
      width 100%
      background-color transparent

    &:focus
      outline: none

  &.open
    padding 5px
    input
      width: 15rem

.search-bar
  flex 1
  display flex
  flex-direction row
  align-items center
</style>

<style>
.ais-InstantSearch {
  flex-grow: 1;
  text-transform: none;
}

.ais-Hits-list {
  margin-top: 0;
  margin-bottom: 1em;
}

.ais-Highlight-highlighted,
.ais-Snippet-highlighted {
  color: #ffffff;
  background-color: #a591ff
}

.search {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
}

.search-bar input {
  flex: 1;
  width: 100%;
  max-width: 500px;
  border: none;
  border-radius: 3px;
}

.search-bar.open {
  box-shadow: 0 0 0 0.1rem rgba(133, 106, 255, 0.25);
  margin-right: 1.5rem;
  border-radius: 3px;
}

.search ul {
  list-style: none;
  display: none;
  overflow: hidden;
  position: absolute;
  top: 100%;
  margin: 5px 7px 0 -1px;
  padding-left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.search ul li a {
  display: block;
  margin-right: 0;
  padding: 0.4rem 0.8rem;
  border-bottom: 1px solid #edeaff;
}

.search ul li:last-child a {
  border-bottom: none;
}

.search-bar.open + ul {
  display: block;
}

.ais-Hits-item img {
  margin-right: 1em;
}

.hit-name {
  margin-bottom: 0.5em;
}

.hit-description {
  color: #888;
  font-size: 0.8em;
  margin-bottom: 0.5em;
}

@media (max-width: 660px) {
  .search {
    margin-right: 0;
  }

  .search-bar.focus + ul {
    display: block;
    width: auto;
    margin: auto 5%;
    border-top: none;
    border-radius: 0 0 5px 5px;
  }

  .search-bar.open input {
    padding: 0;
  }

  .ais-InstantSearch {
    width: 100%;
  }
}
</style>
