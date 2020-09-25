<template>
  <div :class="containerClass" class="q-notify-container">
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
        class="q-notify row no-wrap"
        :key="__id"
        :class="classes"
        :style="extstyles"
      >
        <div class="q-notify-icon row col-auto flex-center">
          <q-icon :name="notifyIcon"></q-icon>
        </div>
        <div v-if="badge > 1" class="q-notify-badge row col-auto flex-center">
          {{badge }}
        </div>
        <div class="q-notify-content col self-center">
          <slot></slot>
          <div
            v-if="actions && actions.length"
            class="q-notify-actions row items-center"
          >
            <span
              v-for="(btn, i) in actions"
              :key="'btn_' + i"
              @click="dismiss(btn.handler, __id)"
              v-html="htmlContent(btn,__id)"
              class="uppercase"
            ></span>
          </div>
        </div>
        <div
          v-if="dismissible"
          class="q-notify-close self-top col-auto"
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

// let _idNotify = 0
// let alerts = []

export default {
  name: 'q-notify',
  components: {
    QIcon,
    QTransition
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    value: {
      type: Boolean,
      default: true
    },
    duration: Number,
    badge: {
      type: Number,
      default: 1
    },
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
      _idNotify: 0,
      active: this.value,
      counter: this.timeout,
      lastBadge: this.badge,
      timer: null
    }
  },
  created (e) {
    // this._idNotify++
    // console.log('created', e, this)
    // alerts.push({id: _idNotify, counter: this.timeout})
  },
  beforeCreate () {
    this._idNotify++
    console.log('created', this._idNotify, this)
    // alerts.push({id: _idNotify, counter: this.timeout})
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
      let id = this.id ? 'u_' + this.id : 'a_' + this._idNotify
      console.log('__id: ', id)
      return id
    },

    notifyIcon () {
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
        cls.push(`fixed-${pos}${pos === 'left' || pos === 'right' ? ' row items-center' : ''} z-notify`)
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
  mounted () {
    let vm = this
    if (this.timeout > 0) {
      this.counter = this.timeout
      this.timer = setInterval(() => vm.countDown(), 1000)
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    htmlContent (btn) {
      if (typeof btn.label === 'function') {
        return btn.label(this.counter)
      }
      else {
        return btn.label
      }
    },
    countDown () {
      // debugger
      // console.log('countDown this.counter', this.counter)
      if (this.timeout > 0) {
        if (this.lastBadge !== this.badge) {
          this.counter = this.timeout
          this.lastBadge = this.badge
          // this.$forceUpdate()
        }

        this.$nextTick(() => {
          if (this.counter > 0) {
            this.counter--
          }
          else {
            setTimeout(() => {
              this.dismiss(null, this.__id)
              this.counter = this.timeout
            }, 2000)
          }
        })
        // console.log('display countdown id', this.__id, this.counter)
      }
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
