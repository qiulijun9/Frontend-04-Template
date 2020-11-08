import css from 'css'
const cssRules = []

/**
 *
 * [inline,id,class,tagName]
 * 优先级是由 A 、B、C、D 的值来决定的，其中它们的值计算规则如下：
 * 如果存在内联样式，那么 A = 1, 否则 A = 0;
 * B 的值等于 ID选择器 出现的次数;
 * C 的值等于 类选择器 和 属性选择器 和 伪类 出现的总次数;
 * D 的值等于 标签选择器 和 伪元素 出现的总次数
 * 比较规则是: 从左往右依次进行比较 ，较大者胜出，如果相等，则继续往右移动一位进行比较 。如果4位全部相等，则后面的会覆盖前面的
 *
 */

// 计算优先级
function computeSpecificity(element, selector) {
  const sp = [0, 0, 0, 0]
  const selectorParts = selector.split(' ')
  const inline = element.attributes.find(attr => attr.name === 'style')
  if (inline) {
    sp[0] += 1
  }
  for (let parts of selectorParts) {
    if (parts.charAt(0) === '#') {
      sp[1] += 1
    } else if (parts.charAt(0) === '.') {
      sp[2] += 1
    } else {
      sp[3] += 1
    }
  }
  return sp
}

// 比较选择器 从左往右依次比较
function compareSpecificity(sp1, sp2) {
  console.log(sp1, sp2)
  if (sp1[0] !== sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] !== sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] !== sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}

// 仅对 class,id，tagName 选择器做匹配
function matchSelector(element, selector) {
  // 是文本节点，不用做处理
  if (!selector || !element.attributes) {
    return false
  }

  const attrClass = element.attributes.find(attr => attr.name === 'class')
  const attrId = element.attributes.find(attr => attr.name === 'id')
  const selectorType = selector.charAt(0)

  if (selectorType === '#' && attrId?.value === selector.replace('#', '')) {
    return true
  }

  if (selectorType === '.' && attrClass?.value === selector.replace('.', '')) {
    return true
  }

  if (element.tagName === selector) {
    return true
  }

  return false
}

export function computeCSS(element, stack) {
  // 获取所有的元素（父元素），元素是从当前元素开始向外匹配父元素
  const elements = stack.slice().reverse()

  for (let cssRule of cssRules) {
    // 由里向外匹配css 规则  eg.['#myid','img','div','body']
    const selectorParts = cssRule.selectors[0].split(' ').reverse()

    if (!matchSelector(element, selectorParts[0])) {
      continue
    }

    let j = 1
    for (let i = 0; i < elements.length; i++) {
      // 当前元素和当前的css 是否匹配

      if (matchSelector(elements[i], selectorParts[j])) {
        j++
      }
    }

    // css规则匹配完代表 元素和css的匹配完成
    if (j >= selectorParts.length) {
      // 计算css 的优先级
      const specificity = computeSpecificity(element, cssRule.selectors[0])

      const { computedStyle } = element

      for (let declaration of cssRule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].specificity = specificity
          computedStyle[declaration.property].value = declaration.value
        } else if (
          compareSpecificity(
            computedStyle[declaration.property].specificity,
            specificity,
          ) < 0
        ) {
          computedStyle[declaration.property].specificity = specificity
          computedStyle[declaration.property].value = declaration.value
        }
      }
    }
  }
  // console.log(666, element)
}

export function addCssRules(text) {
  // ??? 如何转成ast 计算行内优先级
  const cssAst = css.parse(text)
  cssRules.push(...cssAst.stylesheet.rules)
}
