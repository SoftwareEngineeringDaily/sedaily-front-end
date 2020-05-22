<template>
  <div class="admin-topic">
    <h2> Topics </h2>
    <div class="button-group">
      <router-link class="button-submit" to="/admin/topic/add">Create new topic</router-link>
    </div>
    <b-pagination v-model="currentPage" :total-rows="filtered ? filtered.length : 0" :per-page="perPage" align="right"/>
    <div class="topics-table">
      <div class="topics-table-navbar">
        <input type="text" @input="onSearch" placeholder="Search" autofocus class="form-control">
      </div>
      <div class="topics-table-header">
        <div class="size-1">Name</div>
        <div class="size-2 center">Mantainers</div>
        <div class="size-1 center">Status</div>
        <div class="size-1 center">Actions</div>
      </div>
      <spinner :show="loading"/>
      <div class="topics-table-row" v-for="topic in filteredPage" :key="topic._id">
        <div class="size-1">{{topic.name}}</div>
        <div class="size-2 maintainers">
          <div
            v-for="maintainer in topic.maintainers"
            :key="maintainer._id"
            class="maintainer">
            <Avatar width="24px" height="24px" :user="maintainer" />
            <div>{{maintainer ? maintainer.name : ' '}}</div>
          </div>
        </div>
        <div class="size-1 center">
          <b-badge :variant="getStatusBadge(topic)">{{topic.status}}</b-badge>
        </div>
        <div class="size-1 center">
          <router-link :to="getEditRoute(topic)">Edit</router-link>
        </div>
      </div>
    </div>
    <b-pagination v-model="currentPage" :total-rows="filtered ? filtered.length : 0" :per-page="perPage" align="right"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { debounce } from 'lodash'
import Spinner from "@/components/Spinner.vue";
import Avatar from '@/components/Avatar'

export default {
  name: 'admin-topic',
  components: {
    Avatar,
    Spinner
  },
  beforeMount () {
    this.getTopics()
  },
  data () {
    return {
      loading: false,
      topics: [],
      search: '',
      currentPage: 1,
      perPage: 5
    }
  },
  computed: {
    filtered () {
      if (!this.search) return this.topics
      return this.topics.filter((topic) => {
        return new RegExp(this.search, 'i').test(topic.name)
          || new RegExp(this.search, 'i').test(topic.maintainer)
          || new RegExp(this.search, 'i').test(topic.status)
      })
    },
    filteredPage () {
      if (!this.filtered) return []
      return this.filtered.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    }
  },
  methods: {
    ...mapActions(['getFullTopics']),

    getTopics () {
      this.loading = true
      this.getFullTopics().then((data) => {
        this.topics = data
      }).catch((e) => {
        this.$toasted.error(e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    onSearch: debounce(function(event) {
      this.search = event.target.value
    },200),

    getEditRoute (topic) {
      return `/admin/topic/${topic._id}`
    },

    getStatusBadge (topic) {
      return topic.status && topic.status === 'active' ? 'active' : 'secondary'
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../css/variables'

  .admin-topic
    .topics-table
      margin-bottom 20px

      .spinner
        margin: 0 auto;
        display: inherit;

      .topics-table-navbar
        padding 10px
        border 1px solid #cecece
        margin-top -1px
        border-radius 3px 3px 0 0

      .topics-table-header
        font-weight  700
        background-color #fbfbfb

      .topics-table-header,
      .topics-table-row
        border 1px solid #cecece
        margin-top -1px
        display flex
        min-height 65px

        div
          padding 0 10px
          align-self center

        .size-1
          flex 1

        .size-2
          flex 2

        .center
          text-align center

        a
          background-color inherit
          border 1px solid primary-color
          padding 5px 10px
          color primary-color
          border-radius 30px

        .maintainers
          display flex
          flex-direction column
          align-items center

          .maintainer
            display flex

        .badge
          color #ffffff

        .badge-active
          background-color main-purple

    >>> .page-link
      color primary-color

    >>> .page-item.active .page-link
      z-index 1
      color #fff
      background-color primary-color
      border-color primary-color

</style>
