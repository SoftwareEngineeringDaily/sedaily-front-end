<script>
import BaseListView from './BaseListView.vue'

export default {
  extends: BaseListView,

  name: 'top-list',
  data () {
    return {
      type: 'top',
      endPoint: 'fetchListData'
    }
  }
}
</script>

<style>
</style>
