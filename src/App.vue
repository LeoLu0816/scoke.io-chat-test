<!-- 頁面入口點 -->
<template lang="pug">
  #chat-sys-box
    .main-box(v-if="isConnected")
      .chat-menu-box
        .menu-btn
          button(type="button" @click="isOpen.chatSelect=!isOpen.chatSelect") 
            span 聊天室
            br
            span CHATTING
          .chat-select-box(v-if="isOpen.chatSelect")
            button.select-btn(type="button" @click="showCustomerService()")
              i.iconfont.iconcustomer
              span 房間一
            button.select-btn(type="button" @click="showUpperLayer()")
              i.iconfont.iconupper
              span 房間二
    .chat-customer-service(v-show="isOpen.customerService" @keyup.esc="isOpen.customerService=false")
      .chat-box
        .title 
          p 房間一 
          button(@click="showCustomerService()")
            i.iconfont.iconclose
        #customer-msg.msg-list(ref="customerMsgList")
          .inner-list
            .msg-item(v-for="(item,index) in getCustomerServiceMsgs" :key="index" :class="{ 'is-my': item.isMy }")
              .from {{ item.userName }}
              .msg 
                p {{ item.msg }}
                .img.showBigImage(v-if="item.img" @click="setBigImg(item.img)")
                  img(:src="item.img")
              .time {{ item.date | toDate }}
        .input
          .sendMultimedia
            button
              i.iconfont.iconsmile
            button(type="button" @click="selectImg('R0000')")
              i.iconfont.iconimage1
          .sengImg(v-if="mySelectImgURI.R0000")
            .inner_img
              img(:src="mySelectImgURI.R0000")
              .icon(@click='mySelectImgURI.R0000 = ""')
                i.iconfont.iconclose1
          .sendMsg
            input(type="text" v-model="myMsg.R0000" @keyup.enter="sendMsg('R0000')" placeholder="請輸入文字" :disabled="!isConnected")
            button(@click="sendMsg('R0000')") 
              span 發送
              br
              span ENTER 
    .chat-upper-layer(v-show="isOpen.upperLayer" @keyup.esc="isOpen.upperLayer=false")
      .chat-box
        .title
          p 房間二
          button(@click="showUpperLayer()")
            i.iconfont.iconclose
        #upper-msg.msg-list(ref="upperLayerMsgList")
          .inner-list
            .msg-item(v-for="(item,index) in getUpperLayerMsgs" :key="index" :class="{ 'is-my': item.isMy }")
              .from {{ item.userName }}
              .msg 
                p {{ item.msg }}
                .img.showBigImage(v-if="item.img" @click="setBigImg(item.img)")
                  img(:src="item.img")
              .time {{ item.date | toDate }}
        .input
          .sendMultimedia
            button
              i.iconfont.iconsmile
            button(type="button" @click="selectImg('R0001')")
              i.iconfont.iconimage1
          .sengImg(v-if="mySelectImgURI.R0001")
            .inner_img
              img(:src="mySelectImgURI.R0001")
              .icon(@click='mySelectImgURI.R0001 = ""')
                i.iconfont.iconclose1
          .sendMsg
            input(type="text" v-model="myMsg.R0001" @keyup.enter="sendMsg('R0001')" placeholder="請輸入文字" :disabled="!isConnected")
            button(@click="sendMsg('R0001')")
              span 發送
              br
              span ENTER 
    input(type="file" accept="image/*" style="display:none" ref="myFileInput" @input="handleFiles")
    .Mask(v-if="showBigImg" @click="showBigImg=false")
    transition(name="bigImg")
      .bigImage(v-if="showBigImg" @click="showBigImg=false")
        .imgBox(ref="bigImageBox" @click.stop="")
          img(:src="bigImage")
          button(@click='showBigImg = false')
            i.iconfont.iconclose1
</template>

<script src="./App.js"></script>

<style lang="sass">
@import './assets/font/iconfont.css'
@import './sass/index.sass'
</style>