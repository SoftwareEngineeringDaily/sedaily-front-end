<template>
  <div>
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <span class="headline ml-3">{{ text }}</span>
      </div>
    </div>
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: null
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/stylus/variables'

.badge
  display flex
  border-radius 18px
  background-color primary-color
  width 36px
  height 36px
  align-items center
  justify-content center

.headline
  height 100%
  display flex
  font-size 28px
  text-align left

hr
  margin 0
  margin-bottom 10px
  width 100%
  border-top 1px solid primary-color

</style>
