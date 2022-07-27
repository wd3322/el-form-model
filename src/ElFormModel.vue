<template>
  <div class="form-model-wrap">
    <el-form
      ref="form"
      :model="data"
      :class="$attrs.inline ? 'inline' : 'block'"
      v-bind="getAttrs('form')"
      v-on="$listeners"
    >
      <el-form-item
        v-for="(item, index) of items.filter(item => item.type !== 'group' && !item.hidden)"
        v-show="$attrs.inline ? !['textarea', 'slider'].includes(item.type) : !item.labelMultiple"
        :key="item.id"
        :class="{
          'inline-block': !!item.width,
          'not-label': !item.label,
          [item.className]: item.className
        }"
        :style="{ width: !$attrs.inline ? item.width : null }"
        v-bind="getAttrs('form-item', item)"
      >

        <div @mousedown="onActiveItemChange(item, index)">
  
          <!-- slot type -->
          <template v-if="item.type === 'slot'">
            <slot 
              :name="item.prop"
              :item="item"
              :index="index"
              :formRef="formRef"
            />
          </template>
  
          <!-- label multiple -->
          <div
            v-else-if="item.labelMultiple"
            class="input-with-dropdown"
          >
            <el-dropdown 
              placement="bottom-start"
              @command="onDropdownLabel($event, item.id, item)"
            >
              <span class="el-dropdown-link">
                {{ item.labels[note[item.id] || 0] }}
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(prop, index) in item.props"
                  :key="item.type + prop + index"
                  :command="index"
                >
                  {{ item.labels[index] }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <component
              :is="{
                input: 'el-input',
                number: 'el-input',
                password: 'el-input',
                tel: 'el-input',
                email: 'el-input',
                url: 'el-input',
                search: 'el-input',
                autocomplete: 'el-autocomplete',
                count: 'el-input-number',
                select: 'el-select',
                time: 'el-time-picker',
                date: 'el-date-picker',
                dates: 'el-date-picker',
                datetime: 'el-date-picker',
                month: 'el-date-picker',
                year: 'el-date-picker',
                radio: 'el-radio-group',
                checkbox: 'el-checkbox-group',
                switch: 'el-switch',
                rate: 'el-rate',
                color: 'el-color-picker'
              }[item.type]"
              v-model.trim="getFrom(item)[item.props[note[item.id] || 0]]"
              v-bind="getAttrs('single-result-component-item', item)"
              v-on="item.events"
            >
              <template v-if="['select', 'radio', 'checkbox'].includes(item.type) && item.options && item.id">
                <el-form-model-options :item="item">
                  <template v-slot="{ option }">
                    <span v-if="option.type === 'slot'">
                      <slot 
                        :name="option.label"
                        :label="option.label"
                        :value="option.value"
                      />
                    </span>
                    <span v-else>{{ option.label }}</span>
                  </template>
                </el-form-model-options>
              </template>
            </component>
          </div>
  
          <!-- multiple-result-component-item -->
          <component
            v-else-if="['daterange', 'datetimerange', 'monthrange'].includes(item.type)"
            :is="'el-date-picker'"
            v-model="note[item.id]"
            v-bind="getAttrs('multiple-result-component-item', item)"
            v-on="item.events"
            @change="onChangeProps($event, item)"
          />
  
          <!-- single-result-component-item -->
          <component
            v-else
            :is="{
              input: 'el-input',
              number: 'el-input',
              password: 'el-input',
              tel: 'el-input',
              email: 'el-input',
              url: 'el-input',
              search: 'el-input',
              textarea: 'el-input',
              autocomplete: 'el-autocomplete',
              count: 'el-input-number',
              select: 'el-select',
              cascader: 'el-cascader',
              time: 'el-time-picker',
              date: 'el-date-picker',
              dates: 'el-date-picker',
              datetime: 'el-date-picker',
              month: 'el-date-picker',
              year: 'el-date-picker',
              radio: 'el-radio-group',
              checkbox: 'el-checkbox-group',
              switch: 'el-switch',
              slider: 'el-slider',
              rate: 'el-rate',
              color: 'el-color-picker'
            }[item.type]"
            v-model.trim="getFrom(item)[item.prop]"
            v-bind="getAttrs('single-result-component-item', item)"
            v-on="item.events"
          >
            <template v-if="['select', 'radio', 'checkbox'].includes(item.type) && item.options && item.id">
              <el-form-model-options :item="item">
                <template v-slot="{ option }">
                  <span v-if="option.type === 'slot'">
                    <slot 
                      :name="option.label"
                      :label="option.label"
                      :value="option.value"
                    />
                  </span>
                  <span v-else>{{ option.label }}</span>
                </template>
              </el-form-model-options>
            </template>
          </component>

        </div>
 
      </el-form-item>

      <div 
        v-if="$scopedSlots.bodyBetween"
        class="body-between"
      >
        <slot 
          name="bodyBetween"
          :formRef="formRef"
        />
      </div>

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
              @click="typeof item.clickMethod === 'function' ? item.clickMethod(item, formRef) : null"
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
import $utils from './utils.js'
import ElFormModelOptions from './components/ElFormModelOptions.vue'

