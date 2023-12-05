<template>
  <div class="form-model-wrap">
    <el-form
      ref="form"
      :model="data"
      :class="$attrs.inline ? 'inline' : 'block'"
      v-bind="getAttrs('form')"
      v-on="$listeners"
    >

      <!-- form item -->
      <el-form-model-item
        v-for="(item, index) of items.filter(item => item.type !== 'group' && !item.hidden)"
        v-show="$attrs.inline ? !['textarea', 'slider'].includes(item.type) : !item.labelMultiple"
        :class="{
          'inline-block': !!item.width,
          'not-label': !item.label,
          [item.className]: item.className
        }"
        :style="{ width: !$attrs.inline ? item.width : null }"
        :key="`${getProp(item)}.${index}`"
        :item="item"
        :index="index"
        :data="data"
        :note="note"
        :formRef="formRef"
        :get-prop="getProp"
        :get-form="getForm"
        :get-attrs="getAttrs"
      >
        <template
          v-for="(value, name) in $scopedSlots"
          v-slot:[name]="params"
        >
          <slot
            :name="name"
            v-bind="params"
          />
        </template>
      </el-form-model-item>

      <!-- between slot -->
      <div
        v-if="$scopedSlots.between"
        class="between"
      >
        <slot
          name="between"
          :formRef="formRef"
        />
      </div>

      <!-- button slot -->
      <el-form-item
        v-if="buttons.length > 0 || $scopedSlots.button"
        class="button"
      >
        <slot
          name="button"
          :formRef="formRef"
        >
          <div v-if="buttons.length > 0">
            <el-button
              v-for="(item, index) in buttons"
              :key="`${item.text}.${index}`"
              v-bind="getAttrs('button-item', item)"
              @click="onClickButton(item, formRef)"
            >
              {{ item.text }}
            </el-button>
          </div>
        </slot>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<script>
import {
  Form as ElForm,
  FormItem as ElFormItem,
  Button as ElButton,
  Input as ElInput,
  Autocomplete as ElAutocomplete,
  InputNumber as ElInputNumber,
  Select as ElSelect,
  Cascader as ElCascader,
  TimePicker as ElTimePicker,
  DatePicker as ElDatePicker,
  RadioGroup as ElRadioGroup,
  CheckboxGroup as ElCheckboxGroup,
  Switch as ElSwitch,
  Slider as ElSlider,
  Rate as ElRate,
  ColorPicker as ElColorPicker
} from 'element-ui'

import Utils from './utils.js'
import ElFormModelItem from './components/item.vue'

for (const prop of ['maxlength', 'minlength', 'autocomplete', 'name', 'readonly', 'max', 'min', 'step', 'autofocus', 'form']) {
  if (!ElInput.props[prop]) ElInput.props[prop] = {}
  if (!ElAutocomplete.props[prop]) ElAutocomplete.props[prop] = {}
  if (prop === 'name') {
    if (!ElInputNumber.props[prop]) ElInputNumber.props[prop] = {}
    if (!ElTimePicker.props[prop]) ElTimePicker.props[prop] = {}
    if (!ElDatePicker.props[prop]) ElDatePicker.props[prop] = {}
    if (!ElCheckboxGroup.props[prop]) ElCheckboxGroup.props[prop] = {}
    if (!ElRadioGroup.props[prop]) ElRadioGroup.props[prop] = {}
  }
}

