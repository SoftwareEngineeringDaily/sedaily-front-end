<template>
  <div class='forum'>
    <div
      class="row"
      v-if="isLoggedIn">
      <div style="display: none" class="col-sm-10 ">
        <button
          @click="$router.push('/new-thread')"
          class="create-post">
          <svg width="25px" height="25px" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 47 (45396) - http://www.bohemiancoding.com/sketch -->
              <title>noun_243840</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Forum-List" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Forum-List-Copy-39" transform="translate(-99.000000, -162.000000)" fill-rule="nonzero" fill="#795FFF">
                      <g id="noun_243840" transform="translate(99.000000, 162.000000)">
                          <path d="M2.6999902,8.52464486 L2.6999902,22.3367889 L16.5669302,22.3367889 L16.5669302,16.279289 C17.2484811,15.8354205 17.877605,15.3654421 18.4805155,14.8432438 C18.6377964,14.7388042 18.8999314,14.5038149 19.2669204,14.1643861 L19.2669204,23.6683944 C19.2669204,24.399472 18.6640099,25 17.930032,25 L1.33688835,25 C0.602910433,25 0,24.399472 0,23.6683944 L0,7.16692938 C0,6.43585181 0.602910433,5.83532381 1.33688835,5.83532381 L5.84560985,5.83532381 C5.34755341,6.67084103 4.92813746,7.55857807 4.58736199,8.52464486 L2.6999902,8.52464486 Z M24.6931143,0.19558259 C24.2212713,0.11725285 23.6707879,0.0650330242 23.0154505,0.0389231111 C23.0154505,0.0389231111 23.0154505,0.0389231111 23.0154505,0.0389231111 L22.8581695,0.0389231111 C22.7533155,0.0389231111 22.674675,0.0389231111 22.569821,0.0128131981 L22.569821,0.0128131981 L22.5436075,0.0128131981 L22.307686,0.0128131981 L22.307686,0.0128131981 C17.8513915,-0.14384628 14.7319854,1.18775929 14.7319854,1.18775929 L14.7319854,1.18775929 C10.4853988,2.88490364 7.57570066,5.93976346 6.26502581,10.6134379 C5.84560985,12.1278129 5.97667734,13.6944076 6.18638532,15.2348925 C6.21259881,15.3654421 6.2912393,15.6004313 6.73686876,15.3132223 L6.73686876,15.3132223 C7.62812766,12.8588904 9.12229699,10.587328 10.9048148,8.62908451 C13.1591755,6.14864277 15.6756713,4.16428938 18.8212909,2.93712346 C19.3979879,2.70213424 19.9484713,2.51936485 20.5251682,2.33659546 C20.5513817,2.38881529 20.4989547,2.44103511 20.4465277,2.46714503 C20.4465277,2.46714503 20.4203142,2.46714503 20.3941007,2.49325494 C18.7164369,3.14600277 17.2484811,4.08595964 15.8591657,5.2086859 C13.552378,6.98415999 11.5863657,9.22961251 9.88248841,11.6578344 C7.89026263,14.5038149 6.3174528,17.5325649 5.26891292,20.8224139 C5.26891292,20.8224139 5.08541844,21.6318212 5.71454237,21.0574031 L8.46695956,17.6370045 C8.49317306,17.5847847 8.54560006,17.5325649 8.57181355,17.480345 C8.62424055,17.4281252 8.70288104,17.4020153 8.78152153,17.3497955 C10.0397694,16.879817 11.3242307,16.4620584 12.5300516,15.8876403 C14.1815019,15.1565628 15.6756713,14.2166059 17.0125596,13.0677697 C17.1698406,12.9633301 18.6640099,11.788384 20.2106063,9.38627199 C20.2368198,9.36016207 20.2630333,9.30794225 20.2892468,9.28183234 C20.2892468,9.25572242 20.3154603,9.25572242 20.3154603,9.22961251 C20.7086627,8.62908451 21.0756517,7.95022677 21.4426406,7.2191492 L18.2708075,6.77528068 C18.2708075,6.77528068 21.8620566,6.27919233 22.3863265,5.10424625 C22.41254,5.05202642 22.4387535,4.92147685 22.4911805,4.86925703 C22.779529,4.24261911 23.041664,3.56376137 23.3562259,2.98934329 L23.3562259,2.98934329 C23.4610799,2.70213424 24.1688443,1.4227485 24.9028222,0.691670938 C25.1125302,0.561121372 24.9552492,0.221692503 24.6931143,0.19558259 Z" id="Shape"></path>
                      </g>
                  </g>
              </g>
          </svg>
          <span class="create-post-text">Create New Post</span>
        </button>
         <router-link class="link create-project-link" :to="{ name: 'NewProjectThread', params: {}}">Post a Project</router-link>
      </div>
    </div>
    <div class="row">
      <transition :name="transition">
          <div class="row" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <div class="forum-threads col-sm-12">
              <forum-thread-summary
              v-for="forumThread in displayedPosts"
              :key="forumThread._id"
              :forumThread="forumThread"/>
            </div>

            <div class="spinner-holder">
              <spinner :show="loading"></spinner>
            </div>
          </div>
      </transition>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions, mapGetters } from 'vuex'
