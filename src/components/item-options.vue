<template>
  <div>
    <component
      :is="{
        select: 'el-option',
        radio: 'el-radio',
        checkbox: 'el-checkbox'
      }[item.type]"
      v-for="(option, optionIndex) in item.options.filter(item => !item.hidden)"
      :key="`${getProp(item)}.${option.value}.${optionIndex}`"
      v-bind="{
        ...option,
        label: item.type === 'select' ? option.label : option.value,
        value: item.type === 'select' ? option.value : null
      }"
    >
      <slot
        :option="option"
        :index="optionIndex"
      />
    </component>
  </div>
</template>

<script>
export default {
  name: 'ElFormModelItemOptions',
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({})
    },
    getProp: {
      type: Function,
      required: true,
      default: () => ({})
    }
  }
}
</script>
