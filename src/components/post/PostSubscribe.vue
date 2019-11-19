<template>
	<div class="subscribe-container">
		<h3>Subscribe to Software Daily</h3>
		<p>Get ad-free episodes</p>
		<div class="switch-section">
			<span>Bill monthly</span>
			<switch-toggle />
			<span>Bill yearly (save 20%!)</span>
		</div>
		<div class="subscription-box">
			<h5>Software Daily Podcast Subscription</h5>
			<div class="details-price">
				<div class="price"><b>$8.33</b>/ month</div>
				<div>billed yearly</div>
			</div>	
			<button class="btn-default">subscribe</button>
		</div>
		<p class="footer-message">Got questions? Visit our <b>FAQ Page</b></p>
	</div>
</template>


<script>
import SwitchToggle from '@/components/SwitchToggle'
export default {
	props: {
		post: {
	      type: Object
	    }
	},
	components: { SwitchToggle }
}
</script>

<style lang="stylus" scoped>
.subscribe-container
	margin 120px 0
	padding: 60px 0
	font-size .8rem
	display flex
	flex-direction column
	text-align center
	border-top 1px solid #e9ecef
	align-items center
	.switch-section
		display flex
		justify-content center
		align-items center
		margin-right -60px
		span 
			margin -10px 20px 0 20px
			font-weight bold
	.subscription-box 
		margin 20px 0 10px 0
		max-width 270px
		padding 30px 30px
		border 1px solid #dee2e6
		border-radius 2px
		display flex
		flex-direction column
		.details-price
			margin 10px 0 20px 0
			.price
				font-size 1.6rem
		.btn-default
			padding 5px 20px
			border-radius 3px
			font-size 1.03rem
			color #fff
			background-color #222
			text-transform uppercase
			text-decoration none !important
			margin-right 25px
			font-weight 500
	.footer-message
		font-size .7rem


</style>