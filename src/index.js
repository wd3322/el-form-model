import Utils from './utils.js'
import ElFormModel from './ElFormModel.vue'
import DefaultAttrs from './attrs'
import './index.scss'

const Loading = {
  install(Vue, attrs = {}) {
    const errorHeader = 'el-form-model install config'
    if (Utils.getPrototype(attrs) !== 'object') {
      throw new Error(`${errorHeader} is not a object`)
    }
    if (Utils.getPrototype(attrs.global) !== 'object') {
      throw new Error(`${errorHeader} 'global' is not a object`)
    }
    if (Utils.getPrototype(attrs.global.placeholder) !== 'object') {
      throw new Error(`${errorHeader} 'global.placeholder' is not a object`)
    }
    if (Utils.getPrototype(attrs.global.placeholder.input) !== 'string') {
      throw new Error(`${errorHeader} 'global.placeholder.input' is not a string`)
    }
    if (Utils.getPrototype(attrs.global.placeholder.select) !== 'string') {
      throw new Error(`${errorHeader} 'global.placeholder.select' is not a string`)
    }
    if (Utils.getPrototype(attrs.component) !== 'object') {
      throw new Error(`${errorHeader} 'component' is not a object`)
    }
    if (!['object', 'function'].includes(Utils.getPrototype(attrs.component.form))) {
      throw new Error(`${errorHeader} 'component.form' is not a object or function`)
    }
    if (!['object', 'function'].includes(Utils.getPrototype(attrs.component.formItem))) {
      throw new Error(`${errorHeader} 'component.formItem' is not a object or function`)
    }
    const mixin = DefaultAttrs.get(attrs)
    Vue.mixin(mixin)
    Vue.component('el-form-model', ElFormModel)
  }
}

export default Loading
