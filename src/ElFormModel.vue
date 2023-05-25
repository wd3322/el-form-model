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
    
        <!-- before slot -->
        <slot
          :name="item.beforeSlot"
          :item="item"
          :index="index"
          :formRef="formRef"
        />

        <!-- render type -->
        <el-form-model-item
          v-if="item.type === 'render'"
          :render-content="item.renderContent"
          :item="item"
          :index="index"
          :value="data[item.prop]"
        />

        <!-- slot type -->
        <slot
          v-else-if="item.type === 'slot'"
          :name="item.prop"
          :item="item"
          :index="index"
          :formRef="formRef"
        />

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
            v-model="getFrom(item)[item.props[note[item.id] || 0]]"
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
          v-model="getFrom(item)[item.prop]"
          v-bind="getAttrs('single-result-component-item', item)"
          v-on="item.events"
        >
          <template v-if="['select', 'radio', 'checkbox'].includes(item.type) && item.options && item.id">
            <el-form-model-item-options :item="item">
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
            </el-form-model-item-options>
          </template>
        </component>

        <!-- after slot -->
        <slot
          :name="item.afterSlot"
          :item="item"
          :index="index"
          :formRef="formRef"
        />

      </el-form-item>

      <div
        v-if="$scopedSlots.between"
        class="between"
      >
        <slot
          name="between"
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
import ElFormModelItem from './components/ElFormModelItem.vue'
import ElFormModelItemOptions from './components/ElFormModelItemOptions.vue'

export default {
  name: 'ElFormModel',
  components: {
    ElFormModelItem,
    ElFormModelItemOptions
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
    getFrom(item) {
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
          ...(
            Utils.getPrototype(this.defaultAttrs.component.formItem).indexOf('function') !== -1
              ? this.defaultAttrs.component.formItem(this, item)
              : this.defaultAttrs.component.formItem
          ),
          ...item
        }
        this.clearAttrs(result)
      } else if (type === 'single-result-component-item') {
        const { input, select } = this.defaultAttrs.global.placeholder
        const appendProps = []
        const excludeProps = []
        if (['input', 'number', 'password', 'tel', 'email', 'url', 'search', 'textarea', 'autocomplete', 'select', 'cascader', 'time', 'date', 'dates', 'datetime', 'month', 'year'].includes(item.type)) {
          const tip =
            (['input', 'number', 'password', 'tel', 'email', 'url', 'search', 'textarea', 'autocomplete'].includes(item.type) || (['select'].includes(item.type) && item.remote))
              ? input
              : (['cascader', 'time', 'date', 'dates', 'datetime', 'month', 'year'].includes(item.type) || (['select'].includes(item.type) && !item.remote))
                  ? select
                  : ''
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
          ...(
            Utils.getPrototype(this.defaultAttrs.component.formItem).indexOf('function') !== -1
              ? this.defaultAttrs.component.formItem(this, item)
              : this.defaultAttrs.component.formItem
          ),
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
          (
            (['cascader', 'dates', 'checkbox'].includes(item.type) ||
            (['select'].includes(item.type) && item.multiple) ||
            (['slider'].includes(item.type) && item.range))
          ) &&
          Utils.getPrototype(this.getFrom(item)[item.prop]) !== 'array'
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
        const children = Utils.getPrototype(group.children).indexOf('function') !== -1
          ? group.children(prop, rowIndex)
          : group.children
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
        const children = Utils.getPrototype(group.children).indexOf('function') !== -1
          ? group.children(prop, rowIndex)
          : group.children
        if (Utils.getPrototype(children) === 'array') {
          const firstIndex = this.items.findIndex(item => item.type === 'group' && item.prop === prop)
          const insertIndex = firstIndex + 1 + (group.rowNumber - 1) * children.length
          this.items.splice(insertIndex, children.length)
          this.data[prop].splice(rowIndex, 1)
          group.rowNumber--
        }
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
