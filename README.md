# Vue Element Form To Json

### Git地址

[Github](https://github.com/wd3322/el-form-model)

[Gitee](https://gitee.com/wd3322/el-form-model)

![el-form-model](https://wd3322.gitee.io/to-vue3/img/el-form-model/form-demo.png)

### 行内
![inline](https://wd3322.gitee.io/to-vue3/img/el-form-model/form-inline.gif)
### 布局
![layout](https://wd3322.gitee.io/to-vue3/img/el-form-model/form-layout.png)
### 分组
![group](https://wd3322.gitee.io/to-vue3/img/el-form-model/form-group.gif)

---

## 下载
```
npm install el-form-model
```

---

## 引用
在 main.js 中写入以下内容，请使用 `element-ui v2.15.X` 以上版本

```javascript
import Vue from 'vue'
import ElementUI from 'element-ui'
import ElFormModel from 'el-form-model'
import 'element-ui/lib/theme-chalk/index.css'
import 'el-form-model/lib/index.css'

Vue.use(ElementUI)
Vue.use(ElFormModel)
```

---

### 引用-默认参数（可选）
```javascript
Vue.use(ElFormModel, {
  global: {
    placeholder: {
      input: '请输入',
      select: '请选择'
    }
  },
  component: {
    form(ctx){
      return {
        size: 'medium'
      }
    },
    formItem(ctx, item) {
      if (['input', 'autocomplete', 'select'].includes(item.type)) {
        return {
          clearable: true
        }
      } else if (item.type === 'daterange') {
        return {
          unlinkPanels: true,
          rangeSeparator: '至',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          defaultTime: ['00:00:00', '23:59:59']
        }
      } else if (item.type === 'datetimerange') {
        return {
          unlinkPanels: true,
          rangeSeparator: '至',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          defaultTime: ['00:00:00', '23:59:59']
        }
      } else if (item.type === 'monthrange') {
        return {
          unlinkPanels: true,
          rangeSeparator: '至',
          startPlaceholder: '开始月份',
          endPlaceholder: '结束月份',
          defaultTime: ['00:00:00', '23:59:59']
        }
      } else {
        return {}
      }
    }
  }
})
```

---

# 组件

### 组件-基础
创建第一个 `el-form-model` 实例

```html
<template>
  <el-form-model
    ref="myForm"
    :data="data"
    :items="items"
  />
</template>
```

```javascript
export default {
  data() {
    return {
      data: { // 详见数据章节
        myInput: 'apple',
        mySelect: 0
      }, 
      items: [{ // 详见数据章节
        label: '输入框',
        prop: 'myInput',
        type: 'input'
      }, {
        label: '下拉框',
        prop: 'mySelect',
        type: 'select',
        options: [
          { label: '选项1', value: 0 },
          { label: '选项2', value: 1 }
        ]
      }] 
    }
  }
}
```

| Prop     | Type     | Required |
| :------- | :------- | :------- |
| data     | Object   | True     |
| items    | Array    | True     |

---

### 组件-行内
可通过 `inline` 属性设置行内表单模式

```html
<template>
  <el-form-model
    ref="myForm"
    :inline="true"
    :data="data"
    :items="items"
  />
</template>
```

---

### 组件-列宽
可通过 `label-width` 属性设置表单域标签的宽度

```html
<template>
  <el-form-model
    ref="myForm"
    label-width="100px"
    :inline="false"
    :data="data"
    :items="items"
  />
</template>
```

---

### 组件-继承表单属性
可继承 `Form` 表单组件属性（Element Form Attributes）

```html
<template>
  <el-form-model
    ref="myForm"
    label-width="100px"
    :inline="false"
    :hide-required-asterisk="true"
    :show-message="true"
    :inline-message="true"
    :data="data"
    :items="items"
  />
</template>
```

---

### 组件-继承表单事件
可继承 `Form` 表单组件事件（Element Form Events）

```html
<template>
  <el-form-model
    ref="myForm"
    label-width="100px"
    :inline="false"
    :data="data"
    :items="items"
    @validate="onValidate"
  />
</template>
```

---

### 组件-执行表单方法
可执行 `Form` 表单组件方法（Element Form Methods）

```javascript
export default {
  methods: {
    setForm() {
      this.$refs.myForm.onFormMethod('validate', [valid => {
        console.log('validate', valid)
      }])
    }
  }
}
```
或
```javascript
export default {
  methods: {
    setForm() {
      this.$refs.myForm.$refs.form.validate(valid => {
        console.log('validate', valid)
      })
    }
  }
}
```

---

# 数据

### 数据-默认值、类型
可通过 `type` 属性设置表单子项组件类型

```html
<template>
  <el-form-model
    ref="myForm"
    label-width="100px"
    :inline="false"
    :data="data"
    :items="items"
  />
</template>
```

```javascript
export default {
  data() {
    return {
      data: {
        myInput: 'apple',
        myAutocomplete: 'banana',
        mySelect: 0,
        myCascader: ['zhinan', 'shejiyuanze'],
        myTime: 1628072756566,
        myDate: '2020-01-01',
        myDates: ['2020-01-01', '2020-01-02'],
        myDatetime: 1628072756566,
        myMonth: '2020-01',
        myYear: '2020',
        myDateRangeStart: '2020-01-01',
        myDateRangeEnd: '2020-12-31',
        myDatetimeRangeStart: 1628072756566,
        myDatetimeRangeEnd: 1688072756566,
        myMonthRangeStart: '2020-01',
        myMonthRangeEnd: '2020-12',
        myTextarea: 'orange',
        myRadio: 1,
        myCheckbox: [0, 1],
        myCount: 3,
        mySwitch: true,
        mySlider: 56,
        myRate: 5
      },
      items: [{ 
        label: '输入框',
        prop: 'myInput',
        type: 'input' // input,number,password,tel,email,url,search
      }, {
        labels: ['输入框1', '输入框2', '输入框3'], // 仅行内表单生效
        props: ['myInput1', 'myInput2', 'myInput3'],
        type: 'input', // input,number,password,tel,email,url,search,autocomplete,count,select,time,date,dates,datetime,month,year,radio,checkbox,switch,rate,color
        labelMultiple: true
      }, { 
        label: '自动补全',
        prop: 'myAutocomplete',
        type: 'autocomplete',
        fetchSuggestions: (val, callback) => {
          callback([
            { value: '选项1' },
            { value: '选项2' }
          ])
        }
      }, {
        label: '下拉框',
        prop: 'mySelect',
        type: 'select',
        options: [
          { label: '选项1', value: 0 },
          { label: '选项2', value: 1 }
        ]
      }, {
        label: '级联选择器',
        prop: 'myCascader',
        type: 'cascader',
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则'
          }]
        }]
      }, {
        label: '时间',
        prop: 'myTime',
        type: 'time',
        valueFormat: 'timestamp'
      }, {
        label: '日期',
        prop: 'myDate',
        type: 'date',
        valueFormat: 'yyyy-MM-dd'
      }, {
        label: '多个日期',
        prop: 'myDates',
        type: 'dates',
        valueFormat: 'yyyy-MM-dd'
      }, {
        label: '日期时间',
        prop: 'myDatetime',
        type: 'datetime',
        valueFormat: 'timestamp'
      }, {
        label: '月份',
        prop: 'myMonth',
        type: 'month',
        valueFormat: 'yyyy-MM'
      }, {
        label: '年份',
        prop: 'myYear',
        type: 'year',
        valueFormat: 'yyyy'
      }, {
        label: '日期范围',
        props: ['myDateRangeStart', 'myDateRangeEnd'],
        type: 'daterange',
        valueFormat: 'yyyy-MM-dd'
      }, {
        label: '日期时间范围',
        props: ['myDatetimeRangeStart', 'myDatetimeRangeEnd'],
        type: 'datetimerange',
        valueFormat: 'timestamp'
      }, {
        label: '月份范围',
        props: ['myMonthRangeStart', 'myMonthRangeEnd'],
        type: 'monthrange',
        valueFormat: 'yyyy-MM'
      }, {
        label: '长文本框',
        prop: 'myTextarea',
        type: 'textarea', // 行内表单不生效
        autosize: {
          minRows: 2, maxRows: 6
        }
      }, {
        label: '单选框',
        prop: 'myRadio',
        type: 'radio',
        options: [
          { label: '选项1', value: 0 },
          { label: '选项2', value: 1 }
        ]
      }, {
        label: '多选框',
        prop: 'myCheckbox',
        type: 'checkbox',
        options: [
          { label: '选项1', value: 0 },
          { label: '选项2', value: 1 }
        ]
      }, {
        label: '计数器',
        prop: 'myCount',
        type: 'count'
      }, {
        label: '开关',
        prop: 'mySwitch',
        type: 'switch'
      }, {
        label: '滑块',
        prop: 'mySlider',
        type: 'slider' // 行内表单不生效
      }, {
        label: '评分',
        prop: 'myRate',
        type: 'rate'
      }, {
        label: '颜色',
        prop: 'myColor',
        type: 'color'
      }]
    }
  }
}
```

---

### 数据-渲染
可通过 `type` 属性设置为 `'render'` 值，并使用 `renderContent` 属性创建渲染函数

```javascript
export default {
  data() {
    return {
      data: {
        myCustomContent: 'apple'
      },
      items: [{
        label: '自定义内容',
        prop: 'myCustomContent',
        type: 'render',
        renderContent(h, { item, index, value }) {
          return h('span', {
            style: {
              color: '#333333',
              cursor: 'pointer'
            },
            on: {
              click: () => {
                console.log('renderContent', item, index, value)
              }
            }
          }, value)
        }
      }]
    }
  }
}
```

---

### 数据-插槽

表单项可通过 `type` 属性设置 `'slot'` 值指向其 `prop`属性值的具名插槽；

表单项中通过 `beforeSlot,afterSlot` 属性指向其之前与之后的区域，可作用于所有表单类型；

表单项 `Select,Radio,Checkbox` 的 `options` 可通过 `type` 属性设置 `'slot'` 值指向其 `label` 属性值的具名插槽；

```html
<template>
  <el-form-model
    ref="myForm"
    label-width="100px"
    :inline="false"
    :data="data"
    :items="items"
  >
    <template v-slot:myInputBeforeSlot="{ item, formRef }">
      input before slot
    </template>
    <template v-slot:myInputAfterSlot="{ item, formRef }">
      input after slot
    </template>
    <template v-slot:optionSlot="{ label, value }">
      <i class="el-icon-edit" />{{ label }}: {{ value }}
    </template>
    <template v-slot:myCustomContent="{ item, formRef }">
      自定义内容区域 / {{ item.label }}
    </template>
  </el-form-model>
</template>
```

```javascript
export default {
  data() {
    return {
      data: {
        myInput: 'apple',
        mySelect: 0,
        myRadio: 1,
        myCheckbox: [0, 1]
      },
      items: [{
        label: '带有前后插槽的输入框',
        prop: 'myInput',
        type: 'input',
        beforeSlot: 'myInputBeforeSlot',
        afterSlot: 'myInputAfterSlot',
        rules: [
          { required: true, message: '请输入...', trigger: 'change' }
        ]
      }, {
        label: '带有选项插槽的下拉框',
        prop: 'mySelect',
        type: 'select',
        options: [
          { label: '选项1', value: 0 },
          { label: '选项2', value: 1 },
          { label: 'selectOptionSlot', value: 2, type: 'slot' }
        ],
        rules: [
          { required: true, message: '请选择...', trigger: 'change' }
        ]
      }, {
        label: '带有选项插槽的单选框',
        prop: 'myRadio',
        type: 'radio',
        options: [
          { label: '选项1', value: 0 },
          { label: '选项2', value: 1 },
          { label: 'selectOptionSlot', value: 2, type: 'slot' }
        ],
        rules: [
          { required: true, message: '请选择...', trigger: 'change' }
        ]
      }, {
        label: '带有选项插槽的复选框',
        prop: 'myCheckbox',
        type: 'checkbox',
        options: [
          { label: '选项1', value: 0 },
          { label: '选项2', value: 1 },
          { label: 'selectOptionSlot', value: 2, type: 'slot' }
        ],
        rules: [
          { required: true, message: '请选择...', trigger: 'change' }
        ]
      }, {
        label: '自定义内容',
        prop: 'myCustomContent',
        type: 'slot'
      }]
    }
  }
}
```

---

### 数据-列宽
可通过 `width` 属性设置表单域的宽度（非行内表单时生效）

```javascript
export default {
  data() {
    return {
      items: [{ 
        label: '输入框',
        prop: 'myInput1',
        type: 'input',
        width: '50%'
      }, { 
        label: null,
        prop: 'myInput2',
        type: 'input',
        width: '50%',
        labelWidth: '20px'
      }]
    }
  }
}
```

---

### 数据-隐藏
可通过 `hidden` 属性设置表单域是否隐藏

```javascript
export default {
  data() {
    return {
      items: [{ 
        label: '输入框',
        prop: 'myInput',
        type: 'input',
        hidden: true
      }]
    }
  }
}
```

---

### 数据-继承表单子项属性
可继承 `Form-item` 表单子项属性与 `Input,Select,Cascader...` 表单子项组件属性（Element Form-item Attributes, [Input,Select,Cascader...] Attributes）

```javascript
export default {
  data() {
    return {
      items: [{ 
        label: '输入框',
        prop: 'myInput',
        type: 'input',
        minlength: 6,
        placeholder: '请输入...',
        clearable: true,
        prefixIcon: 'el-icon-edit',
        rules: [
          { required: true, message: '请输入...', trigger: 'blur' }
        ]
      }, {
        label: '日期范围',
        props: ['myDateRangeStart', 'myDateRangeEnd'],
        type: 'monthrange',
        valueFormat: 'yyyy-MM',
        startPlaceholde: '开始日期',
        endPlaceholder: '结束日期',
        rules: [
          { required: true, message: '请选择...', trigger: 'change' }
        ]
      }]
    }
  }
}
```

---

### 数据-继承表单子项事件
在 `events` 对象中可继承 `Input,Select,Cascader...` 表单子项组件事件（[Input,Select,Cascader...] Events）

```javascript
export default {
  data() {
    return {
      items: [{ 
        label: '输入框',
        prop: 'myInput',
        type: 'input',
        events: {
          focus: e => {
            console.log('myInput focus', e)
          },
          blur: e => {
            console.log('myInput blur', e)
          },
          change: val => {
            console.log('myInput change', val)
          }
        }
      }]
    }
  }
}
```

---

### 数据-分组
可通过 `type` 属性设置 `'group'` 值开启表单分组功能，在 `children` 属性中返回表单子项组件

```html
<template>
  <el-form-model
    ref="myForm"
    label-width="100px"
    :inline="false"
    :data="data"
    :items="items"
  >
    <template v-slot:addButton="{ item }">
      <el-button 
        type="primary"
        icon="el-icon-plus"
        @click="onAddGroup"
      />
    </template>
    <template v-slot:delButton="{ item }">
      <el-button 
        type="danger"
        icon="el-icon-minus"
        :disabled="items.find(item => item.prop === 'myGroup').rowNumber <= 1"
        @click="onDelGroup(item.rowIndex)"
      />
    </template>
  </el-form-model>
</template>
```

```javascript
export default {
  data() {
    return {
      data: {
        myGroup: [
          { title: 'baidu', url: 'http://www.baidu.com' },
          { title: 'qq', url: 'http://www.qq.com' }
        ]
      },
      items: [{
        prop: 'addButton',
        type: 'slot',
        width: '100%',
      }, {
        prop: 'myGroup',
        type: 'group',
        children: (groupProp, rowIndex) => {
          return [{
            label: '标题',
            prop: 'title',
            type: 'input',
            width: 'calc(50% - 50px)'
          }, {
            label: '地址',
            prop: 'url',
            type: 'input',
            width: 'calc(50% - 50px)'
          }, {
            prop: 'delButton',
            type: 'slot',
            width: '100px',
            labelWidth: '20px'
          }]
        }
      }]
    }
  },
  methods: {
    onAddRow() {
      this.data.myGroup.push({ title: '360', url: 'www.360.com' })
    },
    onDelRow(index) {
      this.data.myGroup.splice(index, 1)
    }
  }
}
```

---

# 按钮

### 按钮-对象
可通过 `buttons` 属性设置表单按钮（权重：低）

```html
<template>
  <el-form-model
    label-width="100px"
    :inline="false"
    :data="data"
    :items="items"
    :buttons="buttons"
  />
</template>
```

```javascript
export default {
  data() {
    return {
      data: {},
      items: [ ... ],
      buttons: [{ 
        text: '提交',
        size: 'small',
        type: 'primary',
        clickMethod: this.onSubmit
      }, {
        text: '重置',
        size: 'small',
        clickMethod: this.onReset
      }]
    }
  },
  methods: {
    onSubmit(button, formRef) {
      formRef.validate((valid) => {
        console.log('validate', valid)
      })
      console.log('onSubmit', button, this.data)
    },
    onReset(button, formRef) {
      this.data = {}
      formRef.resetFields()
      console.log('onReset', button, this.data)
    }
  }
}
```

---

### 按钮-插槽
可通过 `buttons` 具名插槽设置表单按钮（权重：高）

```html
<template>
  <el-form-model
    label-width="180px"
    :inline="false"
    :data="data"
    :items="items"
  >
    <template v-slot:between="{ formRef }">
      表单与按钮之间区域
    </template>
    <template v-slot:button="{ formRef }">
      <el-button
        type="success"
        size="medium"
      >
        自定义按钮1
      </el-button>
      <el-button
        type="primary"
        size="medium"
        @click="onSubmit(formRef)"
      >
        提交
      </el-button>
      <el-button
        size="medium"
        @click="onReset(formRef)"
      >
        重置
      </el-button>
      <el-button
        type="danger"
        size="medium"
      >
        自定义按钮2
      </el-button>
    </template>
  </el-form-model>
</template>
```

```javascript
export default {
  data() {
    return {
      data: {},
      items: [ ... ]
    }
  },
  methods: {
    onSubmit(formRef) {
      formRef.validate((valid) => {
        console.log('validate', valid)
      })
      console.log('onSubmit', this.data)
    },
    onReset(formRef) {
      this.data = {}
      formRef.resetFields()
      console.log('onReset', this.data)
    }
  }
}
```

----

Package: el-form-model

E-mail: diquick@qq.com

Author: wd3322
