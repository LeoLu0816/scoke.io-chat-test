
const cfgDefine = {
  focusZIndex: '10'
}

class MouseMoveDiv {
  /**
   * 滑鼠點擊移動, box 跟著移動
   * @param {HTMLElement} datas[].box
   * @param {Array<HTMLElement>|HTMLElement} datas[].target
   */
  constructor (datas) {
    if (!Array.isArray(datas)) datas = [datas]
    this.dom = datas.map(x => {
      return { box: x.box, target: Array.isArray(x.target) ? x.target : [x.target] }
    })
    this.unFn = []
  }

  /**
   * 執行監聽
   */
  run () {
    this.dom.forEach(dom => {
      const thisUnFn = () => {
        let isCanMove = false

        // 紀錄滑鼠移動座標
        let nowPos = { x: 0, y: 0 }

        // 點擊時, 紀錄座標(相對於box的距離)
        let offsetX = 0
        let offsetY = 0

        // [滑鼠移動]
        const onMousemove = e => {
          if (!isCanMove) return
          nowPos = { x: e.clientX || 0, y: e.clientY || 0 }
          boxMove()
        }

        // box 移動
        const boxMove = () => {
          // 預計更新之座標
          const goPos = {
            // 滑鼠位置(相對於window) + window已捲動高度(消失區高度) - 滑鼠位置(相對於box)之上偏移
            top: (nowPos.y - offsetY) || 0,
            // 滑鼠位置(相對於window) + window已捲動寬度(消失區寬度) - 滑鼠位置(相對於box)之左偏移
            left: (nowPos.x + 0 - offsetX) || 0
          }

          const limit = {
            min: { top: getMinTop(), left: getMinLeft() },
            max: { top: getMaxTop(), left: getMaxLeft() }
          }

          if (goPos.top < limit.min.top) goPos.top = limit.min.top
          if (goPos.left < limit.min.left) goPos.left = limit.min.left
          if (goPos.top > limit.max.top) goPos.top = limit.max.top
          if (goPos.left > limit.max.left) goPos.left = limit.max.left

          // update box position
          dom.box.style.top = goPos.top + 'px'
          dom.box.style.left = goPos.left + 'px'
          dom.box.style.position = 'fixed'
        }

        // [滑鼠按下] 開放移動, 並將該box提高可視索引
        const onMousedown = e => { isCanMove = true }

        // [滑鼠放開] 禁止移動
        const onMouseup = e => { isCanMove = false }

        // [滑鼠按下] 取得 滑鼠按下時 與box相對偏移量
        const onMousedownBox = e => {
          offsetX = e.offsetX
          offsetY = e.offsetY
          this.dom.forEach(d => { d.box.style.zIndex = null })
          dom.box.style.zIndex = cfgDefine.focusZIndex
        }

        // 取得 最小的 上偏移
        const getMinTop = () => { return 0 }

        // 取得 最小的 左偏移
        const getMinLeft = () => { return 0 }

        // 取得 最大的 上偏移
        const getMaxTop = () => { return window.innerHeight - dom.box.offsetHeight }

        // 取得 最大的 左偏移
        const getMaxLeft = () => {
          const windowWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth
          return windowWidth - dom.box.offsetWidth
        }

        // Add Event
        // document.addEventListener('scroll', boxMove)
        window.addEventListener('resize', boxMove)
        document.addEventListener('mouseup', onMouseup)
        document.addEventListener('mousemove', onMousemove)
        dom.box.addEventListener('mousedown', onMousedownBox)
        dom.target.forEach(x => { x.addEventListener('mousedown', onMousedown) })

        // 直接判斷顯示位置
        boxMove()

        // remove Event
        return () => {
          // document.removeEventListener('scroll', boxMove)
          window.removeEventListener('resize', boxMove)
          document.removeEventListener('onmouseup', onMouseup)
          document.removeEventListener('mousemove', onMousemove)
          dom.box.removeEventListener('mousedown', onMousedownBox)
          dom.target.forEach(x => { x.removeEventListener('onmousedown', onMousedown) })
        }
      }
      this.unFn.push(thisUnFn())
    })
  }

  /**
     * 取消監聽
     */
  destroy () {
    this.unFn.map(fn => fn())
  }
}

module.exports = MouseMoveDiv
