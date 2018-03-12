<template>
  <div class="forum">
    <h1>Forum</h1>
    <div class="content">
      <div v-if="loading">
        <spinner :show="loading" />
      </div>
      <div v-else>
        <thread-list :threads="threads"></thread-list>
      </div>
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList.vue'
import Spinner from '@/components/Spinner.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'forum-view',
  components: { ThreadList, Spinner },
  data () {
    return {
      loading: true
    }
  },
  beforeMount () {
    console.log('beforeMount Froum View')
    this.fetchThreadList()
      .then((threads) => {
        this.loading = false
      })
      .catch((error) => {
        console.log('error logging  in', error)
        this.loading = false
      })
  },
  methods: {
    ...mapActions(['fetchThreadList'])
  },
  computed: {
    ...mapState({
      threads (state) {
        return state.threads
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.forum
  padding 10px 20px
</style>

