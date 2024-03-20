<template>
  <el-form-item v-bind="getAttrs('form-item', item)">

    <!-- label slot -->
    <template
      v-if="item.labelSlot"
      v-slot:label
    >
      <slot
        :name="item.labelSlot"
        :item="item"
        :index="index"
        :formRef="formRef"
      />
    </template>

    <!-- before slot -->
    <slot
      v-if="item.beforeSlot"
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
      :value="getForm(item)[item.prop]"
    />

    <!-- slot type -->
    <slot
      v-else-if="item.type === 'slot'"
      :name="item.defaultSlot || item.prop"
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
        @command="onDropdownLabel($event, item.prop, item)"
      >
        <span class="el-dropdown-link">
          {{ item.labels[note[item.prop] || 0] }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <template v-slot:dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(prop, propIndex) in item.props"
              :key="`${prop}.${propIndex}`"
              :command="propIndex"
            >
              {{ item.labels[propIndex] }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <component
        :is="{
          input: 'el-input',
          text: 'el-input',
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
        v-model="getForm(item)[item.props[note[item.prop] || 0]]"
        v-bind="getAttrs('single-result-component-item', item)"
        v-on="item.events"
      >
        <options
          v-if="['select', 'radio', 'checkbox'].includes(item.type) && item.options"
          :item="item"
          :get-prop="getProp"
        >
          <template v-slot="{ option }">
            <slot
              v-if="option.type === 'slot'"
              :name="option.label"
              :label="option.label"
              :value="option.value"
            />
            <template v-else>{{ option.label }}</template>
          </template>
        </options>
      </component>
    </div>

    <!-- multiple result component item -->
    <component
      v-else-if="['daterange', 'datetimerange', 'monthrange'].includes(item.type)"
      :is="'el-date-picker'"
      v-model="getForm(item)[item.prop]"
      v-bind="getAttrs('multiple-result-component-item', item)"
      v-on="item.events"
      @change="onChangeProps($event, item)"
    />

    <!-- single result component item -->
    <component
      v-else
      :is="{
        input: 'el-input',
        text: 'el-input',
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
        v-if="['select', 'radio', 'checkbox'].includes(item.type) && item.options"
        :item="item"
        :get-prop="getProp"
      >
        <template v-slot="{ option, index }">
          <span v-if="option.slot">
            <slot
              :name="option.slot"
              :option="option"
              :index="index"
              :formRef="formRef"
            />
          </span>
          <span v-else>{{ option.label }}</span>
        </template>
      </options>
    </component>

    <!-- after slot -->
    <slot
      v-if="item.afterSlot"
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
    getProp: {
      type: Function,
      required: true,
      default: () => ({})
    },
    getForm: {
      type: Function,
      required: true,
      default: () => ({})
    },
    getAttrs: {
      type: Function,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    onDropdownLabel(val, key, item) {
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
