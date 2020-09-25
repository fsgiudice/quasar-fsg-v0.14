import QNotify from './QNotify.vue'
import { Vue } from '../../deps'
import extend from '../../utils/extend'

let notifyGroups = []
// let idNotify = 0

function create (opts) {
  console.log('opts: ', opts)

  let notify = notifyGroups.find(e => {
    return e.state.id === opts.id
  })
  let state
  let node

  if (notify) {
    console.log('notify trovato: ', notify)

    state = notify.state
    node = notify.node
    state.badge++
    notify.vm.$forceUpdate()
    return
  }
  else {
    notify = {}
    notifyGroups.push(notify)
    console.log('notify aggiunto: ', notify)

    node = document.createElement('div')
    document.body.appendChild(node)

    state = extend(
      {position: 'top-right'},
      opts,
      {
        // id: idNotify++,
        badge: 1,
        value: true,
        appear: true,
        dismissible: !opts.actions || !opts.actions.length
      }
    )

    notify.state = state
    notify.node = node
  }

  const vm = new Vue({
    functional: true,
    render (h, ctx) {
      const on = {}
      on[opts.leave === void 0 ? 'dismiss' : 'dismiss-end'] = () => {
        const index = notifyGroups.indexOf(notify)
        if (index !== -1) {
          notifyGroups.splice(index, 1)
        }
        vm.$destroy()
        vm.$el.parentNode.removeChild(vm.$el)
        if (opts.onDismiss) {
          opts.onDismiss()
        }
      }

      return h(
        QNotify,
        {
          style: {
            padding: '18px'
          },
          on,
          props: state
        },
        [
          h('span', {
            domProps: {
              innerHTML: opts.html
            }
          })
        ]
      )
    }
  })

  notify.vm = vm

  console.log('notify: ', notify)

  vm.$mount(node)

  return {
    dismiss () {
      state.value = false
      vm.$forceUpdate()
    }
  }
}

export default {
  create
}
