<template>
  <div class="topicpage-create">

    <button
      class="link-button"
      @click="toggleModal">
      <i class="fa fa-plus" /> Post 
    </button>

    <modal
      v-show="isModalVisible">
      <h4 slot="header">
        What is the name of your project or company?
      </h4>
      <template slot="body">
        <p>We are always looking for new show ideas to cover in Software Daily. Here you can submit a company or project idea.</p>
        <b-input
          autocomplete="off"
          :autofocus="true"
          @keyup.enter="onSubmit"
          placeholder="Enter project or company name"
          v-model="newTopicText" />
      </template>
      <template slot="footer">
        <button type="button" class="btn-modal-secondary" @click="toggleModal">
          Cancel
        </button>
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
        isModalVisible: false,
        newTopicText: '',
    }
  },
  computed: {
    ...mapGetters([
      'isLoggedIn',
    ]),

    ...mapState({
      me(state) {
        return state.me
      }
    })
  },
  methods: {
    ...mapActions([
      'createTopic',
    ]),

    toggleModal () {
      if (!this.isModalVisible && !this.isLoggedIn) {
        return this.$toasted.error('Please login.', { duration: 5000 })
      }

      this.isModalVisible = !this.isModalVisible
    },

    async onSubmit () {
      const name = this.newTopicText.trim()

      if (!name || !this.me._id) {
        return
      }

      const data = {
        name,
        maintainer: this.me._id,
        isUserGenerated: true,
      }

      this.saving = true

      try {
        const saved = await this.createTopic({ data })

        this.$router.push({
          name: 'TopicPageEdit',
          params: { slug: saved.slug }
        })
      }
      catch (e) {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }

      this.saving = false
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/variables'

.link-button
  cursor pointer
  display inline-block
  padding 4px 12px
  font-size 14px
  font-weight 700
  color #a591ff
  border 2px solid #a591ff
  border-radius 18px
  background-color #ffffff

  &:hover
    text-decoration none
    color #ffffff
    background-color #a591ff

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
