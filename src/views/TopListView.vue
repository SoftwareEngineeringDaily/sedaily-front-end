<script>
import SearchListView from '@/components/search/SearchListView'

export default {
  extends: SearchListView,

  name: 'top-list',
  data () {
    return {
      type: 'top',
      endPoint: 'fetchListData'
    }
  }
}
</script>
