<template>
  <div>
    <div v-if="lastEdited" class='last-edited'>
      Last Edited: {{lastEdited}}
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'last-edited-info',
  props: {
    lastEditedTimestamp: {
      type: String
    }
  },
  computed: {
    lastEdited () {
      if (!this.lastEditedTimestamp) return false
      return moment(this.lastEditedTimestamp)
      .startOf('hour').fromNow()
    }
  }
}

</script>

<style lang="stylus" scoped>
  .last-edited
    padding 5px 10px
    background #ffffed
    border 1px solid #efeccd
    width 75%
    border-radius 14px
    font-family Roboto-Italic
    margin-bottom 20px
</style>
