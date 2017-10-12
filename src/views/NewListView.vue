<script>
import BaseListView from './BaseListView.vue'

export default {
  extends: BaseListView,

  name: 'new-list',
  data () {
    return {
      type: 'new',
      endPoint: 'fetchListData'
    }
  }
}
</script>

<style>
</style>
