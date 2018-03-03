<template>
  <div class="categories">
    <span
      :class="getClassForCategory('All')"
      class="category-post"
      @click="setSelectedCategory({name: 'All', id: null})">All</span>
    <span
      v-for="category in categories"
      :key="category.id"
      :class="getClassForCategory(category.name)"
      class="category-post"
      @click="setSelectedCategory(category)">{{ category.name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    },
    activeCategory: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  methods: {
    setSelectedCategory (category) {
      this.$emit('setSelectedCategory', category)
    },
    getClassForCategory (categoryName) {
      return (this.activeCategory && this.activeCategory.name === categoryName) ? 'category-active' : ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/variables'

.categories
  margin-bottom 10px
  @media (max-width 600px)
    overflow auto
    white-space nowrap

.category-post
  text-align center
  display inline-block
  cursor pointer
  color light-grey
  padding 10px
  border-radius 3px
  &:hover
    color white
    background primary-color

.category-active
  border 1px solid primary-color
  color primary-color
  &:hover
    border-radius 3px
</style>
