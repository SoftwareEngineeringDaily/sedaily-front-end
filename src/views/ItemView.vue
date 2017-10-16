<template>
  <div class="item-view" v-if="item">
    <template v-if="item">
      <div class="item-view-header">

        <div class='voting' style='display:inline-block; height: 100%;'>
          <span class="score">
            <span class='arrow' v-bind:class="{ active: item.upvoted }" style='margin-left: 1px;' @click='upvote'>▲</span>
            <br>
            {{ item.score || 0}}
            <br>
            <span class='arrow' v-bind:class="{ active: item.downvoted }" style='margin-left: -4px;' @click='downvote'>▼</span>
          </span>
        </div>

        <div class='item-header-details' style='display:inline-block'>
          <a :href="item.url" target="_blank">
            <h1>{{ item.title.rendered }}</h1>
          </a>
          <span v-if="item.url" class="host">
            ({{ item.url | host }})
          </span>

          <p class="meta">
            {{ item.score || 0 }} points
            <!-- | by <router-link :to="'/user/' + item.by">{{ item.by }}</router-link> -->
            {{ item.date | timeAgo }} ago
          </p>
        </div>
      </div>

      <div v-for="comment in comments"> Comment: {{comment.content}} </div>
      <div class="item-view-comments" v-html='item.content.rendered'>
      </div>

      <!-- <div class="item-view-comments">
        <p class="item-view-comments-header">
          {{ item.kids ? item.descendants + ' comments' : 'No comments yet.'}}
          <spinner :show="loading"></spinner>
        </p>
        <ul v-if="!loading" class="comment-children">
          <comment v-for="id in item.kids" :key="id" :id="id"></comment>
        </ul>
      </div> -->
    </template>
  </div>
</template>

<script>
import Spinner from '../components/Spinner.vue'
// import Comment from '../components/Comment.vue'

export default {
  name: 'item-view',
  components: { Spinner, Comment },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    item () {
      return this.$store.state.items[this.$route.params.id]
    },
    comments () {
      return this.$store.state.itemComments[this.$route.params.id] || []
    }
  },
  beforeMount () {
    this.$store.dispatch('fetchArticle', {
      id: this.$store.state.route.params.id
    }).then(() => {
      this.loading = false
    })
    // Fetch comments
    console.log('id? ', this.$store.state.route.params.id)
    this.$store.dispatch('commentsFetch', {
      postId: this.$store.state.route.params.id
    }).then((comments) => {
      console.log('comments fetched!', comments)
    })
  },
  methods: {
    upvote: function () {
      this.$store.dispatch('upvote', {
        id: this.$store.state.route.params.id
      })
    },
    downvote: function () {
      this.$store.dispatch('downvote', {
        id: this.$store.state.route.params.id
      })
    }
  }
}
</script>

<style lang="stylus">
.item-view-header
  background-color #fff
  padding 1.8em 2em 1em
  box-shadow 0 1px 2px rgba(0,0,0,.1)
  h1
    display inline
    font-size 1.5em
    margin 0
    margin-right .5em
  .host, .meta, .meta a
    color #999
  .meta a
    text-decoration underline

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

.item-view-comments
  background-color #fff
  margin-top 10px
  padding 1em 2em .5em

  .row, h2
    display: none

.item-view-comments-header
  margin 0
  font-size 1.1em
  padding 1em 0
  position relative
  .spinner
    position absolute
    top 0
    right 0
    bottom auto

.comment-children
  list-style-type none
  padding 0
  margin 0

@media (max-width 600px)
  .item-view-header
    h1
      font-size 1.25em
</style>