export default {
  name: 'ElFormModel',
  components: {
    ElFormModelItem
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({})
    },
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      note: {},
      groups: [],
      formRef: {}
    }
  },
  computed: {
    attrsChange() {
      return {
        data: this.data,
        items: this.items
      }
    }
  },
  watch: {
    attrsChange: {
      handler(nVal) {
        this.setAttrs()
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.formRef = this.$refs.form
  },
  methods: {
    getProp(item) {
      return item.group ? `${item.group}.${item.rowIndex}.${item.prop}` : item.prop
    },
    getForm(item) {
      return item.group ? (this.data[item.group][item.rowIndex] || {}) : this.data
    },
    getAttrs(type, item) {
      let result = {}
      if (type === 'form') {
        result = {
          ...(
            Utils.getPrototype(this.defaultAttrs.component.form).indexOf('function') !== -1
              ? this.defaultAttrs.component.form(this)
              : this.defaultAttrs.component.form
          ),
          ...Utils.resetPropertys(this.$attrs, ElForm)
        }
      } else if (type === 'form-item') {
        result = {
          ...Utils.resetPropertys(item, ElFormItem),
          prop: this.getProp(item)
        }
      } else if (type === 'multiple-result-component-item') {
        result = {
          ...(
            Utils.getPrototype(this.defaultAttrs.component.formItem).indexOf('function') !== -1
              ? this.defaultAttrs.component.formItem(this, item)
              : this.defaultAttrs.component.formItem
          ),
          ...Utils.resetPropertys(item, ElDatePicker)
        }
      } else if (type === 'single-result-component-item') {
        result = {
          placeholder: (() => {
            if (['input', 'text', 'number', 'password', 'tel', 'email', 'url', 'search', 'textarea', 'autocomplete', 'select', 'cascader', 'time', 'date', 'dates', 'datetime', 'month', 'year'].includes(item.type)) {
              const { input, select } = this.defaultAttrs.global.placeholder
              const tip =
                (['input', 'text', 'number', 'password', 'tel', 'email', 'url', 'search', 'textarea', 'autocomplete'].includes(item.type) || (['select'].includes(item.type) && item.remote))
                  ? input
                  : (['cascader', 'time', 'date', 'dates', 'datetime', 'month', 'year'].includes(item.type) || (['select'].includes(item.type) && !item.remote))
                      ? select
                      : ''
              return item.labelMultiple
                ? tip + (item.labels[this.note[item.prop] || 0] || '')
                : tip + (item.label || '')
            } else {
              return ''
            }
          })(),
          ...(
            Utils.getPrototype(this.defaultAttrs.component.formItem).indexOf('function') !== -1
              ? this.defaultAttrs.component.formItem(this, item)
              : this.defaultAttrs.component.formItem
          ),
          ...Utils.resetPropertys(item, {
            input: ElInput,
            text: ElInput,
            number: ElInput,
            password: ElInput,
            tel: ElInput,
            email: ElInput,
            url: ElInput,
            search: ElInput,
            textarea: ElInput,
            autocomplete: ElAutocomplete,
            count: ElInputNumber,
            select: ElSelect,
            cascader: ElCascader,
            time: ElTimePicker,
            date: ElDatePicker,
            dates: ElDatePicker,
            datetime: ElDatePicker,
            month: ElDatePicker,
            year: ElDatePicker,
            radio: ElRadioGroup,
            checkbox: ElCheckboxGroup,
            switch: ElSwitch,
            slider: ElSlider,
            rate: ElRate,
            color: ElColorPicker
          }[item.type])
        }
      } else if (type === 'button-item') {
        result = {
          size: 'medium',
          ...Utils.resetPropertys(item, ElButton)
        }
      }
      return result
    },
    setAttrs() {
      this.groups = this.items.filter(item => item.type === 'group')
      for (const item of this.items) {
        // set item info
        if (['daterange', 'datetimerange', 'monthrange'].includes(item.type) || item.labelMultiple) {
          if (Utils.getPrototype(item.labels) !== 'array') {
            item.labels = []
          }
          if (Utils.getPrototype(item.props) !== 'array') {
            item.props = []
          }
          if (Utils.getPrototype(item.rules) === 'array') {
            const requiredRule = item.rules.find(rule => rule.required)
            if (requiredRule && Utils.getPrototype(requiredRule.validator).indexOf('function') === -1) {
              requiredRule.validator = (rule, value, callback) => {
                const notValue = item.props.every(prop => !this.getForm(item)[prop])
                if (notValue) {
                  callback(requiredRule.message)
                } else {
                  callback()
                }
              }
            }
          }
          if (!item.prop && item.props.length > 0) {
            item.prop = item.props.join('-')
          }
        }
        // set array data
        if (
          (
            (['cascader', 'dates', 'checkbox'].includes(item.type) ||
            (['select'].includes(item.type) && item.multiple) ||
            (['slider'].includes(item.type) && item.range))
          ) &&
          Utils.getPrototype(this.getForm(item)[item.prop]) !== 'array'
        ) {
          this.$set(this.getForm(item), item.prop, [])
        }
        // set range data
        if (
          ['daterange', 'datetimerange', 'monthrange'].includes(item.type) &&
          Utils.getPrototype(this.getForm(item)[item.prop]) !== 'array'
        ) {
          this.$set(this.getForm(item), item.prop, (() => {
            const result = []
            for (const prop of item.props || []) {
              const value = this.getForm(item)[prop]
              const hasValue = value || ![null, undefined, ''].includes(value)
              if (hasValue) {
                result.push(value)
              }
            }
            return result
          })())
        }
      }
      for (const group of this.groups) {
        // set group data
        const prop = group.prop
        const dataLength = Utils.getPrototype(this.data[prop]) === 'array' ? this.data[prop].length : 0
        if (Utils.getPrototype(group.rowNumber) !== 'number') {
          group.rowNumber = 0
        }
        if (Utils.getPrototype(this.data[prop]) !== 'array') {
          this.$set(this.data, prop, [])
        }
        if (dataLength > group.rowNumber) {
          for (let i = group.rowNumber; i < dataLength; i++) {
            this.onAddGroup(group.prop, i)
          }
        } else if (dataLength < group.rowNumber) {
          for (let i = dataLength; i < group.rowNumber; i++) {
            this.onDelGroup(group.prop, i)
          }
        }
        if (group.hasOwnProperty('hidden')) {
          const children = this.items.filter(item => item.group === group.prop && item.hidden !== group.hidden)
          for (const item of children) {
            this.$set(item, 'hidden', group.hidden || item.hidden)
          }
        }
      }
    },
    onAddGroup(prop, index) {
      const group = this.groups.find(group => group.prop === prop)
      if (group) {
        const rowIndex = Utils.getPrototype(index) === 'number' ? index : group.rowNumber
        const children = Utils.getPrototype(group.groupChildren).indexOf('function') !== -1 && group.groupChildren(prop, rowIndex)
        if (Utils.getPrototype(children) === 'array') {
          for (const child of children) {
            child.group = prop
            child.rowIndex = rowIndex
          }
          const firstIndex = this.items.findIndex(item => item.type === 'group' && item.prop === prop)
          const insertIndex = firstIndex + 1 + rowIndex * children.length
          this.items.splice(insertIndex, 0, ...children)
          if (Utils.getPrototype(index) !== 'number') {
            this.data[prop].push({})
          }
          group.rowNumber++
        }
      }
    },
    onDelGroup(prop, index) {
      const group = this.groups.find(group => group.prop === prop)
      if (group) {
        const rowIndex = Utils.getPrototype(index) === 'number' ? index : group.rowNumber
        const children = Utils.getPrototype(group.groupChildren).indexOf('function') !== -1 && group.groupChildren(prop, rowIndex)
        if (Utils.getPrototype(children) === 'array') {
          const firstIndex = this.items.findIndex(item => item.type === 'group' && item.prop === prop)
          const insertIndex = firstIndex + 1 + (group.rowNumber - 1) * children.length
          this.items.splice(insertIndex, children.length)
          this.data[prop].splice(rowIndex, 1)
          group.rowNumber--
        }
      }
    },
    onClickButton(item, formRef) {
      if (Utils.getPrototype(item.clickMethod).indexOf('function') !== -1) {
        item.clickMethod(item, formRef)
      }
    },
    onFormMethod(method, params = []) {
      this.formRef[method](...params)
    }
  }
}
</script>
