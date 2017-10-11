<template>
  <li class="news-item">
    <div>
      <a-player :music="{
        title: item.title.rendered,
        url: item.mp3,
        pic: item.featuredImage,
        lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
      }"></a-player>
    </div>
    <span class="score">
      <span class='arrow' v-bind:class="{ active: item.upvoted }"
      style='margin-left: 1px;' @click='upvote(item)'>▲</span>
      <br>
      {{ item.score || 0 }}
      <br>
      <span class='arrow' v-bind:class="{ active: item.downvoted }"
      style='margin-left: -4px;' @click='downvote(item)'>▼</span>
    </span>
    <span class="title">
      <template v-if="item.url">
        <a :href="item.url" target="_blank">{{ item.title.rendered }}</a>
        <span class="host"> ({{ item.url | host }})</span>
      </template>
      <template v-else>
        <router-link :to="'/item/' + item._id">{{ item.title.rendered }}</router-link>
      </template>
    </span>
    <br>
    <span class="meta">
      <!-- <span v-if="item.type !== 'job'" class="by">
        by <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
      </span> -->
      <span class="time">
        <!-- {{ item.time | timeAgo }} ago -->
        {{date}}
      </span>
      <!-- <span v-if="item.type !== 'job'" class="comments-link">
        | <router-link :to="'/item/' + item._id">{{ item.descendants }} comments</router-link>
      </span> -->
    </span>
    <!-- <span class="label" v-if="item.type !== 'story'">{{ item.type }}</span> -->
  </li>
</template>

<script>
import moment from 'moment'
import VueAplayer from 'vue-aplayer'
export default {
  name: 'news-item',
  props: ['item'],
  components: {
    'a-player': VueAplayer
  },
  computed: {
    date () {
      return moment(this.item.date).format('MMM Do YY')
    }
  },
  methods: {
    upvote: function (item) {
      this.$store.dispatch('upvote', {
        id: item._id
      })
    },
    downvote: function (item) {
      this.$store.dispatch('downvote', {
        id: item._id
      })
    }
  }
}
</script>

<style lang="stylus">
.news-item
  background-color #fff
  padding 20px 30px 20px 80px
  border-bottom 1px solid #eee
  position relative
  line-height 20px
  display inline-flex
  flex-wrap wrap
  flex-direction column
  width 50%

  .arrow
    color #888
    &:hover
      cursor pointer
      color #ff6600

    &.active
      color #ff6600 !important
      &:hover
        cursor pointer
        color #888

  .score
    color #ff6600
    font-size 1.1em
    font-weight 700
    position absolute
    top 50%
    left 0
    width 80px
    text-align center
    margin-top -30px
  .meta, .host
    font-size .85em
    color #999
    a
      color #999
      text-decoration underline
      &:hover
        color #ff6600

@media (max-width 576px)
  .news-item
    width 100%
</style>
