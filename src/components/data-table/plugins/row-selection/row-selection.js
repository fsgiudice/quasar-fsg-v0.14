function getRowSelection (rows, selection, multiple) {
  // console.log('getRowSelection: rows = ', rows)
  // console.log('getRowSelection: selection = ', selection)
  // console.log('getRowSelection: multiple = ', multiple)
  if (!selection) {
    return []
  }
  // debugger
  // let result = multiple ? rows.map((r) => [false, r.__index]) : [-1]
  let result = multiple ? rows.map((r, i) => [false, i, r.__index]) : [-1]
  // console.log('getRowSelection: result = ', result)
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
      if (typeof value !== 'Array' || value.length === 0) {
        this.rowAllSelected = false
      }
      // this.clearSelection ()
      // this.rowAllSelected = false
      // this.rowSelection = getRowSelection(this.rows, this.config.selection, this.multipleSelection)
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
      return this.rowSelection.length && this.rowSelection[0] !== -1 ? 1 : 0
    },
    selectedRows () {
      // console.log('selectedRows: = this.multipleSelection', this.multipleSelection, ', this.rowSelection = ', this.rowSelection)
      // console.log('this.rows', this.rows)

      if (this.multipleSelection) {
        return this.rowSelection
          .filter(row => row[0])
          .map(row => {
            // return { index: row[1], data: this.data[row[1]] }
            return { index: row[1], data: this.rows[row[1]] }
          })
      }

      if (!this.rowSelection.length || this.rowSelection[0] === -1) {
        return []
      }
      const index = this.rowSelection[0]
      // const row = this.data[index]
      const row = this.rows[index]
      // console.log('index = ', index, ', row = ', row)
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
      if (!this.multipleSelection) {
        return
      }
      // console.log('rowsSelectAll')
      // this.rowSelection = this.rows.map((row) => (typeof this.config.selectable === 'function' ? this.config.selectable(row) : true))
      // debugger
      this.rowSelection = this.rowSelection.map((r) => {
        if (typeof this.config.selectable === 'function') {
          // let row = this.data[r[1]]
          let row = this.rows[r[1]]
          let isSelectable = this.config.selectable(row)
          return [isSelectable, r[1], r[2]]
        }
        else {
          return [true, r[1], r[2]]
        }
      })
    },
    rowsUnselectAll () {
      if (!this.multipleSelection) {
        this.rowSelection = [-1]
        return
      }
      // console.log('rowsUnselectAll')
      // this.rowSelection = this.rows.map(() => false)
      this.rowSelection = this.rowSelection.map((r) => [false, r[1], r[2]])
    },
    clearSelection () {
      if (!this.multipleSelection) {
        this.rowSelection = [-1]
        return
      }
      // this.rowSelection = this.rows.map(() => false)
      this.rowSelection = this.rowSelection.map((r) => [false, r[1], r[2]])
      this.rowAllSelected = false
    },
    emitRowClick (row) {
      this.$emit('rowclick', row)
    }
  }
}
