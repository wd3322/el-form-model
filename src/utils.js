const getPrototype = function(value) {
  return Object.prototype.toString.call(value).replace(/^\[object (\S+)\]$/, '$1').toLowerCase()
}

// const resetPropertys = function({ obj, type, keys }) {
//   const result = {}
//   for (const key in obj) {
//     if (
//       (type === 'include' && keys.includes(key)) ||
//       (type === 'exclude' && !keys.includes(key))
//     ) {
//       result[key] = obj[key]
//     }
//   }
//   return result
// }

function resetPropertys(item, component) {
  let result = {}
  if (component && component.props && typeof component.props === 'object') {
    const props = Object.keys(component.props)
    if (component.mixins && Array.isArray(component.mixins)) {
      for (const mixin of component.mixins) {
        if (mixin && mixin.props && typeof mixin.props === 'object') {
          props.push(...Object.keys(mixin.props))
        }
      }
    }
    for (const prop in item) {
      if (props.includes(convertHumpStr(prop))) {
        result[prop] = item[prop]
      }
    }
  } else {
    result = { ...item }
  }
  return result
}

const convertHumpStr = function(value, tag = '-') {
  const arr = value.split(tag)
  let result = arr[0]
  for (let i = 1; i < arr.length; i++) {
    result = result + arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1)
  }
  return result
}

export default {
  getPrototype,
  resetPropertys,
  convertHumpStr
}
