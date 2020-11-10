// 对属性进行预处理, 把px 值转换成数值
function getElementStyle(element) {
  if (!element.style) {
    element.style = {}
  }
  const { computedStyle } = element
  const regExp = /px$/
  for (let prop in element.computedStyle) {
    element.style[prop] = computedStyle[prop].value
    if (regExp.test(computedStyle[prop].value)) {
      element.style[prop] = parseInt(computedStyle[prop].value)
    }
  }

  return element.style
}
/**
 * 1. 预处理元素的属性和布局的默认值
 * 2. 收集元素进行
 *
 */

export function layout(element) {
  if (!element.computedStyle) return
  const style = getElementStyle(element)
  // 只对flex 布局下的element 做排版
  if (style.display !== 'flex') {
    return
  }

  const items = element.children.filter(e => e.type === 'element')
  const {
    'flex-direction': flexDirection = 'row',
    'align-items': alignItems = 'stretch',
    'justify-content': justifyContent = 'flex-start',
    'flex-wrap': flexWrap = 'no-warp',
    'aligin-content': alignContent = 'stretch',
  } = style

  // 主轴尺寸，开始方向，结束方向
  let mainSize,
    mainStart,
    mainEnd = ''

  let mainSign,
    crossSign = 1
  let mainBase,
    crossBase = 0
  let crossSize,
    crossStart,
    crossEnd = ''

  // 主轴为 x 轴
  if (flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1 // 坐标位置
    mainBase = 0
    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  // 此情况是 设置的flex ,但是没有设置width
  // let isAutoMainSize = false
  // // 如果没有设置mainSize, 就按照所有子元素的mainSize总和作为布局的mainSize
  // // 同时标记flag为true

  // if (!style[mainSize]) {
  //   elementStyle[mainSize] = 0
  //   for (let i = 0; i < items.length; i++) {
  //     let item = items[i]
  //     let itemStyle = getElementStyle(item)
  //     if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
  //       elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
  //     }
  //   }
  //   isAutoMainSize = true
  // }

  // 收集元素到行内
  /**
   * 根据主轴的尺寸把元素分配进行 display:flex width :500
   * 设置了no-wrap 分配到第一行
   */
  let flexLine = []
  let flexLines = [flexLine]
  // 主轴剩余空间
  let mainSpace = style[mainSize]
  // 交叉轴剩余空间
  let crossSpace = 0

  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    let itemStyle = getElementStyle(item)

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (flexWrap === 'no-warp') {
      mainSpace -= itemStyle[mainSize]
      // 求得当前flexLine交叉轴方向的最大尺寸
      if (itemStyle[crossSize]) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    } else {
      // 换行
      if (itemStyle[mainSize] > style[mainSize]) {
        // 超出父元素压缩到父元素的尺寸
        itemStyle[mainSize] = style[mainSize]
      }

      // 元素放不下放入新行
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        flexLine = [item]
        flexLines.push(flexLine)
        // 重置mainSpace 和crossSpace
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }

      mainSpace -= itemStyle[mainSize]
    }
  }

  flexLine.mainSpace = mainSpace
  flexLine.crossSpace = crossSpace

  {
    // 计算元素在主轴上的位置

    // 单行的情况下，如果存在flex 属性，则width =0,如果是其他的需要对元素进行等比压缩
    // 压缩比例 = 主轴的尺寸 / 实际能放下元素的尺寸
    const scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMainStart = 0
    if (mainSpace < 0) {
      for (let i = 0; i < items.length; i++) {
        let itemStyle = getElementStyle(items[i])

        if (itemStyle.flex) {
          itemStyle[mainSize] = 0
        }

        itemStyle[mainSize] = itemStyle[mainSize] * scale
        itemStyle[mainStart] = currentMainStart
        itemStyle[mainEnd] = itemStyle[mainStart] + itemStyle[mainSize]
        currentMainStart = itemStyle[mainEnd]
      }
    } else {
      // 多行的处理
      flexLines.forEach(flexLine => {
        // for(let i = 0; i < flexLine.length; i++){
        // }
      })
    }
  }
  //  计算元素在交叉轴上的位置

  {
    if (style[crossSize]) {
      for (let i = 0; i < items.length; i++) {
        let itemStyle = getElementStyle(items[i])
        itemStyle[crossStart] = 0
        itemStyle[crossEnd] = flexLine.crossSpace
      }
    }
  }

  // console.log(items)
}
