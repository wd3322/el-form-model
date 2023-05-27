<template>
  <el-form-item v-bind="getAttrs('form-item', item)">

    <!-- before slot -->
    <slot
      :name="item.beforeSlot"
      :item="item"
      :index="index"
      :formRef="formRef"
    />

    <!-- render type -->
    <render
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
        size="medium"
        placement="bottom-start"
        :show-timeout="50"
        :hide-timeout="50"
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
        v-model="getForm(item)[item.props[note[item.id] || 0]]"
        v-bind="getAttrs('single-result-component-item', item)"
        v-on="item.events"
      >
        <options
          v-if="['select', 'radio', 'checkbox'].includes(item.type) && item.options && item.id"
          :item="item"
        >
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
        </options>
      </component>
    </div>

    <!-- multiple result component item -->
    <component
      v-else-if="['daterange', 'datetimerange', 'monthrange'].includes(item.type)"
      :is="'el-date-picker'"
      v-model="note[item.id]"
      v-bind="getAttrs('multiple-result-component-item', item)"
      v-on="item.events"
      @change="onChangeProps($event, item)"
    />

    <!-- single result component item -->
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
      v-model="getForm(item)[item.prop]"
      v-bind="getAttrs('single-result-component-item', item)"
      v-on="item.events"
    >
      <options
        v-if="['select', 'radio', 'checkbox'].includes(item.type) && item.options && item.id"
        :item="item"
      >
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
      </options>
    </component>

    <!-- after slot -->
    <slot
      :name="item.afterSlot"
      :item="item"
      :index="index"
      :formRef="formRef"
    />

  </el-form-item>
</template>

<script>
import ElFormModelItemRender from './item-render.vue'
import ElFormModelItemOptions from './item-options.vue'

export default {
  name: 'ElFormModelItem',
  components: {
    Render: ElFormModelItemRender,
    Options: ElFormModelItemOptions
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({})
    },
    index: {
      type: Number,
      required: true,
      default: 0
    },
    data: {
      type: Object,
      required: true,
      default: () => ({})
    },
    note: {
      type: Object,
      required: true,
      default: () => ({})
    },
    formRef: {
      type: Object,
      required: true,
      default: () => ({})
    },
    getForm: {
      type: Function,
      required: true,
      default: () => {}
    },
    getAttrs: {
      type: Function,
      required: true,
      default: () => {}
    }
  },
  methods: {
    onDropdownLabel(val, key, item) {
      item.prop = item.props[val]
      this.$set(this.note, key, val)
      for (const prop of item.props) {
        this.$delete(this.getForm(item), prop)
      }
    },
    onChangeProps(values, item) {
      for (let i = 0; i < item.props.length; i++) {
        if (values && values[i]) {
          this.$set(this.getForm(item), item.props[i], values[i])
        } else {
          this.$delete(this.getForm(item), item.props[i])
        }
      }
    }
  }
}
</script>
