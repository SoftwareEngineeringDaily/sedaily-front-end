<template>
  <ais-instant-search :search-client="searchClient" v-bind:index-name="index">
    <ais-configure :hits-per-page.camel="8" />
    <ais-autocomplete>
      <div class="search-bar" slot-scope="{ currentRefinement, indices, refine }">

        <input
          id="search"
          type="search"
          ref="input"
          placeholder="Search"
          :value="value"
          @input="$event => {
            refine($event.currentTarget.value)
            value = $event.currentTarget.value
          }"
          @keyup.enter="onSearch">

        <ul v-if="currentRefinement" v-for="index in indices" :key="index.label">
          <li v-for="hit in index.hits" :key="hit.objectID">
              <router-link :to="postPrettyUrl(hit)" :post="hit">
                <ais-highlight attribute="title" :hit="hit"/>
              </router-link>
          </li>
        </ul>

      </div>
    </ais-autocomplete>
  </ais-instant-search>
</template>

<script>
import isFunction from 'lodash/isFunction'
import algoliasearch from 'algoliasearch/lite';
import { postPrettyUrl } from './../utils/post.utils';
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
    onSearch({ target }) {
      this.$router.push({ path: target.value ? `/?query=${target.value}` : '/' })
      window.scrollTo(0, 0)

      if (!target.value) {
       return document.location.reload(true)
      }

      this.$store.commit('setSearchTerm', { searchTerm: target.value || null })
      this.$store.commit('setNextPage', { nextPage: 0 })

      if (target && isFunction(target.blur)) {
        target.blur()
      }
    },
  },
};
</script>

<style scoped lang="stylus">
@import './../css/variables';
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

input#search {
  text-indent: 30px;
  background-image: url('../assets/icons/search.svg');
  background-repeat: no-repeat;
  background-position: left;
  background-position-x: 5px;
  background-size: 25px;
}

.search-bar {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 15px;
}

.search-bar input {
  flex: 1;
  width: 100%;
  max-width: 500px;
  padding: 5px;
  font-weight: 100;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-bar input:focus {
  color: #495057;
  background-color: #fff;
  border-color: #edeaff;
  box-shadow: 0 0 0 0.2rem rgba(133, 106, 255, 0.25);
  outline: none;
  outline: 0;
}

.search-bar ul {
  list-style: none;
  display: none;
  overflow: hidden;
  position: absolute;
  top: 100%;
  width: 100%;
  max-width: 500px;
  margin-top: 0.5rem;
  padding-left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar ul li a {
  display: block;
  margin-right: 0;
  padding: 0.4rem 0.8rem;
  border-bottom: 1px solid #edeaff;
}

.search-bar:active ul,
.search-bar:focus ul,
.search-bar input:focus + ul {
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
  .ais-InstantSearch {
    width: 100%;
  }
}
</style>
