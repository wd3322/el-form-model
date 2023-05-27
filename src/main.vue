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
        :key="item.id"
        :item="item"
        :index="index"
        :data="data"
        :note="note"
        :formRef="formRef"
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
        class="button"
        v-if="buttons.length > 0 || $scopedSlots.button"
      >
        <slot
          name="button"
          :formRef="formRef"
        >
          <div v-if="buttons.length > 0">
            <el-button
              v-for="(item, index) in buttons"
              :key="item.text + index"
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
import Utils from './utils.js'
import ElFormModelItem from './components/item.vue'

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
    apiChange() {
      return {
        data: this.data,
        items: this.items
      }
    }
  },
  watch: {
    apiChange: {
      handler(nVal) {
        this.setParams()
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
          ...this.$attrs
        }
      } else if (type === 'form-item') {
        result = {
          ...item,
          prop: this.getProp(item)
        }
      } else if (type === 'multiple-result-component-item') {
        result = {
          ...(
            Utils.getPrototype(this.defaultAttrs.component.formItem).indexOf('function') !== -1
              ? this.defaultAttrs.component.formItem(this, item)
              : this.defaultAttrs.component.formItem
          ),
          ...item
        }
      } else if (type === 'single-result-component-item') {
        result = {
          placeholder: (() => {
            if (['input', 'number', 'password', 'tel', 'email', 'url', 'search', 'textarea', 'autocomplete', 'select', 'cascader', 'time', 'date', 'dates', 'datetime', 'month', 'year'].includes(item.type)) {
              const { input, select } = this.defaultAttrs.global.placeholder
              const tip =
                (['input', 'number', 'password', 'tel', 'email', 'url', 'search', 'textarea', 'autocomplete'].includes(item.type) || (['select'].includes(item.type) && item.remote))
                  ? input
                  : (['cascader', 'time', 'date', 'dates', 'datetime', 'month', 'year'].includes(item.type) || (['select'].includes(item.type) && !item.remote))
                      ? select
                      : ''
              return item.labelMultiple
                ? tip + (item.labels[this.note[item.id] || 0] || '')
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
          ...item
        }
      } else if (type === 'button-item') {
        result = {
          size: 'medium',
          ...item
        }
      }
      return result
    },
    setParams() {
      this.groups = this.items.filter(item => item.type === 'group')
      for (const item of this.items) {
        // set item info
        if (!item.id) {
          item.id = (item.type || 'item') + '-' + URL.createObjectURL(new Blob()).substr(-36)
        }
        if (['daterange', 'datetimerange', 'monthrange'].includes(item.type) || item.labelMultiple) {
          if (Utils.getPrototype(item.labels) !== 'array') {
            item.labels = []
          }
          if (Utils.getPrototype(item.props) !== 'array') {
            item.props = []
          }
          if (Utils.getPrototype(item.rules) === 'array') {
            const requiredRule = item.rules.find(rule => rule.required)
            if (!requiredRule.validator) {
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
          if (!item.prop && ['daterange', 'datetimerange', 'monthrange'].includes(item.type)) {
            item.prop = item.props.join('-') || item.id
          }
          if (!item.prop && item.labelMultiple) {
            item.prop = item.props[0]
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
        if (['daterange', 'datetimerange', 'monthrange'].includes(item.type)) {
          this.$set(this.note, item.id, ((item) => {
            const result = []
            for (const prop of item.props || []) {
              const value = this.getForm(item)[prop]
              const hasValue = value || ![null, undefined, ''].includes(value)
              if (hasValue) {
                result.push(value)
              }
            }
            return result
          })(item))
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
        const children = Utils.getPrototype(group.groupChildren).indexOf('function') !== -1
          ? group.groupChildren(prop, rowIndex)
          : group.groupChildren
        if (Utils.getPrototype(children) === 'array') {
          const items = children.map(item => item = { ...item, group: prop, rowIndex })
          const newItems = Utils.deepClone(items)
          const firstIndex = this.items.findIndex(item => item.type === 'group' && item.prop === prop)
          const insertIndex = firstIndex + 1 + rowIndex * children.length
          this.items.splice(insertIndex, 0, ...newItems)
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
        const children = Utils.getPrototype(group.groupChildren).indexOf('function') !== -1
          ? group.groupChildren(prop, rowIndex)
          : group.groupChildren
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