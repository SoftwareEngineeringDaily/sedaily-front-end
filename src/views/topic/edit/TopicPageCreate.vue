<template>
  <div class="topicpage-create">
    <h3 v-if="!isLoggedIn">You need to login first.</h3>
    <modal v-else>
      <h4 slot="header">What is the name of your project?</h4>
      <template slot="body">
        <b-input
          autocomplete="off"
          :autofocus="true"
          @keyup.enter="onSubmit"
          placeholder="Enter project name"
          v-model="newTopicText" />
      </template>
      <template slot="footer">
        <button type="button" class="btn-modal-secondary" @click="onCancel">Cancel</button>
        <button type="button" class="button-submit" @click="onSubmit">
          <spinner :show="saving"/>
          Submit
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Spinner from "@/components/Spinner.vue"
import modal from '@/components/ModalComponent'

export default {
  name: 'topicpage-create',
  components: {
    Spinner,
    modal
  },
  data () {
    return {
        saving: false,
        newTopicText: ''
    }
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState({
      me(state) {
        return state.me;
      }
    })
  },
  methods: {
    ...mapActions(['createTopic']),
    onSubmit () {
      const name = this.newTopicText.trim()
      if (!name || !this.me._id) return

      const data = {
        name,
        maintainer: this.me._id,
        isUserGenerated: true
      }
      
      this.saving = true
      this.createTopic({ data }).then((saved) => {
        this.$router.push({ name: 'TopicPageEdit', params: { slug: saved.slug }})
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.saving = false
      })
    },

    onCancel () {
      this.$router.push({ name: 'Home'})
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/variables'
.topicpage-create
  h3
    text-align center
    margin 40px 0

  .button-submit
    .spinner
      width 18px
      height 18px

      >>> circle
        stroke #ffffff
        
  >>> .modal
    height auto
    min-height 0

    .modal-body
      padding 15px
      display flex
      flex-direction column
      min-height 0
    
    input
      outline none
      font-size 14px

      &:focus
        outline none
        border 0
        -webkit-box-shadow 0 0 3px 3px rgba(165,145,255,0.4)
        box-shadow 0 0 3px 3px rgba(165,145,255,0.4)

    .btn-modal-secondary
      background-color none
      color #222
      margin-right 5px
      padding 5px
      border none
      outline none
</style>
