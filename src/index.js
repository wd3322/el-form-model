import ElFormModel from './ElFormModel.vue'
import defaultAttrs from './attrs'
import './index.scss'

const Loading = {
  install: function(Vue, attrs = {}) {
    const errorHeader = 'el-form-model install config'
    if (!attrs || typeof attrs !== 'object') {
      throw new Error(`${errorHeader} is not a object`)
    }
    if (!attrs.global || typeof attrs.global !== 'object') {
      throw new Error(`${errorHeader} 'global' is not a object`)
    }
    if (!attrs.global.placeholder || typeof attrs.global.placeholder !== 'object') {
      throw new Error(`${errorHeader} 'global.placeholder' is not a object`)
    }
    if (!attrs.global.placeholder.input || typeof attrs.global.placeholder.input !== 'string') {
      throw new Error(`${errorHeader} 'global.placeholder.input' is not a string`)
    }
    if (!attrs.global.placeholder.select || typeof attrs.global.placeholder.select !== 'string') {
      throw new Error(`${errorHeader} 'global.placeholder.select' is not a string`)
    }
    if (!attrs.component || typeof attrs.component !== 'object') {
      throw new Error(`${errorHeader} 'component' is not a object`)
    }
    if (!attrs.component.form || (typeof attrs.component.form !== 'object' && typeof attrs.component.form !== 'function')) {
      throw new Error(`${errorHeader} 'component.form' is not a object or function`)
    }
    if (!attrs.component.formItem || (typeof attrs.component.formItem !== 'object' && typeof attrs.component.formItem !== 'function')) {
      throw new Error(`${errorHeader} 'component.formItem' is not a object or function`)
    }
    const mixin = defaultAttrs.get(attrs)
    Vue.mixin(mixin)
    Vue.component('el-form-model', ElFormModel)
  }
}

export default Loading
