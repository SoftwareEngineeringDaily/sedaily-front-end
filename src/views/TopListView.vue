<script>
import BaseListView from '../components/BaseListView.vue'

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
