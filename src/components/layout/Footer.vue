<template>
	<footer class="site-footer">
		<div class="inner">
			<div @click="resetApp" class="site-name site-logo">
	          <img class="logo-img" src="../../assets/sedaily-logo.png">
	          <span>Software Daily</span>
	       </div>
	       <div class="center">
	       		<a href="https://itunes.apple.com/us/app/software-engineering-daily/id1253734426?mt=8" class="footer-link">App Store</a>
	       		<a href="https://play.google.com/store/apps/details?id=com.koalatea.sedaily" class="footer-link">Google Play</a>
	       		<a href="https://github.com/SoftwareEngineeringDaily" class="footer-link">Github</a>
	       </div>
	       <span class="right">
	       		<router-link to="/terms" class="footer-link">Terms of Service</router-link>
	       		<router-link to="/terms" class="footer-link">Privacy Policy</router-link>
	       </span>
   		</div>
	</footer>
</template>


<script>
export default {
	name: "nav-footer",
	props: {

	},
	methods: {
		resetApp() {
	      this.$store.commit('setSearchTerm', { searchTerm: null })
	      this.$router.push({ path: `/` })
	      document.location.reload(true)
	    },
	}
}
</script>

<style lang="stylus" scoped>
.site-footer
	background #222
	.inner
		max-width 1200px
		box-sizing border-box
		margin 0px auto
		padding 25px 5px
		display flex
		align-items center
		justify-content space-between
		.footer-link 
			color #fff
			margin-left 10px
		@media (max-width 659px)
			flex-direction column
			align-items flex-start
			padding 25px 20px
			> *
				margin-bottom 10px
	.site-logo
		margin-right 0.75em
		cursor pointer
		text-transform uppercase
		font-size 13px
		color #fff
		line-height 25px
		letter-spacing normal
		font-weight bold
		display flex
		align-items center
		&:hover
			text-decoration none
		&.router-link-active
			text-decoration none
			border-bottom none
		.logo-img
			max-height 30px
			margin-right 10px
	    

</style>