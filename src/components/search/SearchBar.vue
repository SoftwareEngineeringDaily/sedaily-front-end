<template>
  <div class="search-wrapper">
    <span v-if="!searchActive" v-on:click="onSearchActive">
      <img class="search-img" src="@/assets/icons/search.svg">
    </span>
    <div v-else>
      <div class='search-bar' v-if="showFilteringElements">
        <input id="search" v-on:keyup.enter='onEnter' class='search-bar-input' type='text' placeholder='Search...' v-model='searchTerm' debounce="900"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search-bar',
  data() {
    return {
      searchTerm: null,
      searchActive: false,
      showFilteringElements: true,
    }
  },
  watch: {
    searchTerm() {
      this.makeSearch()
    }
  },
  methods: {
    makeSearch() {
      if (this.searchTerm === ' ') {
        this.searchTerm = null
        this.$store.commit('setSearchTerm', { searchTerm: this.searchTerm })
      } else {
        this.$store.commit('setSearchTerm', { searchTerm: this.searchTerm })
      }
    },
     onSearchActive() {
      !this.searchActive
        ? (this.searchActive = true)
        : (this.searchActive = false);
    },
    onEnter() {
      this.makeSearch()
      this.$router.push({ path: `/search` })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../css/variables'
input#search
 background-image url(../../assets/icons/search.svg)
 background-repeat: no-repeat
 background-position left
 background-position-x 5px
 background-size 25px
 text-indent 30px

input#search focus
 background-image none
.search-wrapper 
  min-width 25px
.search-bar
  flex 1
  display flex
  align-items center
  margin-right 15px
  input
    max-width 500px
    flex 1
    border-radius 5px
    padding 5px
    font-weight 100
    color #C4C4C4
    border 1px solid #ccc
    &:focus
      outline none
      color: #495057;
      background-color: #fff;
      border-color: #edeaff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(133, 106, 255, 0.25);
</style>
