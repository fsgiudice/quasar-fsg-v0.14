<template>
  <div>
    <div class="layout-padding">
      <div class="column group" style="margin-bottom: 50px">
        <div class="floating-label">
          <input v-model="config.title" required>
          <label>Data Table Title</label>
        </div>

        <div class="column group gt-sm-row">
          <label>
            <q-checkbox v-model="config.filter" />
            Filter
          </label>
          <label>
            <q-checkbox v-model="config.refresh" />
            Refresh
          </label>
          <label>
            <q-checkbox v-model="config.columnPicker" />
            Column Picker
          </label>
          <label>
            <q-checkbox v-model="pagination" />
            Pagination
          </label>
          <label>
            <q-checkbox v-model="config.responsive" />
            Responsive
          </label>
        </div>

        <div class="column gt-sm-row group">
          <q-select
            v-model="config.selection"
            type="radio"
            label="Selection"
            :options="[
              {label: 'None', value: false},
              {label: 'Single', value: 'single'},
              {label: 'Multiple', value: 'multiple'}
            ]"
          />

          <q-select
            v-model="config.leftStickyColumns"
            type="radio"
            label="Left Sticky Columns"
            :options="[
              {label: 'None', value: 0},
              {label: '1', value: 1},
              {label: '2', value: 2}
            ]"
          />

          <q-select
            v-model="config.rightStickyColumns"
            type="radio"
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
          <q-range v-model="rowHeight" :min="50" :max="200" labelAlways />
        </div>

        <div>
          <h6>
            Table body
            <q-select
              type="radio"
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
          <q-range v-model="bodyHeight" :min="100" :max="700" labelAlways :disable="bodyHeightProp === 'auto'" />
        </div>
      </div>

      <q-data-table
        ref="table"
        :data="table"
        :config="config"
        :columns="columns"
        @refresh="refresh"
      >
        <template slot="col-message" scope="cell">
          <span class="light-paragraph">{{cell.data}}</span>
        </template>
        <template slot="col-source" scope="cell">
          <span v-if="cell.data === 'Audit'" class="label text-white bg-primary">
            Audit
            <q-tooltip>Some data</q-tooltip>
          </span>
          <span v-else class="label text-white bg-negative">{{cell.data}}</span>
        </template>

        <template slot="selection" scope="props">
          <button class="primary clear" @click="changeMessage(props)">
            <i>edit</i>
          </button>
          <button class="primary clear" @click="deleteRow(props)">
            <i>delete</i>
          </button>
        </template>
      </q-data-table>

      <div style="height: 100vh; margin-top: 50px;">Page has intended scroll.</div>
    </div>
  </div>
</template>

<script>
import { Utils } from 'quasar'
import table from '../../table-data.json'

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
    refresh (start) {
      if (!start) {
        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = null
        }
        return
      }
      this.timeout = setTimeout(() => {
        this.$refs.table.toggleRefresh()
        this.timeout = null
      }, 5000)
    }
  },
  beforeDestroy () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  },
  data () {
    return {
      table,
      config: {
        title: 'Data Table',
        filter: true,
        refresh: true,
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
          noData: '<i>warning</i> No data available to show.',
          noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
        }
      },
      columns: [
        {
          label: 'Date',
          field: 'isodate',
          style: {width: '120px'},
          format (value) {
            return new Date(value).toLocaleString()
          }
        },
        {
          label: 'Service',
          field: 'serviceable',
          format (value) {
            if (value === 'Informational') {
              return '<i class="text-positive">info</i>'
            }
            return value
          },
          style: {width: '80px'},
          classes: 'text-center'
        },
        {
          label: 'Message',
          field: 'message',
          sort: true,
          style: {width: '500px'}
        },
        {
          label: 'Source',
          field: 'source',
          sort: true,
          style: {width: '120px'}
        },
        {
          label: 'Log Number',
          field: 'log_number',
          sort: true,
          style: {width: '100px'}
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
        this.oldPagination = Utils.clone(this.config.pagination)
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
  }
}
</script>