export default {
  name: 'ElFormModel',
  components: {
    ElFormModelOptions
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
      formRef: {},
      activeItem: {}
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
    getFrom(item) {
      return item.group ? (this.data[item.group][item.rowIndex] || {}) : this.data
    },
    getAttrs(type, item) {
      let result = {}
      if (type === 'form') {
        result = {
          ...this.defaultAttrs.component.form,
          ...this.$attrs
        }
      } else if (type === 'form-item') {
        result.prop = this.getProp(item)
        result['group-index'] = item.rowIndex
        const props = ['label', 'label-width', 'labelWidth', 'required', 'rules', 'error', 'show-message', 'showMessage', 'inline-message', 'inlineMessage', 'size']
        for (const prop of props) {
          if (item.hasOwnProperty(prop)) {
            result[prop] = item[prop]
          }
        }
      } else if (type === 'button-item') {
        result.size = 'medium'
        const props = ['size', 'type', 'plain', 'round', 'circle', 'loading', 'disabled', 'icon', 'autofocus', 'native-type', 'nativeType']
        for (const prop of props) {
          if (item.hasOwnProperty(prop)) {
            result[prop] = item[prop]
          }
        }
      } else if (type === 'multiple-result-component-item') {
        result = {
          ...(this.defaultAttrs.component[item.type] || {}),
          ...item
        }
        this.clearAttrs(result)
      } else if (type === 'single-result-component-item') {
        const { input, select } = this.defaultAttrs.global.placeholder
        const appendProps = []
        const excludeProps = []
        if (['input', 'number', 'password', 'tel', 'email', 'url', 'search', 'textarea', 'autocomplete', 'select', 'cascader', 'time', 'date', 'dates', 'datetime', 'month', 'year'].includes(item.type)) {
          const tip =
            (['input', 'number', 'password', 'tel', 'email', 'url', 'search', 'textarea', 'autocomplete'].includes(item.type) || (['select'].includes(item.type) && item.remote)) ? input :
              (['cascader', 'time', 'date', 'dates', 'datetime', 'month', 'year'].includes(item.type) || (['select'].includes(item.type) && !item.remote)) ? select : ''
          const placeholder = item.labelMultiple ? tip + (item.labels[this.note[item.id] || 0] || '') : tip + (item.label || '')
          result.placeholder = placeholder
        }
        if (['count', 'select', 'cascader', 'time', 'radio', 'checkbox', 'switch', 'slider', 'rate', 'color'].includes(item.type)) {
          appendProps.push('type')
        }
        if (['select', 'radio', 'checkbox'].includes(item.type)) {
          appendProps.push('options')
        }
        if (['cascader'].includes(item.type)) {
          excludeProps.push('props')
        }
        result = {
          ...result,
          ...(this.defaultAttrs.component[item.type] || {}),
          ...item
        }
        this.clearAttrs(result, appendProps, excludeProps)
      }
      return result
    },
    clearAttrs(result, appendProps = [], excludeProps = []) {
      const props = ['id', 'label', 'labels', 'prop', 'props', 'width', 'hidden', 'group', 'index', 'rules', 'events', ...appendProps]
      for (const prop of props) {
        if (result.hasOwnProperty(prop) && !excludeProps.includes(prop)) {
          delete result[prop]
        }
      }
    },
    setParams() {
      this.groups = this.items.filter(item => item.type === 'group')
      for (const item of this.items) { 
        // set item info
        if (!item.id) {
          item.id = (item.type || 'item') + '-' + URL.createObjectURL(new Blob()).substr(-36)
        }
        if (['daterange', 'datetimerange', 'monthrange'].includes(item.type) || item.labelMultiple) {
          if (!Array.isArray(item.labels)) {
            item.labels = []
          }
          if (!Array.isArray(item.props)) {
            item.props = []
          }
          if (Array.isArray(item.rules)) {
            const requiredRule = item.rules.find(rule => rule.required)
            if (!requiredRule.validator) {
              requiredRule.validator = (rule, value, callback) => {
                const notValue = item.props.every(prop => !this.getFrom(item)[prop])
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
          (['cascader', 'dates', 'checkbox'].includes(item.type) ||
            (['select'].includes(item.type) && item.multiple) ||
              (['slider'].includes(item.type) && item.range)) &&
                !Array.isArray(this.getFrom(item)[item.prop])
        ) {
          this.$set(this.getFrom(item), item.prop, [])
        }
        // set range data
        if (['daterange', 'datetimerange', 'monthrange'].includes(item.type)) {
          this.$set(this.note, item.id, ((item) => {
            const result = []
            for (const prop of item.props || []) {
              const value = this.getFrom(item)[prop]
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
        const dataLength = Array.isArray(this.data[prop]) ? this.data[prop].length : 0
        if (!group.rowNumber) {
          group.rowNumber = 0
        }
        if (!Array.isArray(this.data[prop])) {
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
      }
    },
    onAddGroup(prop, index) {
      const group = this.groups.find(group => group.prop === prop)
      if (group && Array.isArray(group.children)) {
        const rowIndex = typeof index === 'number' ? index : group.rowNumber
        const items = group.children.map(item => item = { ...item, group: prop, rowIndex })
        const newItems = $utils.deepClone(items)
        const firstIndex = this.items.findIndex(item => item.type === 'group' && item.prop === prop)
        const insertIndex = firstIndex + 1 + rowIndex * group.children.length
        this.items.splice(insertIndex, 0, ...newItems)
        if (typeof index !== 'number') {
          this.data[prop].push({})
        }
        group.rowNumber++
      }
    },
    onDelGroup(prop, index) {
      const group = this.groups.find(group => group.prop === prop)
      if (group && Array.isArray(group.children) && typeof index === 'number') {
        const firstIndex = this.items.findIndex(item => item.type === 'group' && item.prop === prop)
        const insertIndex = firstIndex + 1 + (group.rowNumber - 1) * group.children.length
        this.items.splice(insertIndex, group.children.length)
        this.data[prop].splice(index, 1)
        group.rowNumber--
      }
    },
    onActiveItemChange(item, index) {
      if (item.id !== this.activeItem.id) {
        this.activeItem = item
        this.$emit('active-item-change', item, index)
      }
    },
    onDropdownLabel(val, key, item) {
      item.prop = item.props[val]
      this.$set(this.note, key, val)
      for (const prop of item.props) {
        this.$delete(this.getFrom(item), prop)
      }
    },
    onChangeProps(values, item) {
      for (let i = 0; i < item.props.length; i++) {
        if (values && values[i]) {
          this.$set(this.getFrom(item), item.props[i], values[i])
        } else {
          this.$delete(this.getFrom(item), item.props[i])
        }
      }
    },
    onFormMethod(method, params = []) {
      this.formRef[method](...params)
    }
  }
}
</script>
