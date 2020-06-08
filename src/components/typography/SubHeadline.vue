<template>
  <div class="subheadline"><slot /></div>
</template>

<script>
export default {
  name: 'sub-headline',
}
</script>

<style lang="stylus">
.subheadline
  font-family -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight 700
  letter-spacing 0.5px
  text-transform uppercase

</style>
