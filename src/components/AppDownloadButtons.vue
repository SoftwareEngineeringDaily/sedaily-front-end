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

</style>