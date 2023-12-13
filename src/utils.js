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
  convertHumpStr
}
