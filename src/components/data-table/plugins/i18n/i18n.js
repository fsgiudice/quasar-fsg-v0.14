import extend from '../../../../utils/extend'

const labels = {
  columns: 'Columns',
  allCols: 'All Columns',
  rows: 'Rows',
  selected: {
    singular: 'item selected.',
    plural: 'items selected.'
  },
  clear: 'Clear',
  search: 'Search',
  all: 'All'
}

export default {
  computed: {
    labels () {
      if (this.config && this.config.labels) {
        return extend({}, labels, this.config.labels)
      }
      return labels
    },
    message () {
      // console.log('messaggio - loading', this.loading)

      if (this.rows.length) {
        return false
      }

      // debugger

      if (this.loading) {
        return (this.config.messages && this.config.messages.dataLoading) || '<i class="material-icons">search</i> Loading data, please wait.'
      }

      if (this.filtering.terms) {
        return (this.config.messages && this.config.messages.noDataAfterFiltering) || '<i class="material-icons">warning</i> No results. Please refine your search terms.'
      }

      return (this.config.messages && this.config.messages.noData) || '<i class="material-icons">warning</i> No data available to show.'
    }
  }
}
