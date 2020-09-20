<template>
  <div class="q-data-table">

    <!-- toolbar area start -->
    <template v-if="hasToolbar && toolbar === ''">
      <div class="q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end">
        <div v-if="config.format || config.title" class="q-data-table-title ellipsis col" v-html="displayFormat"></div>
        <div class="row items-center">
          <q-btn v-if="config.refresh && !refreshing" flat color="primary" @click="refresh">
            <q-icon name="refresh"></q-icon>
          </q-btn>
          <q-btn v-if="refreshing" class="disabled">
            <q-icon name="cached" class="animate-spin-reverse"></q-icon>
          </q-btn>
          <q-select
            multiple
            toggle
            v-if="config.columnPicker"
            v-model="columnSelection"
            :options="columnSelectionOptions"
            :display-value="labels.columns"
            simple
            style="margin: 0 0 0 10px"
          ></q-select>
        </div>
      </div>
    </template>
    <!-- toolbar area end -->

    <!-- pagination top area start -->
    <table-pagination v-if="isPaginationDisplayed" :disabled="!isPaginationEnabled" :pagination="pagination" :entries="pagination.entries" :labels="labels" @paginationRowsChanged="emitRowsChanged"></table-pagination>
    <!-- pagination top area end -->

    <!-- selection info area start -->
    <div class="q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end q-data-table-selection" v-show="toolbar === 'selection'">
      <div class="col">
        {{ rowsSelected }}
        <span v-if="rowsSelected === 1">{{ labels.selected.singular }}</span>
        <span v-else>{{ labels.selected.plural }}</span>
        <q-btn flat small color="primary" @click="clearSelection">{{ labels.clear }}</q-btn>
      </div>
      <div>
        <slot name="selection" :rows="selectedRows"></slot>
      </div>
    </div>
    <!-- selection info area end -->

    <!-- filter area start -->
    <table-filter v-if="filteringCols.length" :filtering="filtering" :columns="filteringCols" :labels="labels"></table-filter>
    <!-- filter area end -->

    <!-- table responsive start -->
    <template v-if="responsive">

      <div v-if="message" class="q-data-table-message row flex-center" v-html="message"></div>

      <div v-else :style="bodyStyle" style="overflow: auto">
        <table class="q-table horizontal-separator responsive" ref="body">
          <tbody>
            <tr v-for="(row, index) in rows" @click="emitRowClick(row)" @mouseover="emitRowHover(row, true)" @mouseleave="emitRowHover(row, false)">
              <td v-if="config.selection">
                <q-checkbox v-if="config.selection === 'multiple' && (typeof config.selectable === 'function' ? config.selectable(row) : true)" v-model="rowSelection[index][0]"></q-checkbox>
                <q-radio v-else-if="config.selection === 'single' && (typeof config.selectable === 'function' ? config.selectable(row) : true)" v-model="rowSelection[0]" :val="index"></q-radio>
              </td>
              <td v-for="col in cols" :data-th="col.label" :style="formatStyle(col, row[col.field])" :class="formatClass(col, row[col.field])">
                <slot :name="'col-'+col.field" :row="row" :col="col" :data="row[col.field]">
                  <span v-html="format(row, col)"></span>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </template>
    <!-- table responsive end -->

    <!-- table regular start -->
    <div v-else class="q-data-table-container" @wheel="mouseWheel" @mousewheel="mouseWheel" @DOMMouseScroll="mouseWheel">

      <!-- table regular header row start -->
      <div v-if="hasHeader" class="q-data-table-head" ref="head" :style="{marginRight: scroll.vert}">
        <table-content
          head
          :cols="cols"
          :sorting="sorting"
          :scroll="scroll"
          :selection="config.selection"
          @sort="setSortField"
          @selectAllRows="selectAllRows"
          :rowAllSelection="rowAllSelected"
          :selectAllRowsLabel="selectAllLabel"
        ></table-content>
      </div>
      <!-- table regular header row end -->

      <!-- table regular body rows start -->
      <div
        class="q-data-table-body"
        :style="bodyStyle"
        ref="body"
        @scroll="scrollHandler"
      >
        <div v-if="message" class="q-data-table-message row flex-center" v-html="message"></div>

        <table-content v-else
          :cols="cols"
          :selection="config.selection"
        >
          <tr v-for="row in rows"
            :style="rowStyle"
            @click="emitRowClick(row)"
            @mouseover="emitRowHover(row, true)"
            @mouseleave="emitRowHover(row, false)"
          >

            <td v-if="config.selection"></td>

            <td v-if="leftStickyColumns" :colspan="leftStickyColumns"></td>

            <td v-for="col in regularCols" :style="formatStyle(col, row[col.field])" :class="formatClass(col, row[col.field])">
              <slot :name="'col-'+col.field" :row="row" :col="col" :data="row[col.field]">
                <span v-html="format(row, col)"></span>
              </slot>
            </td>

            <td v-if="rightStickyColumns" :colspan="rightStickyColumns"></td>

          </tr>
        </table-content>
      </div>

      <template v-if="!message && (leftStickyColumns || config.selection)">
        <div
          class="q-data-table-sticky-left"
          ref="stickyLeft"
          :style="{bottom: scroll.horiz}"
        >
          <table-sticky
            :no-header="!hasHeader"
            :no-footer="!hasFooter"
            :sticky-cols="leftStickyColumns"
            :cols="cols"
            :sorting="sorting"
            :selection="config.selection"
            @selectAllRows="selectAllRows"
            :rowAllSelection="rowAllSelected"
            :selectAllRowsLabel="selectAllLabel"
          >
            <tr v-for="(row, index) in rows" :key="row.__lastUpdate" :style="rowStyle" @click="emitRowClick(row)" @mouseover="emitRowHover(row, true)" @mouseleave="emitRowHover(row, false)">
              <td v-if="config.selection">
                <q-checkbox v-if="config.selection === 'multiple' && (typeof config.selectable === 'function' ? config.selectable(row) : true)" v-model="rowSelection[index][0]"></q-checkbox>
                <q-radio v-else-if="config.selection === 'single' && (typeof config.selectable === 'function' ? config.selectable(row) : true)" v-model="rowSelection[0]" :val="index"></q-radio>
              </td>
              <td v-for="(col, index) in leftCols" :style="formatStyle(col, row[col.field])" :class="formatClass(col, row[col.field])">
                <slot :name="'col-'+col.field" :row="row" :col="col" :data="row[col.field]">
                  <span v-html="format(row, col)"></span>
                </slot>
              </td>
            </tr>
          </table-sticky>
        </div>
        <div v-if="hasHeader" class="q-data-table-sticky-left" :style="{bottom: scroll.horiz}">
          <table-sticky head
            :sticky-cols="leftStickyColumns"
            :scroll="scroll"
            :cols="cols"
            :sorting="sorting"
            @sort="setSortField"
            :selection="config.selection"
            @selectAllRows="selectAllRows"
            :rowAllSelection="rowAllSelected"
            :selectAllRowsLabel="selectAllLabel"
          ></table-sticky>
        </div>
        <div v-if="hasFooter" class="q-data-table-head" ref="foot" :style="{marginRight: scroll.vert}">
          <table-content foot :cols="cols" :scroll="scroll"></table-content>
        </div>
      </template>
      <!-- table regular end -->

      <!-- TOFIX: currently disabled right sticky columns as there is an error on building header -->
      <!--template v-if="!message && rightStickyColumns">
        <div
          class="q-data-table-sticky-right"
          ref="stickyRight"
          :style="{right: scroll.vert, bottom: scroll.horiz}"
        >
          <table-sticky :no-header="!hasHeader" right :sticky-cols="rightStickyColumns" :cols="cols" :sorting="sorting" :selection="config.selection">
            <tr v-for="row in rows" :style="rowStyle" @click="emitRowClick(row)">
              <td v-if="config.selection" class="invisible"></td>
              <td :colspan="cols.length - rightStickyColumns" class="invisible"></td>
              <td v-for="col in rightCols" :style="formatStyle(col, row[col.field])" :class="formatClass(col, row[col.field])">
                <slot :name="'col-'+col.field" :row="row" :col="col" :data="row[col.field]">
                  <span v-html="format(row, col)"></span>
                </slot>
              </td>
            </tr>
          </table-sticky>
        </div>
        <div v-if="hasHeader" class="q-data-table-sticky-right" :style="{right: scroll.vert}">
          <table-sticky right head :sticky-cols="rightStickyColumns" :scroll="scroll" :cols="cols" :sorting="sorting" @sort="setSortField" :selection="config.selection"></table-sticky>
        </div>
      </template-->
    </div>

    <!-- pagination bottom area start -->
    <table-pagination v-if="isPaginationDisplayed" :disabled="!isPaginationEnabled" :pagination="pagination" :entries="pagination.entries" :labels="labels" @paginationRowsChanged="emitRowsChanged"></table-pagination>
    <!-- pagination bottom area end -->

  </div>
