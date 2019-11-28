function getRowSelection (rows, selection, multiple) {
  if (!selection) {
    return []
  }
  let result = multiple ? rows.map((r) => [false, r.__index]) : [false, -1]
  return result
}

export default {
  data () {
    return {
      rowSelection: [],
      rowAllSelected: false
    }
  },
  created () {
    this.rowSelection = getRowSelection(this.rows, this.config.selection, this.multipleSelection)
  },
  watch: {
    'data' (value) {
      // console.log('row-selection - dati modificati', value)
      // if (typeof value !== 'Array' || value.length === 0) {
      //   this.rowAllSelected = false
      // }
      this.clearSelection ()
      this.rowAllSelected = false
      this.rowSelection = getRowSelection(this.rows, this.config.selection, this.multipleSelection)
    },
    'rowsSelected' (value) {
      if (value === 0) {
        this.rowAllSelected = false
      }
    },
    'config.selection' (value) {
      this.rowSelection = getRowSelection(this.rows, value, value === 'multiple')
    },
    rows (r) {
      this.rowSelection = getRowSelection(r, this.config.selection, this.multipleSelection)
    },
    rowSelection () {
      this.$nextTick(() => {
        this.$emit('selection', this.rowsSelected, this.selectedRows)

        if (this.rowsSelected) {
          this.toolbar = 'selection'
          return
        }
        if (this.toolbar === 'selection') {
          this.toolbar = ''
        }
      })
    }
  },
  computed: {
    multipleSelection () {
      return this.config.selection && this.config.selection === 'multiple'
    },
    rowsSelected () {
      if (this.multipleSelection) {
        return this.rowSelection.filter(r => r[0]).length
      }
      return this.rowSelection.length && this.rowSelection[0][0] ? 1 : 0
    },
    selectedRows () {
      if (this.multipleSelection) {
        return this.rowSelection
          .filter(row => row[0])
          .map(row => {
            return { index: row[1], data: this.data[row[1]] }
          })
      }

      if (!this.rowSelection.length || this.rowSelection[0][1] === -1) {
        return []
      }
      const
        index = this.rowSelection[0][1],
        row = this.data[index]

      return [{index, data: row}]
    }
  },
  methods: {
    updateSelection () {
      if (this.multipleSelection) {
        // this.rowSelection = this.rows.map((row,index) => this.rowSelection[index])
        // force to update
        this.rowSelection = this.rowSelection.map(r => r)
      }

      if (this.rowsSelected) {
        this.toolbar = 'selection'
        return
      }
      if (this.toolbar === 'selection') {
        this.toolbar = ''
      }
    },

    selectAllRows (value) {
      // console.log('method selectAllRows:', value)
      if (!this.multipleSelection) {
        this.rowAllSelected = false
        return
      }
      this.rowAllSelected = value
      if (value) {
        this.rowsSelectAll()
      }
      else {
        this.rowsUnselectAll()
      }
    },
    rowsSelectAll () {
      // console.log('rowsSelectAll')
      // this.rowSelection = this.rows.map((row) => (typeof this.config.selectable === 'function' ? this.config.selectable(row) : true))
      // debugger
      this.rowSelection = this.rowSelection.map((r) => {
        if (typeof this.config.selectable === 'function') {
          let row = this.data[r[1]]
          let isSelectable = this.config.selectable(row)
          return [isSelectable, r[1]]
        }
        else {
          return [true,r[1]]
        }
      })
    },
    rowsUnselectAll () {
      // console.log('rowsUnselectAll')
      // this.rowSelection = this.rows.map(() => false)
      this.rowSelection.map((r) => [false,r[1]])
    },
    clearSelection () {
      if (!this.multipleSelection) {
        this.rowSelection = [false, -1]
        return
      }
      // this.rowSelection = this.rows.map(() => false)
      this.rowSelection.map((r) => [false,r[1]])
      this.rowAllSelected = false
    },
    emitRowClick (row) {
      this.$emit('rowclick', row)
    }
  }
}
