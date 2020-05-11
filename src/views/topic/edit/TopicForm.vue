<template>
  <div class="admin-topic">
    <h2>{{ editing ? 'Edit' : 'Add' }} Topic</h2>
    <div class="center"><spinner :show="loadingTopic"/></div>
    <div v-if="showForm" class="row">
      <form class="col-md-12" @submit.prevent="submit" @keydown.enter.prevent>
        <div class="form-group">
          <label for="inputName">Topic Name</label>
          <input type="text"
            id="inputName"
            v-model="data.name"
            v-validate="'required'"
            name="topicName"
            class="form-control"
            placeholder="Ex: Kubernetes"/>
        </div>
        <div class="form-group">
          <label for="inputRoute">Topic Slug</label>
          <input type="text"
            id="inputRoute"
            disabled
            v-model="data.slug"
            name="topicRoute"
            class="form-control"
            aria-describedby="routeHelp"
            placeholder="Automatically generates"/>
        </div>
        <div class="form-group">
          <label for="inputRoute">Maintainers</label>
          <select-multi-user-input v-model="data.maintainers" />
        </div>
        <div v-if="errors && errors.items.length" class="form-validation alert-danger">
          <ul>
            <li v-for="error in errors.items" :key="error.id">{{ error.msg }}</li>
          </ul>
        </div>
        <div class="form-group">
          <b-form-checkbox v-model="data.status" value="active" unchecked-value="inactive">
            Active
          </b-form-checkbox>
        </div>
        <div class="form-footer">
          <button type="submit" :disabled="saving" class="button-submit">
            <spinner :show="saving"></spinner>
            Submit
          </button>
          <div class="form-message"></div>
        </div>
      </form>
    </div>
    <EditQuestions v-if="data._id" :entityId="data._id" entityType="topic" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { pick, every } from 'lodash'
import Spinner from "@/components/Spinner.vue";
import SelectMultiUserInput from '@/components/SelectMultiUserInput'
import EditQuestions from '@/components/questions/EditQuestions'

export default {
  components: {
    Spinner,
    SelectMultiUserInput,
    EditQuestions,
  },
  name: 'topic-form',
  data () {
    return {
      editing: false,
      saving: false,
      loadingTopic: false,
      data: {
        _id: '',
        name: '',
        slug: '',
        maintainer: null,
        status: 'active'
      }
    }
  },
  beforeMount () {
    this.setupEditing()
  },
  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    }),

    showForm () {
      if (this.loadingTopic) return false
      if (!this.editing) return true
      if (this.data._id) return true
      return false
    }
  },
  methods: {
    ...mapActions([
      'getTopic',
      'updateTopic',
      'addTopic'
    ]),

    setupEditing () {
      if (!this.$route.params.id) return
      this.editing = true
      this.editingId = this.$route.params.id
      this.loadEditTopic()
    },

    loadEditTopic () {
      this.loadingTopic = true
      this.getTopic({ topicId: this.editingId }).then((data) => {
        this.data = { ...this.data, ...pick(data, '_id', 'name', 'slug', 'status', 'maintainers') }
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.loadingTopic = false
      })
    },

    getSaveData () {
      const maintainers = every(this.data.maintainers || [], '_id')
        ? this.data.maintainers
        : undefined

      return {
        _id: this.data._id || undefined,
        name: this.data.name,
        status: this.data.status,
        maintainers,
      }
    },

    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        if (this.editing) return this.update()
        this.create()
      })
    },

    update () {
      this.saving = true
      this.updateTopic({ topicId: this.data._id, data: this.getSaveData() }).then(() => {
        this.$toasted.success('Saved!', { duration : 2000 })
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.saving = false
      })
    },

    create () {
      this.saving = true
      this.addTopic({ data: this.getSaveData() }).then((saved) => {
        this.$toasted.success('Saved!', { duration : 2000 })
        this.$router.push(`/admin/topic/${saved._id.toString()}`)
        this.$nextTick(() => {
          this.setupEditing()
        })
      }).catch((e, r) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        this.saving = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .center
    text-align center

  .form-validation
    padding 10px 0
    color red
    border-radius 3px

    ul
      margin 0

  .form-footer
    display flex
    margin-top 20px

    .button-submit
      margin 0
      height 32px

      .spinner
        width 22px
        height 22px

        >>> circle
          stroke #ffffff

    .form-message
      flex 1
      padding 0 10px
      line-height 32px
</style>
