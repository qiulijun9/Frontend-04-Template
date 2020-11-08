// 对属性进行预处理
function getElementStyle(element) {
  if (!element.style) {
    element.style = {}
  }

  for (let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value

    if (element.computedStyle[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.computedStyle[prop].value)
    }
  }
  return element.style
}

export function layout(element) {
  if (!element.computedStyle) {
    return
  }
  const elementStyle = getElementStyle(element)

  // 只处理flex 布局
  if (!elementStyle.display === 'flex') {
    return
  }
  const style = elementStyle

  //过滤文本节点
  const items = element.children.filter(e => e.type === 'element')

  // 处理主轴和交叉轴

  ;[('width', 'height')].forEach(size => {
    if (style[size] === '' || style[size] === 'auto') {
      style[size] = null
    }
  })

  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row'
  }

  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start'
  }
  if (!style.aliginItems || style.aliginItems === 'auto') {
    style.aliginItems = 'stretch'
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap'
  }

  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase

  if (style.flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1
    mainBase = 0
    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width
    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'cloumn') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0
    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'rigth'
  }

  // 只有. flexWrap 决定了交叉轴的方向
  // 如果是反向的，则交叉轴起止方向应该要调换
  if (style.flexWrap === 'wrap-reverse') {
    let temp = crossStart
    crossStart = crossEnd
    crossEnd = temp
    crossSign = -1
    crossBase = style[crossSize]
  } else {
    // 否则默认情况下，crossBase都是0， 且都是从左到右或者从上到下的，sign也为+1
    crossBase = 0
    crossSign = +1
  }

  // 若父元素没有设置尺寸，由子元素撑开
  let isAutoMainSize = false
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0
    for (let i = 0; i < items.length; i++) {
      let itemStyle = getElementStyle(items[i])
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize] += itemStyle[mainSize]
      }
    }
    isAutoMainSize = true
  }

  const flexLine = []
  const flexLines = [flexLine]

  // 剩余空间
  let mainSpace = elementStyle[mainSize]
  let crossSpace = 0

  for (let i = 0; i < items.length; i++) {
    let itemStyle = getElementStyle(items[i])

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) {
      flexLine.push(items[i])
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainBase -= itemStyle[mainSpace]
      //  行，行高,去最大的行高
      if (itemStyle[crossSize] !== null) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(items[i])
    } else {
      // 元素的尺寸特别大，大于主轴尺寸时
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }

      // 一行放不下式
      if (itemStyle[mainSize] < style[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = style(mainSpace)
        crossSpace = 0
      } else {
        flexLine.push(item)
      }
      if (itemStyle[crossSize] !== null || itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      mainSpace -= itemStyle[mainSize]
    }
  }

  flexLine.mainSpace = mainSpace
  console.log(items)

  // 主轴
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = style[crossSize] ? style[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  // 对主轴的size 进行等比压缩

  if (mainSpace < 0) {
  }
}