</template>

<script>
// import clone from '../../utils/clone'

import ColumnSelection from './plugins/column-selection/column-selection'
import Filter from './plugins/filter/filter'
import I18n from './plugins/i18n/i18n'
import Pagination from './plugins/pagination/pagination'
import Responsive from './plugins/responsive/responsive'
import RowSelection from './plugins/row-selection/row-selection'
import Scroll from './plugins/scroll/scroll'
import Sort from './plugins/sort/sort'
import StickyColumns from './plugins/sticky-cols/sticky-cols'
import TableContent from './TableContent.vue'
import { QSelect } from '../select'
import { QBtn } from '../btn'
import { QIcon } from '../icon'
import { QCheckbox } from '../checkbox'
import { QRadio } from '../radio'

export default {
  name: 'q-data-table',
  components: {
    QSelect,
    QBtn,
    QIcon,
    QCheckbox,
    QRadio,
    TableContent
  },
  mixins: [ColumnSelection, Filter, I18n, Pagination, Responsive, RowSelection, Scroll, Sort, StickyColumns],
  props: {
    data: {
      type: [Array, Function],
      default () { return [] }
    },
    loading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      internalData: [],
      selected: false,
      toolbar: '',
      refreshing: false
    }
  },

  watch: {
    data (newValue, oldValue) {
      // debugger
      // console.log('watch data', newValue, oldValue)
      // console.log('watch data - Object.keys(newValue).length', Object.keys(newValue).length)
      // console.log('watch data - Object.keys(oldValue).length', Object.keys(oldValue).length)
      // console.log('watch data - newValue ob ', newValue.hasOwnProperty('__ob__'))
      // console.log('watch data - oldValue ob ', oldValue.hasOwnProperty('__ob__'))
      this.internalData = newValue
      // if (newValue) {
      //   this.$emit('loading', () => {
      //     this.loading = false
      //   })
      // }
    }

    // loading (newValue, oldValue) {
    //   console.log('watch loading', newValue, oldValue)
    //   // if (newValue) {
    //   //   this.$emit('loading', () => {
    //   //     this.loading = false
    //   //   })
    //   // }
    // },
    //
    // refreshing (newValue, oldValue) {
    //   console.log('watch refreshing', newValue, oldValue)
    //   // if (newValue) {
    //   //   this.$emit('loading', () => {
    //   //     this.loading = false
    //   //   })
    //   // }
    // }
  },

  computed: {
    rows () {
      let data = this.internalData || []

      if (!data.length) {
        return []
      }

      // let rows = clone(this.data) // no clone, as I can need to update real data
      let rows = data

      // we have to set index AFTER filter and sorting
      rows.forEach((row, i) => {
        row.__index = i
        // set lastUpdate as reactive
        this.$set(row, '__lastUpdate', row.__index + '_' + Date.now())
        // add function to force update of row
        row.__forceUpdate = () => {
          row.__lastUpdate = row.__index + '_' + Date.now()
        }
        // add function to select/unselect row
        row.__select = () => {
          // this.rowSelection[row.__index] = true
          let s = this.rowSelection.find(r => r[2] === row.__index)
          s[0] = true
          this.updateSelection()
          row.__lastUpdate = row.__index + '_' + Date.now()
        }
        row.__unselect = () => {
          // this.rowSelection[row.__index] = false
          let s = this.rowSelection.find(r => r[2] === row.__index)
          s[0] = false
          this.updateSelection()
          row.__lastUpdate = row.__index + '_' + Date.now()
        }
      })

      if (this.filtering.terms) {
        rows = this.filter(rows)
        // console.log('filter: rows = ', rows)
      }

      if (this.sorting.field) {
        this.sort(rows)
      }

      this.pagination.entries = rows.length
      if (this.pagination.rowsPerPage > 0) {
        rows = this.paginate(rows)
      }

      return rows
    },

    isPaginationDisplayed () {
      let isDisplayed = false
      let pagination = this.config.pagination
      // debugger
      if (pagination) {
        if (pagination.hasOwnProperty('displayed')) {
          isDisplayed = (typeof pagination.displayed === 'function' ? this.config.pagination.displayed() : this.config.pagination.displayed)
        }
        else {
          isDisplayed = true
        }
      }
      return isDisplayed
    },

    isPaginationEnabled () {
      let isEnabled = false
      let pagination = this.config.pagination
      // debugger
      if (pagination) {
        if (pagination.hasOwnProperty('enabled')) {
          isEnabled = (typeof pagination.enabled === 'function' ? pagination.enabled() : pagination.enabled)
        }
        else {
          isEnabled = true
        }
      }
      return isEnabled
    },

    rowStyle () {
      if (this.config.rowHeight) {
        return {height: this.config.rowHeight}
      }
    },
    bodyStyle () {
      return this.config.bodyStyle || {}
    },
    hasToolbar () {
      return this.config.title || this.config.columnPicker || this.config.refresh
    },
    hasHeader () {
      return !this.config.noHeader
    },
    hasFooter () {
      return !this.config.noFooter
    },
    selectAllLabel () {
      return this.config && this.config.labels && this.config.labels.selectAllCheckBox
    },
    displayFormat () {
      let f = this.config.format || '%T'
      f = f.replace('%T', this.config.title)
      f = f.replace('%N', this.rows.length)
      if (this.config.labels && this.config.labels.textNumber) {
        f = f.replace('%text_number', this.rows.length === 1 ? this.config.labels.textNumber.singular || '' : this.config.labels.textNumber.plural || '')
      }
      else {
        f = f.replace('%text_number', '')
      }

      return f
    }
  },
  methods: {
    loadData () {
      if (typeof this.data === 'function') {
        // console.log('watch data - ', this.pagination.page, this.pagination.rowsPerPage, this.filtering.terms, this.sorting.field)
        // console.log('loadData function')
        this.internalData = this.data(this.pagination.page, this.pagination.rowsPerPage, this.filtering.terms, this.sorting.field)
      }
      else {
        // console.log('loadData property')
        this.internalData = this.data
      }
      // console.log('loadData this.internalData.length', this.internalData.length)
    },
    resetBody () {
      let body = this.$refs.body

      if (body) {
        body.scrollTop = 0
      }
      this.pagination.page = 1
    },
    format (row, col) {
      return col.format ? col.format(row[col.field], row) : row[col.field]
    },
    refresh (state) {
      if (state === false) {
        this.refreshing = false
      }
      else if (state === true || !this.refreshing) {
        this.refreshing = true
        this.$emit('refresh', () => {
          this.refreshing = false
        })
        this.loadData()
      }
    },
    formatStyle (col, value) {
      return typeof col.style === 'function' ? col.style(value) : col.style
    },
    formatClass (col, value) {
      return typeof col.classes === 'function' ? col.classes(value) : col.classes
    },
    emitRowHover (row, isHover) {
      this.$emit('rowhover', row, isHover)
    }
  }
}
</script>
