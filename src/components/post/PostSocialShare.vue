<template>
  <social-sharing
    v-if="post.title"
    :url="post.url"
    :href="post.url"
    :title="post.title.rendered"
    :description="postContent"
    twitter-user="software_daily"
    inline-template>
    <div class="sharing">
      <network network="facebook">
        <i class="fa fa-facebook" />
      </network>
      <network network="linkedin">
        <i class="fa fa-linkedin" />
      </network>
      <network network="twitter">
        <i class="fa fa-twitter" />
      </network>
      <network network="telegram">
        <i class="fa fa-telegram" />
      </network>
    </div>
  </social-sharing>
</template>

<script>
import SocialSharing from 'vue-social-sharing'

export default {
  name: "post-social-share",
  components: { SocialSharing },
  props: {
    post: {
      type: Object,
      required: true
    },
    postContent: {
      type: String
    },
  }
}
</script>

<style lang="stylus">
.sharing
  display flex
  font-size 1.1rem
  color #fff
  align-items center
  justify-content center
  span
    cursor pointer
    height 30px
    width 30px
    align-items center
    justify-content center
    display flex
    background-color #222
    border-radius 2px
    margin-right 10px
    @media (min-width 1000px)
      margin-bottom 10px
      margin-right 0
    &:hover
      background-color #a591ff
      transform scale(1.05)
  @media (min-width 1000px)
    position sticky
    flex-direction column
    top 100px
    margin-top 600px

</style>
