<template>
  <div v-if="highlight" class="quote-scroll">
    <blockquote class="quote">
      "{{highlight}}"
    </blockquote>
  </div>
</template>

<script>
export default {
  props: {
    highlight: {
      type: String,
    }
  }
}
</script>

<style lang="stylus" scoped>
.quote-scroll
  overflow auto
  max-height 156px

.quote
  display: inline;
  font-size 1.2rem;
  color #fff;
  background-color: #a591ff;

</style>
