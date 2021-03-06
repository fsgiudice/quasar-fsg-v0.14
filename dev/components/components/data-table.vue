<template>
  <div>
    <div class="column group" style="margin-bottom: 50px">
      <q-input v-model="config.title" float-label="Data Table Title" />

      <div class="column group">
        <q-checkbox v-model="config.refresh" label="Refresh" />
        <q-checkbox v-model="config.columnPicker" label="Column Picker" />
        <q-checkbox v-model="pagination" label="Pagination" />
        <q-checkbox v-model="config.responsive" label="Responsive" />
        <q-checkbox v-model="config.noHeader" label="No Header" />
      </div>

      <div class="column group">
        <q-select
          v-model="config.selection"
          label="Selection"
          :options="[
            {label: 'None', value: false},
            {label: 'Single', value: 'single'},
            {label: 'Multiple', value: 'multiple'}
          ]"
        />

        <q-select
          v-model="config.leftStickyColumns"
          label="Left Sticky Columns"
          :options="[
            {label: 'None', value: 0},
            {label: '1', value: 1},
            {label: '2', value: 2}
          ]"
        />

        <q-select
          v-model="config.rightStickyColumns"
          label="Right Sticky Columns"
          :options="[
            {label: 'None', value: 0},
            {label: '1', value: 1},
            {label: '2', value: 2}
          ]"
        />
      </div>

      <div>
        <h6>Row height ({{rowHeight}}px)</h6>
        <br>
        <q-slider v-model="rowHeight" :min="50" :max="200" label-always />
      </div>

      <div>
        <h6>
          Table body
          <q-select
            v-model="bodyHeightProp"
            :options="[
              {label: 'Auto', value: 'auto'},
              {label: 'Height', value: 'height'},
              {label: 'Min Height', value: 'minHeight'},
              {label: 'Max Height', value: 'maxHeight'}
            ]"
          />
          <span :style="{fontStyle: bodyHeightProp === 'auto' ? 'italic' : ''}">({{bodyHeight}}px)</span>
        </h6>
        <br>
        <q-slider v-model="bodyHeight" :min="100" :max="700" label-always :disable="bodyHeightProp === 'auto'" />
      </div>
    </div>

    <q-data-table
      :data="tabledata"
      :config="config"
      :columns="columns"
      :loading="loading"
      @refresh="refresh"
      @selection="selection"
      @rowclick="rowClick"
      @rowhover="rowHover"
    >
      <template slot="col-message" slot-scope="cell">
        <span class="light-paragraph">{{cell.data}}</span>
      </template>
      <template slot="col-source" slot-scope="cell">
        <span v-if="cell.data === 'Audit'" class="label text-white bg-primary">
          Audit
          <q-tooltip>Some data</q-tooltip>
        </span>
        <span v-else class="label text-white bg-negative">{{cell.data}}</span>
      </template>

      <template slot="selection" slot-scope="props">
        <q-btn flat color="primary" @click="changeMessage(props)">
          <q-icon name="edit" />
        </q-btn>
        <q-btn flat color="primary" @click="deleteRow(props)">
          <q-icon name="delete" />
        </q-btn>
      </template>
    </q-data-table>

    <div style="height: 100vh; margin-top: 50px;">Page has intended scroll.</div>
  </div>
</template>

<script>
import table from 'data/table.json'
import { clone } from 'quasar'

export default {
  methods: {
    changeMessage (props) {
      props.rows.forEach(row => {
        row.data.message = 'Gogu'
      })
    },
    deleteRow (props) {
      props.rows.forEach(row => {
        this.table.splice(row.index, 1)
      })
    },
    loadData () {
      this.tabledata = []
      // console.log('table = ', table)
      this.loading = true
      // console.log('app loadData() start - loading', this.loading)
      setTimeout(() => {
        this.tabledata = table
        this.loading = false
        // console.log('app loadData() end - loading', this.loading)
      }, 3000)
    },
    refresh (done) {
      this.loadData()
      this.timeout = setTimeout(() => {
        done()
      }, 5000)
    },
    selection (number, rows) {
      console.log(`selected ${number}: ${rows}`)
    },
    rowClick (row) {
      console.log('clicked on a row', row)
    },
    rowHover (row, isHover) {
      console.log('row hover', row, isHover)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
  },
  data () {
    return {
      tabledata: [],
      loading: false,
      config: {
        title: 'Data Table',
        refresh: true,
        noHeader: false,
        noFooter: false,
        columnPicker: true,
        leftStickyColumns: 0,
        rightStickyColumns: 2,
        bodyStyle: {
          maxHeight: '500px'
        },
        rowHeight: '50px',
        responsive: true,
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
        selection: 'multiple',
        messages: {
          noData: '<i class="material-icons">warning</i> No data available to show.',
          noDataAfterFiltering: '<i class="material-icons">warning</i> No results. Please refine your search terms.'
        },
        labels: {
          columns: 'Coluuuuumns',
          allCols: 'Eeeeeeeeevery Cols',
          rows: 'Rooows',
          selected: {
            singular: 'item selecteeed.',
            plural: 'items selecteeed.'
          },
          clear: 'cleeeear',
          search: 'Seaaaarch',
          all: 'AAAll'
        }
      },
      columns: [
        {
          label: 'Date',
          field: 'isodate',
          width: '120px',
          classes: 'bg-orange-2',
          filter: true,
          sort (a, b) {
            return (new Date(a)) - (new Date(b))
          },
          format (value) {
            return (new Date(value).toLocaleString()) + (new Date(value).toLocaleString())
          }
        },
        {
          label: 'Service',
          field: 'serviceable',
          format (value) {
            if (value === 'Informational') {
              return '<i class="material-icons text-positive">info</i>'
            }
            return value
          },
          width: '80px',
          classes: 'text-center',
          footLabel: 'Footer Service'
        },
        {
          label: 'Time Range',
          field: 'timerange',
          width: '120px',
          sort: true,
          type: 'number'
        },
        {
          label: 'Message',
          field: 'message',
          filter: true,
          classes (val) {
            return val.charAt(0) === 'L' ? 'bg-red' : 'bg-yellow'
          },
          sort: true,
          type: 'string',
          width: '500px'
        },
        {
          label: 'Source',
          field: 'source',
          filter: true,
          sort: true,
          type: 'string',
          width: '120px'
        },
        {
          label: 'Log Number <i>Wow</i>',
          field: 'log_number',
          sort: true,
          type: 'string',
          width: '100px'
        }
      ],

      pagination: true,
      rowHeight: 50,
      bodyHeightProp: 'maxHeight',
      bodyHeight: 500
    }
  },
  watch: {
    pagination (value) {
      if (!value) {
        this.oldPagination = clone(this.config.pagination)
        this.config.pagination = false
        return
      }

      this.config.pagination = this.oldPagination
    },
    rowHeight (value) {
      this.config.rowHeight = value + 'px'
    },
    bodyHeight (value) {
      let style = {}
      if (this.bodyHeightProp !== 'auto') {
        style[this.bodyHeightProp] = value + 'px'
      }
      this.config.bodyStyle = style
    },
    bodyHeightProp (value) {
      let style = {}
      if (value !== 'auto') {
        style[value] = this.bodyHeight + 'px'
      }
      this.config.bodyStyle = style
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.loadData()
    })
  }
}
</script>
