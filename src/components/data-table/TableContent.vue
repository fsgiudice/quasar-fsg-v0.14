<template>
  <table class="q-table horizontal-separator" :style="tableStyle">

    <colgroup>
      <col v-if="selection" style="width: 36px;" />
      <col v-for="col in cols" :style="{width: col.width}" />
      <col v-if="(head || foot) && scroll.horiz" :style="{width: scroll.horiz}" />
    </colgroup>

    <thead v-if="head">
      <tr>
        <th v-if="selection">
          <q-checkbox v-if="selection === 'multiple'" v-model="selectAll">
            <q-tooltip v-if="selectAllRowsLabel" v-html="selectAllRowsLabel"></q-tooltip>
          </q-checkbox>
          <span v-else>&nbsp;</span>
        </th>

        <th
          v-for="col in cols"
          :class="{sortable: col.sort}"
          @click="sort(col)"
        >
          <sort-icon
            v-if="col.sort"
            :field="col.field"
            :sorting="sorting"
          ></sort-icon>
          <span v-html="col.label"></span>
          <q-tooltip v-if="col.label" v-html="col.label"></q-tooltip>
        </th>

        <th v-if="(head || foot) && scroll.horiz"></th>
      </tr>
    </thead>

    <tbody v-else-if="!head && !foot">
      <slot></slot>
    </tbody>

    <tfoot v-if="foot">
      <tr>
        <td>
          <span>&nbsp;</span>
        </td>

        <td
          v-for="col in cols"
        >
          <span v-html="(typeof col.footLabel === 'function' ? col.footLabel() : col.footLabel)"></span>
          <q-tooltip v-if="col.footLabel" v-html="col.footLabel"></q-tooltip>
        </td>

        <td v-if="(head || foot) && scroll.horiz"></td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import SortIcon from './plugins/sort/SortIcon.vue'
import { QTooltip } from '../tooltip'
import { QCheckbox } from '../checkbox'

export default {
  name: 'q-table-content',
  components: {
    SortIcon,
    QCheckbox,
    QTooltip
  },
  props: {
    cols: Array,
    head: Boolean,
    foot: Boolean,
    sorting: Object,
    scroll: Object,
    selection: [String, Boolean],
    rowAllSelection: Boolean,
    selectAllRowsLabel: String
  },
  data () {
    return {
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
  computed: {
    tableStyle () {
      return {
        width: this.head && this.vert ? `calc(100% - ${this.scroll.vert})` : '100%'
      }
    }
  },
  methods: {
    sort (col) {
      if (col.sort) {
        this.$emit('sort', col)
      }
    }
  }
}
</script>
