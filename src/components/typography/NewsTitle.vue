<template>
  <div class="news-title"><slot /></div>
</template>

<script>
export default {
  name: 'news-title',
}
</script>

<style lang="stylus">
.news-title
  font-family Lora, serif
  font-size 34px
  line-height 1.2
  font-weight 600
  margin-bottom 0.5rem

</style>
