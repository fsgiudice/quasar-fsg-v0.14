<template>
  <div class="layout-padding">

    <div style="margin-bottom: 25px">
      <q-btn color="primary" @click="notifyAsMethod">Show Notify as Method</q-btn>
      <q-btn color="primary" @click="notifyAsMethod2">Show Notify 2 as Method</q-btn>
      <q-btn color="primary" @click="reset">Reset First 2 Notifys</q-btn>
    </div>

    <div style="margin-bottom: 25px">
      <q-btn color="primary" @click="notifyAsPath('top-left', 'bounceInDown', 'bounceOutUp')">TL</q-btn>
      <q-btn color="primary" @click="notifyAsPath('top-center', 'bounceInDown', 'bounceOutUp')">TC</q-btn>
      <q-btn color="primary" @click="notifyAsPath('top-right', 'bounceInDown', 'bounceOutUp')">TR</q-btn>
    </div>

    <div style="margin-bottom: 25px">
      <q-btn color="primary" @click="notifyAsPath('left', 'bounceInLeft', 'bounceOutLeft')">L</q-btn>
      <q-btn color="primary" @click="notifyAsPath('center', 'fadeIn', 'fadeOut')">C</q-btn>
      <q-btn color="primary" @click="notifyAsPath('right', 'bounceInRight', 'bounceOutRight')">R</q-btn>
    </div>

    <div style="margin-bottom: 25px">
      <q-btn color="primary" @click="notifyAsPath('bottom-left', 'bounceInUp', 'bounceOutDown')">BL</q-btn>
      <q-btn color="primary" @click="notifyAsPath('bottom-center', 'bounceInUp', 'bounceOutDown')">BC</q-btn>
      <q-btn color="primary" @click="notifyAsPath('bottom-right', 'bounceInUp', 'bounceOutDown')">BR</q-btn>
    </div>

    <q-notify
      color="brown"
      icon="cloud"
      enter="bounceInLeft"
      leave="bounceOutRight"
      appear
      style="margin-bottom: 1.5rem"
      v-model="visible"
      dismissible
    >
      Lorem ipsum dolor sit amet.
    </q-notify>

    <q-btn @click="visible2 = !visible2" label="Toggle HERE" />
    <q-notify
      type="negative"
      ref="destroyableNotify"
      v-model="visible2"
      dismissible
      style="margin-bottom: 1.5rem"
      :actions="[{label: 'Snooze', handler () {}}]"
    >
      Lorem ipsum dolor sit amet.
    </q-notify>

    <q-toggle v-model="diss" label="Dismiss next one" />
    <q-notify
      type="negative"
      style="margin-bottom: 1.5rem"
      dismissible
      v-model="diss"
      @dismiss="dismissed"
      :actions="actions"
    >
      No anim, dismiss test.
    </q-notify>

    <q-notify
      v-for="type in ['positive', 'info', 'negative', 'warning']"
      :key="'1_' + type"
      :color="type"
      dismissible
      style="margin-bottom: 1.5rem"
    >
      Lorem ipsum dolor sit amet.
    </q-notify>

    <q-notify
      v-for="type in ['positive', 'info', 'negative', 'warning']"
      :key="'2_' + type"
      :color="type"
      style="margin-bottom: 1.5rem"
    >
      Non dismissible. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </q-notify>
  </div>
</template>

<script>
import { Notify } from 'quasar'
// import 'quasar-extras/animate/bounceInLeft.css'
// import 'quasar-extras/animate/bounceInRight.css'
// import 'quasar-extras/animate/bounceOutRight.css'

Notify.create({html: 'Warning, warning Will Robinson!'})

export default {

  data () {
    return {
      visible: true,
      visible2: false,
      countDown: {
        id: 10
      },
      diss: true,
      actions: [{
        label: 'Snooze',
        handler () {
          console.log('dismissed')
        }
      }]
    }
  },
  methods: {
    dismissed () {
      console.log('@dismiss')
    },
    notifyAsMethod () {
      Notify.create({
        group: 1111,
        noBadge: true,
        enter: 'bounceInRight',
        leave: 'bounceOutRight',
        color: 'warning',
        icon: 'wifi',
        html: `A veryyyyyyyyyyyyyyy long text with your notify's<br><strong>awesome</strong> message`,
        styles: 'max-width: 300px;',
        position: 'top-right',
        timeout: 15,
        actions: [
          {
            label: (counter) => {
              return (counter > 0 ? 'Close in ' + counter : 'Closing now')
            },
            handler () {
              console.log('counter handler')
            }
          },
          {
            label: 'Snooze',
            handler () {
              console.log('acting')
            }
          },
          {
            label: 'Abort',
            handler () {
              console.log('aborting')
            }
          }
        ]
      })
    },
    notifyAsMethod2 () {
      Notify.create({
        group: 1212,
        enter: 'bounceInRight',
        leave: 'bounceOutRight',
        color: 'warning',
        icon: 'wifi',
        html: `A veryyyyyyyyyyyyyyy long text with your notify's<br><strong>awesome</strong> message`,
        styles: 'max-width: 300px;',
        position: 'top-right',
        timeout: 15,
        actions: [
          {
            label: (counter) => {
              return (counter > 0 ? 'Close in ' + counter : 'Closing now')
            },
            handler () {
              console.log('counter handler')
            }
          },
          {
            label: 'Snooze',
            handler () {
              console.log('acting')
            }
          },
          {
            label: 'Abort',
            handler () {
              console.log('aborting')
            }
          }
        ]
      })
    },
    notifyAsPath (position = 'top-center', enter = 'bounceInDown', leave = 'bounceOutUp') {
      Notify.create({
        // group: 1112,
        // noBadge: true,
        enter: enter,
        leave: leave,
        color: 'warning',
        icon: 'wifi',
        html: `A veryyyyyyyyyyyyyyy long text with your notify's<br><strong>awesome</strong> message`,
        styles: 'max-width: 300px;',
        position: position,
        timeout: 15,
        actions: [
          {
            label: (counter) => {
              return (counter > 0 ? 'Close in ' + counter : 'Closing now')
            },
            handler () {
              console.log('counter handler')
            }
          },
          {
            label: 'Snooze',
            handler () {
              console.log('acting')
            }
          },
          {
            label: 'Abort',
            handler () {
              console.log('aborting')
            }
          }
        ]
      })
    },
    reset () {
      this.visible = true
      this.visible2 = true
    }
  }
}
</script>
