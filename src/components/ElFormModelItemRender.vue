<script>
export default {
  name: 'ElFormModelItemRender',
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
    const content = this.renderContent(createElement, {
      item: this.item,
      index: this.index,
      value: this.value
    })
    return content
  }
}
</script>
