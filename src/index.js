import ElFormModel from './ElFormModel.vue'
import defaultAttrs from './attrs'
import './index.scss'

const Loading = {
  install: function(Vue, attrs = {}) {
    const errorHeader = '[el-form-model error] install config'
    if (!attrs || typeof attrs !== 'object') {
      throw { message: `${errorHeader} is not a object` }
    }
    if (!attrs.global || typeof attrs.global !== 'object') {
      throw { message: `${errorHeader} 'global' is not a object` }
    }
    if (!attrs.global.placeholder || typeof attrs.global.placeholder !== 'object') {
      throw { message: `${errorHeader} 'global.placeholder' is not a object` }
    }
    if (!attrs.global.placeholder.input || typeof attrs.global.placeholder.input !== 'string') {
      throw { message: `${errorHeader} 'global.placeholder.input' is not a string` }
    }
    if (!attrs.global.placeholder.select || typeof attrs.global.placeholder.select !== 'string') {
      throw { message: `${errorHeader} 'global.placeholder.select' is not a string` }
    }
    if (!attrs.component || typeof attrs.component !== 'object') {
      throw { message: `${errorHeader} 'component' is not a object` }
    }
    if (!attrs.component.form || (typeof attrs.component.form !== 'object' && typeof attrs.component.form !== 'function')) {
      throw { message: `${errorHeader} 'component.form' is not a object or function` }
    }
    if (!attrs.component.formItem || (typeof attrs.component.formItem !== 'object' && typeof attrs.component.formItem !== 'function')) {
      throw { message: `${errorHeader} 'component.formItem' is not a object or function` }
    }
    const mixin = defaultAttrs.get(attrs)
    Vue.mixin(mixin)
    Vue.component('el-form-model', ElFormModel)
  }
}

export default Loading
