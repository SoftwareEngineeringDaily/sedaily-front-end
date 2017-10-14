<script>
import BaseListView from '../components/BaseListView.vue'

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
