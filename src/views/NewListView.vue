<script>
import BaseListView from '../components/BaseListView'

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
