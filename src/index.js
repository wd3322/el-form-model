import ElFormModel from './ElFormModel.vue'
import defaultAttrs from './attrs'
import './index.scss'

const Loading = {
  install: function(Vue, attrs = {}) {
    const errorHeader = '[el-form-model error] install config'
    if (Object.prototype.toString.call(attrs) !== '[object Object]') {
      throw { message: `${errorHeader} is not a object` }
    }
    if (Object.prototype.toString.call(attrs.global) !== '[object Object]') {
      throw { message: `${errorHeader} 'global' is not a object` }
    }
    if (Object.prototype.toString.call(attrs.global.placeholder) !== '[object Object]') {
      throw { message: `${errorHeader} 'global.placeholder' is not a object` }
    }
    if (Object.prototype.toString.call(attrs.global.placeholder.input) !== '[object String]') {
      throw { message: `${errorHeader} 'global.placeholder.input' is not a string` }
    }
    if (Object.prototype.toString.call(attrs.global.placeholder.select) !== '[object String]') {
      throw { message: `${errorHeader} 'global.placeholder.select' is not a string` }
    }
    if (Object.prototype.toString.call(attrs.component) !== '[object Object]') {
      throw { message: `${errorHeader} 'component' is not a object` }
    }
    if (
      Object.prototype.toString.call(attrs.component.form) !== '[object Object]' &&
      Object.prototype.toString.call(attrs.component.form) !== '[object Function]'
    ) {
      throw { message: `${errorHeader} 'component.form' is not a object or function` }
    }
    if (
      Object.prototype.toString.call(attrs.component.formItem) !== '[object Object]' &&
      Object.prototype.toString.call(attrs.component.formItem) !== '[object Function]'
    ) {
      throw { message: `${errorHeader} 'component.formItem' is not a object or function` }
    }
    const mixin = defaultAttrs.get(attrs)
    Vue.mixin(mixin)
    Vue.component('el-form-model', ElFormModel)
  }
}

export default Loading
