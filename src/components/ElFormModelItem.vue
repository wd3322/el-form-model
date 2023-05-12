<script>
export default {
  name: 'ElFormModelItem',
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
    value: {
      required: false,
      default: ''
    },
    renderContent: {
      type: Function,
      required: true,
      default: () => {}
    }
  },
  render(createElement) {
    return this.renderContent(createElement, {
      item: this.item,
      index: this.index,
      value: this.value
    })
  }
}
</script>
