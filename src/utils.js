const getPrototype = function(value) {
  return Object.prototype.toString.call(value).replace(/^\[object (\S+)\]$/, '$1').toLowerCase()
}

const deepClone = function(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export default {
  getPrototype,
  deepClone
}
