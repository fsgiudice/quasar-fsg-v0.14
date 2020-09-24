<template>
  <div :class="containerClass" class="q-alert-container">
    <q-transition
      :name="name"
      :enter="enter"
      :leave="leave"
      :duration="duration"
      :appear="appear"
      @after-leave="$emit('dismiss-end')"
    >
      <div
        v-if="active"
        class="q-alert row no-wrap"
        :key="__id"
        :class="classes"
        :style="extstyles"
      >
        <div class="q-alert-icon row col-auto flex-center">
          <q-icon :name="alertIcon"></q-icon>
        </div>
        <div class="q-alert-content col self-center">
          <slot></slot>
          <div
            v-if="actions && actions.length"
            class="q-alert-actions row items-center"
          >
            <span
              v-for="(btn, i) in actions"
              :key="'btn_' + i"
              @click="dismiss(btn.handler, __id)"
              v-html="typeof btn.label === 'function' ? btn.label(countDown(__id)) : btn.label"
              class="uppercase"
            ></span>
          </div>
        </div>
        <div
          v-if="dismissible"
          class="q-alert-close self-top col-auto"
        >
          <q-icon
            name="close"
            class="cursor-pointer"
            @click="dismiss(null, __id)"
          ></q-icon>
        </div>
      </div>
    </q-transition>
  </div>
</template>

<script>
import typeIcon from '../../utils/type-icons'
import { QIcon } from '../icon'
import { QTransition } from '../transition'

let _idAlert = 0
// let alerts = []

export default {
  name: 'q-alert',
  components: {
    QIcon,
    QTransition
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    duration: Number,
    name: String,
    enter: String,
    leave: String,
    appear: Boolean,
    color: {
      type: String,
      default: 'negative'
    },
    inline: Boolean,
    icon: String,
    styles: [String, Object],
    dismissible: Boolean,
    timeout: {
      type: Number,
      default: -1
    },
    actions: Array,
    position: {
      type: String,
      validator: v => [
        'top', 'top-right', 'right', 'bottom-right',
        'bottom', 'bottom-left', 'left', 'top-left',
        'top-center', 'bottom-center'
      ].includes(v)
    }
  },
  data () {
    return {
      active: this.value,
      counter: this.timeout
    }
  },
  created () {
    _idAlert++
    // alerts.push({id: _idAlert, counter: this.timeout})
  },
  watch: {
    value (v) {
      if (v !== this.active) {
        this.active = v
        if (!v) {
          this.$emit('dismiss', this.__id)
        }
      }
    }
  },
  computed: {
    __id () {
      return _idAlert
    },

    alertIcon () {
      return this.icon || typeIcon[this.color] || typeIcon.warning
    },
    containerClass () {
      const cls = []
      let pos = this.position

      if (pos) {
        if (pos.indexOf('center') > -1) {
          cls.push('row justify-center')
          pos = pos.split('-')[0]
        }
        cls.push(`fixed-${pos}${pos === 'left' || pos === 'right' ? ' row items-center' : ''} z-alert`)
      }
      if (this.inline) {
        cls.push('inline-block')
      }
      return cls
    },
    classes () {
      return `shadow-2 bg-${this.color}`
    },
    extstyles () {
      return this.styles
    }
  },
  methods: {
    countDown (id) {
      // debugger
      // console.log('countDown id', id)
      if (this.timeout > 0) {
        this.$nextTick(() => {
          if (this.counter > 0) {
            setTimeout(() => {
              // console.log('timeout countdown counter', this.__id, this.counter)
              this.counter--
            }, 1000)
          }
          else {
            setTimeout(() => {
              this.dismiss(null, this.__id)
              this.counter = this.timeout
            }, 2000)
          }
        })
        // console.log('display countdown id', this.__id, this.counter)
        return this.counter
      }
      // else if (this.timeout === -1 && !this.dismissible)
      //   {
      //
      // }
    },
    dismiss (fn, id) {
      this.active = false
      this.$emit('input', false)
      this.$emit('dismiss', id)
      if (typeof fn === 'function') {
        fn(id)
      }
    }
  }
}
</script>
