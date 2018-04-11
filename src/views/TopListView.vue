<script>
import BaseListView from '../components/BaseListView'

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
