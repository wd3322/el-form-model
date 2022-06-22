const nowOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate()
}

const nowadays = new Date(nowOptions.year, nowOptions.month, nowOptions.day, 23, 59, 59)

const dateRangeOptions = {
  shortcuts: [{
    text: '今天',
    onClick: (picker) => {
      const start = new Date(this.now.year, this.now.month, this.now.day)
      const end = nowadays
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近七天',
    onClick: (picker) => {
      const start = new Date(this.now.year, this.now.month, this.now.day - 7)
      const end = nowadays
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick: (picker) => {
      const start = new Date(this.now.year, this.now.month - 1, this.now.day)
      const end = nowadays
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick: (picker) => {
      const start = new Date(this.now.year, this.now.month - 3, this.now.day)
      const end = nowadays
      picker.$emit('pick', [start, end])
    }
  }]
}

const monthRangeOptions = {
  shortcuts: [{
    text: '本月',
    onClick: (picker) => {
      const start = new Date(this.now.year, this.now.month, 1)
      const end = nowadays
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '今年至今',
    onClick: (picker) => {
      const start = new Date(this.now.year, 0, 1)
      const end = nowadays
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近六个月',
    onClick: (picker) => {
      const start = new Date(nowOptions.year, nowOptions.month - 6, nowOptions.day)
      const end = nowadays
      picker.$emit('pick', [start, end])
    }
  }]
}

const attrs = {
  global: {
    placeholder: {
      input: '请输入',
      select: '请选择'
    }
  },
  component: {
    form: {},
    input: {
      clearable: true
    },
    autocomplete: {
      clearable: true
    },
    select: {
      clearable: true
    },
    cascader: {},
    date: {},
    dates: {},
    datetime: {},
    month: {},
    year: {},
    daterange: {
      unlinkPanels: true,
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      defaultTime: ['00:00:00', '23:59:59'],
      daterange: dateRangeOptions
    },
    datetimerange: {
      unlinkPanels: true,
      rangeSeparator: '至',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      datetimerange: dateRangeOptions
    },
    monthrange: {
      unlinkPanels: true,
      rangeSeparator: '至',
      startPlaceholder: '开始月份',
      endPlaceholder: '结束月份',
      defaultTime: ['00:00:00', '23:59:59'],
      monthrange: monthRangeOptions
    },
    time: {},
    radio: {},
    checkbox: {},
    count: {},
    switch: {},
    slider: {},
    rate: {},
    color: {}
  }
}

const get = ({ global, component }) => {
  return {
    data () {
      return { 
        defaultAttrs: {
          global: {
            ...attrs.global,
            ...global
          },
          component: {
            ...attrs.component,
            ...component
          }
        }
      }
    }
  }
}

export default { get }