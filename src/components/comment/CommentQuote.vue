<template>
  <div v-if="highlight" class="quote-scroll">
    <blockquote class="quote" :class="{ 'is-preview': isPreview }">
      <div v-if="isPreview" :class="{ 'text-ellipsis': isPreview }">"{{highlight}}"</div>
      <template v-else>"{{highlight}}"</template>
    </blockquote>
  </div>
</template>

<script>
export default {
  props: {
    isPreview: {
      type: Boolean,
    },
    highlight: {
      type: String,
    }
  }
}
</script>

<style lang="stylus" scoped>
.quote-scroll
  overflow auto

.quote
  display: inline;
  font-size 1.2rem;
  color #fff;
  background-color: #a591ff;

  &.is-preview
    display block
    margin-bottom 0

.text-ellipsis
  overflow hidden
  white-space nowrap
  text-overflow ellipsis

</style>
