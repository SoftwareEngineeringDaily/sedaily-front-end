<template>
  <div class="app-download">
    <a
      href="https://itunes.apple.com/us/app/software-engineering-daily/id1253734426?mt=8"
      target="_blank"
    >
      <img src="@/assets/iosstore.png" class="icon">
    </a>

    <a
      href="https://play.google.com/store/apps/details?id=com.koalatea.sedaily"
      target="_blank"
    >
      <img src="@/assets/androidstore.png" class="icon">
    </a>
    <a
      href="https://github.com/SoftwareEngineeringDaily"
      target="_blank"
      class="github-container"
    >
      <img src="@/assets/icons/Github.png" class="github-icon">
      GitHub
    </a>
  </div>
</template>

<script>
	export default {

	}
</script>


<style lang="stylus">
.app-download
  display flex
  flex-direction column
  align-items center

.github-container
  width 145px
  background-color #000
  border-radius 5px
  overflow hidden
  padding 3px
  margin-left 3px
  color #fff
  font-size 1.3rem
  align-items center
  display flex
  height 45px
  margin-bottom 4px

  &:hover
    color white
    text-decoration none

.github-icon
  max-width 25%
  margin-right 5px

</style>
