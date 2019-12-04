<template>
  <div class="search-wrapper" :class="{ open: searchActive }" v-click-outside="onSearchActive">
    <span class="search-icon" v-on:click="onSearchActive">
      <svg fill="currentColor" viewBox="0 0 512 512"><path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path></svg>
    </span>
    <input id="search" ref='search' autofocus v-on:keyup.enter='onEnter' class='search-bar-input' type='text' placeholder='Search...' v-model='searchTerm' debounce="900" />
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
        ? (this.searchActive = true,this.$refs.search.focus())
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

.search-wrapper 
  min-width 25px
  margin-right 20px
  display flex
  @media (max-width 600px)
    width 100%
    background-color #dee2e6
    padding 10px 20px
    margin-right 0
  .search-icon 
    align-items: center
    display: inline-flex
    filter: none
    cursor: pointer
    vertical-align: unset
    height: unset
    width: unset
    svg 
      height: 1.5rem;
      width: 1.5rem;
  input 
    padding-left: 0.5rem
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
    input
      width: 15rem
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
