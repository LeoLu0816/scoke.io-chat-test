/* global DEBUG FileReader */

import BScroll from 'better-scroll'
import MouseMoveDiv from './libs/MouseMoveDiv.js'
let components = {}

const BScrollConfig = {
  scrollX: false,
  scrollY: true,
  mouseWheel: {
    speed: 20,
    invert: false,
    easeTime: 300
  }
  // scrollbar: {
  //   fade: true,
  //   interactive: false // 1.8.0 新增
  // }
}

module.exports = {
  filters: {
    toDate (time) {
      // return new Date(time).toLocaleTimeString("en").substr(0, 5);
      return new Intl.DateTimeFormat('en', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date(time))
    }
  },
  components,
  data () {
    return {
      bigImage: '', // 圖片URL
      showBigImg: false, // 大圖顯示
      DEBUG,
      rooms: [],
      isLogin: false,
      now: {
        roomid: '',
        roomName: ''
      },
      msgHistory: [],
      newUser: null,
      mySelectImgURI: {
        R0000: '',
        R0001: ''
      },
      fileSelectRoom: '',
      myMsg: {
        R0000: '',
        R0001: ''
      },
      isOpen: {
        chatSelect: false,
        customerService: false,
        upperLayer: false
      },
      BScroll: {
        customerMsgList: null,
        upperLayerMsgList: null
      },
      MouseMoveDiv: {
        customerService: null,
        upperLayer: null
      }
    }
  },
  computed: {
    isConnected () {
      return this.socket.connected
    },
    nowRoomMsg () {
      return this.msgHistory.filter(x => x.roomid === this.now.roomid)
    },
    getCustomerServiceMsgs () {
      return this.msgHistory.filter(x => x.roomid === 'R0000').map(x => {
        return Object.assign(x, { isMy: x.userid === this.userData.userid })
      })
    },
    getUpperLayerMsgs () {
      return this.msgHistory.filter(x => x.roomid === 'R0001').map(x => {
        return Object.assign(x, { isMy: x.userid === this.userData.userid })
      })
    },
    bigImageUrl () {
      return this.bigImage
    }
  },
  watch: {
    getCustomerServiceMsgs (val, oldVal) {
      if (val.length < 1 || val.length === oldVal.length) return
      this.$nextTick(() => {
        let myBs = this.BScroll['customerMsgList']
        if (myBs === null) {
          this.BScroll['customerMsgList'] = new BScroll(
            this.$refs['customerMsgList'],
            BScrollConfig
          )
          myBs = this.BScroll['customerMsgList']
        } else {
          myBs.refresh()
          myBs.scrollTo(0, myBs.maxScrollY)
        }
      })
    },
    getUpperLayerMsgs (val, oldVal) {
      if (val.length < 1 || val.length === oldVal.length) return
      this.$nextTick(() => {
        let myBs = this.BScroll['upperLayerMsgList']
        if (myBs === null) {
          this.BScroll['upperLayerMsgList'] = new BScroll(
            this.$refs['upperLayerMsgList'],
            BScrollConfig
          )
          myBs = this.BScroll['upperLayerMsgList']
        }
        myBs.refresh()
        myBs.scrollTo(0, myBs.maxScrollY)
      })
    }
  },
  methods: {
    login () {
      this.socket.emit('user_connect', this.userData)
    },
    sendMsg (roomid) {
      if (!this.myMsg[roomid] && !this.mySelectImgURI[roomid]) return false
      this.socket.emit('message', {
        roomid,
        userid: this.userData.userid,
        msg: this.myMsg[roomid],
        img: this.mySelectImgURI[roomid]
      })
      this.fileSelectRoom = ''
      this.mySelectImgURI[roomid] = ''
      this.myMsg[roomid] = ''
    },
    showCustomerService () {
      this.isOpen.customerService = !this.isOpen.customerService
      if (this.isOpen.customerService) {
        this.$nextTick(() => {
          this.$refs['customerMsgList'].focus()
          const myBs = this.BScroll['customerMsgList']
          if (myBs) {
            myBs.refresh()
            myBs.scrollTo(0, myBs.maxScrollY)
          }
        })
      }
    },
    showUpperLayer () {
      this.isOpen.upperLayer = !this.isOpen.upperLayer
      if (this.isOpen.upperLayer) {
        this.$nextTick(() => {
          this.$refs['upperLayerMsgList'].focus()
          const myBs = this.BScroll['upperLayerMsgList']
          if (myBs) {
            myBs.refresh()
            myBs.scrollTo(0, myBs.maxScrollY)
          }
        })
      }
    },
    selectImg (roomid) {
      this.fileSelectRoom = roomid
      this.$refs['myFileInput'].click()
    },
    handleFiles (e) {
      const files = e.target.files
      if (!files.length) return false

      const roomid = '' + this.fileSelectRoom
      this.fileSelectRoom = ''

      const imageType = /image.*/
      const file = files[0]
      if (!file.type.match(imageType)) { return }

      const reader = new FileReader()
      reader.onload = e => { this.mySelectImgURI[roomid] = e.target.result }
      reader.readAsDataURL(file)

      this.$refs['myFileInput'].value = ''
    },
    setBigImg (imgUrl) {
      this.bigImage = imgUrl
      this.showBigImg = true
    }
  },
  mounted () {
    const socket = this.socket

    socket.on('connect_success', (data, msgHistory) => {
      if (data.userid === this.userData.userid) {
        this.isLogin = true
        this.msgHistory = Array.isArray(msgHistory) ? msgHistory : []
      }
    })

    socket.on('userJoin', data => {
      this.newUser = data
    })

    socket.on('message', data => {
      this.msgHistory.push(data)
    })

    this.login()

    // 觸發套件 -> 視窗拖曳
    const eData = [
      {
        box: document.querySelectorAll('.chat-customer-service')[0],
        target: document.querySelectorAll('.chat-customer-service > .chat-box > .title')[0]
      },
      {
        box: document.querySelectorAll('.chat-upper-layer')[0],
        target: document.querySelectorAll('.chat-upper-layer > .chat-box > .title')[0]
      }
    ]

    this.MouseMoveDiv = new MouseMoveDiv(eData)
    this.MouseMoveDiv.run()
  },
  destroyed () {
    this.MouseMoveDiv.destroy()
  }
}
