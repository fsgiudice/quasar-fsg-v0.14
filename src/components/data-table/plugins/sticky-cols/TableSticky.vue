<template>
  <table class="q-table horizontal-separator">
    <colgroup>
      <col v-if="selection" style="width: 36px;" />
      <col v-for="col in cols" :style="{width: col.width}" />
    </colgroup>
    <thead v-if="!noHeader">
      <tr>
        <th v-if="selection">
          <template v-if="!right">
             <q-checkbox v-if="selection === 'multiple'" v-model="selectAll">
               <q-tooltip v-if="selectAllRowsLabel" v-html="selectAllRowsLabel"></q-tooltip>
             </q-checkbox>
             <span v-else>&nbsp;</span>
          </template>
          <span v-else>&nbsp;</span>
        </th>
        <th
          v-for="(col, index) in cols"
          :class="{invisible: hidden(index), sortable: col.sort}"
          @click="sort(col)"
        >
          <template v-if="!hidden(index)">
            <sort-icon
              v-if="col.sort"
              :field="col.field"
              :sorting="sorting"
            ></sort-icon>
            <span v-html="col.label"></span>
            <q-tooltip v-if="col.label" v-html="col.label"></q-tooltip>
          </template>
        </th>
      </tr>
    </thead>

    <tbody v-if="!head">
      <slot></slot>
    </tbody>
  </table>
</template>

<script>
import SortIcon from '../sort/SortIcon.vue'
import { QTooltip } from '../../../tooltip'
import { QCheckbox } from '../../../checkbox'

export default {
  name: 'q-table-sticky',
  components: {
    SortIcon,
    QCheckbox,
    QTooltip
  },
  props: {
    stickyCols: Number,
    cols: Array,
    head: Boolean,
    noHeader: Boolean,
    right: Boolean,
    sorting: Object,
    scroll: Object,
    selection: [String, Boolean],
    rowAllSelection: Boolean,
    selectAllRowsLabel: String
  },

  data () {
    return {
      selected: false,
      selectAll: this.rowAllSelection
    }
  },

  watch: {
    rowAllSelection (value) {
      this.selectAll = value
    },
    selectAll (value) {
      // console.log('watch selectAll:', value)
      this.$emit('selectAllRows', value)
    }
  },
  methods: {
    hidden (index) {
      if (this.right) {
        return this.cols.length - this.stickyCols > index
      }
      return index >= this.stickyCols
    },
    sort (col) {
      if (col.sort) {
        this.$emit('sort', col)
      }
    }
  }
}
</script>
