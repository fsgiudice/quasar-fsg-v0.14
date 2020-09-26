import QNotify from './QNotify.vue'
import { Vue } from '../../deps'
import extend from '../../utils/extend'

let notifyGroups = []
let notifyPosition = []
let idGroup = 0

function create (opts) {
  // console.log('opts: ', opts)

  let notifyPos = opts.position || 'top-right'

  let notify = notifyGroups.find(e => {
    return (typeof e.state.group !== 'undefined' && e.state.group === opts.group)
  })
  let state
  let node
  let mainNode

  if (notify) {
    // console.log('notify trovato: ', notify)

    state = notify.state
    node = notify.node
    state.badge++
    notify.vm.$forceUpdate()
    return
  }
  else {
    notify = {}
    notifyGroups.push(notify)
    // console.log('notify aggiunto: ', notify)

    let position = notifyPosition.find(e => {
      return (typeof e.position !== 'undefined' && e.position === notifyPos)
    })
    if (position) {
      mainNode = position.mainNode
    }
    else {
      position = {}
      notifyPosition.push(position)

      position.position = notifyPos

      mainNode = document.createElement('div')
      document.body.appendChild(mainNode)
      position.mainNode = mainNode

      // mainNode.classList.add('q-notification-list')
      // mainNode.classList.add('column')

      const
        vert = ['left', 'center', 'right'].includes(notifyPos) ? 'center' : (notifyPos.indexOf('top') > -1 ? 'top' : 'bottom'),
        align = notifyPos.indexOf('left') > -1 ? 'start' : (notifyPos.indexOf('right') > -1 ? 'end' : 'center'),
        classes = ['left', 'right'].includes(notifyPos) ? `items-${notifyPos === 'left' ? 'start' : 'end'} justify-center` : (notifyPos === 'center' ? 'flex-center' : `items-${align}`)

      let positionClass = `q-notifications-list q-notifications-list--${vert} fixed-${notifyPos.indexOf('center') > -1 ? vert : notifyPos} column no-wrap ${classes}`
      positionClass.split(' ').forEach(e => mainNode.classList.add(e))
      // console.log('mainNode.classList', mainNode.classList)
    }

    // node = document.createElement('div')
    // document.body.appendChild(node)

    node = document.createElement('div')
    mainNode.appendChild(node)

    state = extend(
      {position: notifyPos},
      opts,
      {
        group: (typeof opts.group !== 'undefined' ? opts.group : '__nogroup__' + idGroup++),
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
            padding: '2px'
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

  // console.log('notify: ', notify)

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
