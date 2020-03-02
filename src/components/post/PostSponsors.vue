<template>
  <div class="sponsors" v-if="post.sponsors">
    <h6 class="section-title">Sponsors</h6>
    <div class="sponsor-list">
      <a
        :key="sponsor.url"
        :href="sponsor.url"
        v-for="sponsor in post.sponsors">
          <img :src="sponsor.image" />
      </a>
    </div>
    <div class="sponsor-inquiry">
      For sponsorship inquiries
      <a href="mailto:sponsor@softwaredaily.com">
        sponsor@softwaredaily.com
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "post-sponsors",
  props: {
    post: {
      type: Object,
      required: true
    },
  },
}
</script>

<style lang="stylus">
.sponsors
  margin 50px 0
  display block
  .sponsors-section
    position relative
  .row:first-child
    align-items center
    justify-content center
    display flex
.sponsor-list
  display flex
  flex-wrap nowrap
  align-items center
  margin-left -10px
  margin-right -10px
  a
    box-sizing border-box
    display block
    flex-grow 1
    min-width 100px
    padding 0 16px
.sponsor-inquiry
  margin-top 10px
  text-align center
@media (max-width 600px)
  .sponsor-list
    flex-wrap wrap
    a
      max-width 50%
</style>
