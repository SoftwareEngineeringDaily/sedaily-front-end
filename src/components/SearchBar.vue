<template>
  <div class='search-bar' v-if="showFilteringElements">
    <input class='search-bar-input' type='text' placeholder='Search...' v-model='searchTerm' debounce="900"/>
  </div>
  <div v-else>
    <br />
    <br />
  </div>
</template>

<script>
export default {
  name: 'search-bar',
  data () {
    return {
      searchTerm: null,
      showFilteringElements: true,
    }
  },
  watch: {
    searchTerm () {
      this.makeSearch()
    }
  },
  methods: {
    makeSearch () {
      if (this.searchTerm === ' ') {
        this.searchTerm = null
        this.$store.commit('setSearchTerm', { searchTerm: this.searchTerm })
      } else {
        this.$store.commit('setSearchTerm', { searchTerm: this.searchTerm })
      }
    },
  }
}
</script>

<style scoped lang="stylus">
@import './../css/variables'
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