import Spinner from '@/components/Spinner.vue'
import ForumThreadSummary from '@/components/ForumThreadSummary'

export default {
  name: 'forum',
  components: {
    ForumThreadSummary,
    Spinner
  },
  data () {
    return {
      loading: false,
      endOfPosts: false,
      displayedPosts: [],
      transition: 'slide-up',

    }
  },

  beforeMount () {
    this.$ga.event({
      eventCategory: 'forum',
      eventAction: 'load forum',
      eventLabel: 'viewing /'
    })
  },

  methods: {
    ...mapActions(['fetchForumThreads']),
    loadMore (newSearch = false) {
      if (this.endOfPosts) {
        return
      }
      this.loading = true
      const params = {
        lastActivityBefore: undefined
      }

      if (this.displayedPosts.length > 0) {
        const lastPost = this.displayedPosts[this.displayedPosts.length - 1]
        params.lastActivityBefore = moment(lastPost.dateLastAcitiy).toISOString()
      }

      this.$store.dispatch('fetchForumThreads', params)
        .then((result) => {
          if (newSearch) {
            this.displayedPosts = []
          }

          if (result && result.length > 0) {
            this.displayedPosts = this.displayedPosts.concat(result)
          } else {
            this.endOfPosts = true
          }
          this.loading = false
        })
        .catch(_ => {
        // TODO: log events
          this.endOfPosts = true
          this.loading = false
        })
        this.$ga.event({
          eventCategory: 'forum',
          eventAction: 'forum load more',
          eventLabel: `posts count: ${this.displayedPosts.length}`
        })
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState({
      forumThreads (state) {
        if (!state.forumThreadIdsList) return []
        const threads = state.forumThreadIdsList.map((id) => state.forumThreads[id])
        return threads
      }
    })
  }
}

</script>

<style scoped lang="stylus">
@import '../css/variables'

.create-post
  padding 10px 20px
  border 2px solid primary-color
  border-radius 5px
  background-color white
  color primary-color
  cursor pointer
  display inline-flex
  align-items center
  justify-content center
  transition all .5s ease

#Forum-List-Copy-39 path
  transition all .5s ease
  fill= #795FFF

.create-project-link
  margin-left 20px
  position absolute
  margin-top 16px


.create-post:hover
  background-color primary-color
  color white
  #Forum-List-Copy-39 path
    fill white

.create-post-text
  align-self center
  margin-left 5px
  height 100%
  font-weight bold
  font-size 0.9em

.forum-threads
  margin-top 40px



@media (min-width: 768px)
  .forum
    margin-left 30px


</style>
