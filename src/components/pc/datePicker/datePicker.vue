<template>
  <div class="datepicker" v-clickoutside="handleClose">
    <div class="datepicker-selection" @click="switchOpen">
      <input class="datepicker-selection-input"
             v-model="inputValue"
             @input="handleInputChange"
             @keyup.enter="handleClose"
             placeholder="请选择">
      <span class="datepicker-selection-iconbox">
        <BaseIcon name="date" class="datepicker-selection-icon"></BaseIcon>
      </span>
    </div>
    <div class="datepicker-dropdown">
      <BaseCollapse :value="!isOpen" :duration="300">
        <div class="datepicker-dropdown-content">
          <div class="datepicker-panel">
            <div class="datepicker-panel-header">
            <span @click="prevYear" class="header-btn arrow-double-left">
              <BaseIcon name="next-double" flip="horizontal"></BaseIcon>
            </span>
              <span @click="prevMonth" class="header-btn arrow-left">
              <BaseIcon name="next" flip="horizontal"></BaseIcon>
            </span>
              <span>{{year}}</span>年
              <span>{{pickerMonth}}</span>月
              <span @click="nextYear" class="header-btn arrow-double-right">
              <BaseIcon name="next-double"></BaseIcon>
            </span>
              <span @click="nextMonth" class="header-btn arrow-right">
              <BaseIcon name="next"></BaseIcon>
            </span>
            </div>
          </div>
          <div class="datepicker-panel-content">
            <div class="datepicker-cells">
              <div class="datepicker-cells-header">
                <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
              </div>
              <div class="datepicker-cells-days">
              <span :class="getCellCls(cell)" v-for="(cell, index) in cells" :key="cell.value" @click="handleCellClick(cell)">
                <em :index="index" v-text="cell.text"></em>
              </span>
              </div>
              <div v-show="showClear || showToday" class="datepicker-cells-footer">
                <span v-if="showToday" class="btn today-btn" @click="setToday">今天</span>
                <span v-if="showClear" class="btn clear-btn" @click="clear">清除</span>
              </div>
            </div>
          </div>
        </div>
      </BaseCollapse>
    </div>
  </div>
</template>

<script>
import BaseCollapse from '@/components/base/collapse/index.vue'
import clickoutside from '@/assets/js/clickoutside.js'
import { convertToDate, convertToValue, isSameValue, getFirstDayOfMonth, getDayCountOfMonth, getTodayDate, getDateTimestamp, parseDate, formatDate } from './util'

export default {
  name: 'DatePicker',
  directives: { clickoutside },
  components: {
    BaseCollapse
  },
  props: {
    // 日期值
    value: [String, Number, Date],
    // 日期值类型
    valueType: {
      default: 'string',
      validator: function (value) {
        const isValid = ['string', 'timestamp', 'date'].indexOf(value) !== -1
        !isValid && console.warn('DatePicker 组件的 valueType 参数值，必须是"string"、 "timestamp" 、 "date"其中一个！')
        return isValid
      }
    },
    // 日期格式，默认为：yyyy-MM-dd (用于字符串类型的值、可选日期的最小值、可选日期的最大值和input输入框)
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    /**
     * 不可用日期方法
     * @param val {Date} Date类型日期值
     * @return isDisabled {Boolean} 是否为不可用日期
     */
    disabledDate: Function,
    // 可选日期的最小值，日期格式为format指定的格式，默认为：yyyy-MM-dd
    minValue: String,
    // 可选日期的最大值，日期格式为format指定的格式，默认为：yyyy-MM-dd
    maxValue: String,
    // 是否显示“今天”按钮
    showToday: {
      type: Boolean,
      default: false
    },
    // 是否显示“清空”按钮
    showClear: {
      type: Boolean,
      default: false
    },
    // 当值为空时，日历默认展示的月份, 格式为“yyyy-MM”或者“yyyy-MM-dd”
    defaultMonth: String
  },
  data () {
    // 当前值的Date类型值
    let dateValue = convertToDate(this.value, this.format)
    // 日历显示的月份，value有值时为value对应的月份，否则为defaultMonth指定的月份，如果value和defaultMonth都为空为当前时间的月份
    let calendarMonth = dateValue || (this.defaultMonth && parseDate(this.defaultMonth, 'yyyy-MM')) || getTodayDate()
    let year = calendarMonth.getFullYear()
    let month = calendarMonth.getMonth()

    return {
      dateValue, // value的Date类型值
      inputValue: dateValue ? formatDate(dateValue, this.format) : '', // 输入框值
      year, // 当前显示的年
      month, // 当前显示的月（取值范围 0-11）
      isOpen: false // 是否展开日历
    }
  },
  computed: {
    // 选择器上显示的月份
    pickerMonth () {
      // 由于 data 中 month 的取值范围为0 - 11，0 表示1月份，11 表示12月份，展示时需要加1
      return this.month + 1
    },
    // 选中日期的时间戳
    selectDateTimestamp () {
      return this.dateValue && this.dateValue.getTime()
    },
    // 可选范围最早日期的时间戳
    minDateTimestamp () {
      return getDateTimestamp(parseDate(this.minValue, this.format))
    },
    // 可选范围最晚日期的时间戳
    maxDateTimestamp () {
      return getDateTimestamp(parseDate(this.maxValue, this.format))
    },
    // 计算所有日期的数组
    cells () {
      const today = getTodayDate() // 获取今天时间
      const firstDay = new Date(this.year, this.month, 1) // 当月第一天
      // 当月1号是星期几(值为0至6，0表示周日)
      let firstWeekDay = getFirstDayOfMonth(firstDay)
      // 当前月的天数
      const dateCountOfMonth = getDayCountOfMonth(firstDay.getFullYear(), firstDay.getMonth())
      // 上个月的年份
      const yearOfLastMonth = firstDay.getMonth() === 0 ? firstDay.getFullYear() - 1 : firstDay.getFullYear()
      // 上个月的月份
      const monthOfLastMonth = firstDay.getMonth() === 0 ? 11 : firstDay.getMonth() - 1
      // 上个月的天数
      const dateCountOfLastMonth = getDayCountOfMonth(yearOfLastMonth, monthOfLastMonth)
      // 日历展示所有日期数组
      let cells = []

      // 计算上个月的日期
      if (firstWeekDay !== 0) { // 当月的第一天不是星期日时，需要添加上个月的日期
        let prevMonth = null
        let prevYear = null
        if (this.month === 0) { // 当前月份为1月时
          prevMonth = 11 // 月份设置为12月
          prevYear = this.year - 1 // 年份减1
        } else { // 当前月份不是1月时
          prevMonth = this.month - 1 // 月份减1
          prevYear = this.year // 年份不变
        }
        for (let i = 1; i <= firstWeekDay; i++) {
          let prevDay = dateCountOfLastMonth - (firstWeekDay - i)
          cells.push(this.createCell('prev-month', prevYear, prevMonth, prevDay))
        }
      }

      // 计算本月的日期
      for (let i = 1; i <= dateCountOfMonth; i++) {
        const type = today.getTime() === new Date(this.year, this.month, i).getTime() ? 'today' : 'normal'
        cells.push(this.createCell(type, this.year, this.month, i))
      }

      // 计算下个月的日期
      const nextMonthCount = 42 - cells.length
      for (let i = 1; i <= nextMonthCount; i++) {
        let nextMonth = this.month + 1
        let nextYear = this.year
        if (this.month === 11) {
          nextMonth = 0
          nextYear += 1
        }
        let nextDay = i
        cells.push(this.createCell('next-month', nextYear, nextMonth, nextDay))
      }

      return cells
    }
  },
  methods: {
    // 创建日期数据
    createCell (type, year, month, day) {
      const date = new Date(year, month, day)
      const time = getDateTimestamp(date)
      const cell = {}
      cell.date = date // 当前日期Date对象
      cell.time = time // 当前日期时间戳
      cell.value = formatDate(date, this.format) // 当前日期字符串
      cell.type = type // 日期类型：normal:普通；today：今天；prev-month：上个月；next-month：下个月
      cell.text = day // 当前日期显示的文字
      cell.selected = time === this.selectDateTimestamp // 是否选中
      cell.disabled = this.checkDisabled(date) // 是否禁用
      return cell
    },
    // 校验日期是否禁用
    checkDisabled (date) {
      let time = date.getTime()
      let isDisabled = false
      if (this.disabledDate && typeof this.disabledDate === 'function') {
        isDisabled = this.disabledDate(date)
      } else if (this.minDateTimestamp && this.maxDateTimestamp) {
        isDisabled = time < this.minDateTimestamp || time > this.maxDateTimestamp
      } else if (this.minDateTimestamp) {
        isDisabled = time < this.minDateTimestamp
      } else if (this.maxDateTimestamp) {
        isDisabled = time > this.maxDateTimestamp
      }
      return isDisabled
    },
    // 获取日历中日期的样式
    getCellCls (cell) {
      return [
        {
          'cell-selected': cell.selected,
          'cell-disabled': cell.disabled,
          'cell-today': cell.type === 'today',
          'cell-prev-month': cell.type === 'prev-month',
          'cell-next-month': cell.type === 'next-month'
        }
      ]
    },
    // 输入框内容改变时触发的事件
    handleInputChange () {
      this.isOpen = true
      const newValue = this.inputValue
      let yearMonthFormat = this.format
      if (newValue.length === 4 && this.format.startsWith('yyyy')) {
        yearMonthFormat = 'yyyy'
      } else if (newValue.length === 7 && /^yyyy(.)MM/.test(this.format)) {
        yearMonthFormat = this.format.substr(0, 7)
      }
      const newDate = parseDate(newValue, yearMonthFormat)
      if (newDate instanceof Date) {
        // 校验是否禁用
        if (this.checkDisabled(newDate)) {
          return
        }

        this.year = newDate.getFullYear()
        this.month = newDate.getMonth()
      }
    },
    // 日历中日期被点击事件
    handleCellClick (cell) {
      if (cell.disabled) {
        return
      }
      this.inputValue = cell.value
      this.dateValue = cell.date
      this.isOpen = false
      this.emitEvent()
    },
    // 将值设置为今天
    setToday () {
      const today = getTodayDate()
      const todayValue = formatDate(today, this.format)
      this.year = today.getFullYear()
      this.month = today.getMonth()
      this.inputValue = todayValue
      this.dateValue = today
      this.isOpen = false
      this.emitEvent()
    },
    // 清空
    clear () {
      const today = getTodayDate()
      this.year = today.getFullYear()
      this.month = today.getMonth()
      this.inputValue = ''
      this.dateValue = null
      this.handleClose()
      this.emitEvent()
    },
    emitEvent () {
      // 将Date类型的值转化为指定的类型
      const newValue = convertToValue(this.dateValue, this.valueType, this.format)
      console.log(this.dateValue, this.valueType, this.format, '====', newValue)
      const oldValue = this.value
      if (!isSameValue(newValue, oldValue, this.format)) {
        this.$emit('input', newValue)
        this.$emit('change', newValue, oldValue)
      }
    },
    switchOpen () {
      this.isOpen = !this.isOpen
    },
    handleClose () {
      this.isOpen = false
    },
    prevYear () {
      this.year--
    },
    nextYear () {
      this.year++
    },
    prevMonth () {
      this.month--
      if (this.month < 0) {
        this.month = 11
        this.year--
      }
    },
    nextMonth () {
      this.month++
      if (this.month > 11) {
        this.month = 0
        this.year++
      }
    }
  },
  watch: {
    value (val) {
      const dateValue = convertToDate(val, this.format)
      const calendarMonth = dateValue || (this.defaultMonth && parseDate(this.defaultMonth, 'yyyy-MM')) || getTodayDate()
      const year = calendarMonth.getFullYear()
      const month = calendarMonth.getMonth()

      this.dateValue = dateValue
      this.year = year
      this.month = month
    },
    isOpen (val) {
      if (!val) { // 当选择器弹框关闭时
        const inputDate = parseDate(this.inputValue, this.format)
        const inputDateStr = inputDate ? formatDate(inputDate, this.format) : ''
        const dateValueStr = this.dateValue ? formatDate(this.dateValue, this.format) : ''
        // 当输入框输入的日期与原日期不一致时
        if (inputDateStr !== dateValueStr) {
          // 当日期选择器组件为可清除，并且值为空时
          if (this.showClear && this.inputValue === '') {
            this.dateValue = null
            const today = getTodayDate()
            this.year = today.getFullYear()
            this.month = today.getMonth()
            this.emitEvent()
          } else {
            // 输入的新日期为空或者是输入不可选日期时
            if (!inputDate || this.checkDisabled(inputDate)) {
              // 输入框值、年份、月份改为原日期值
              this.inputValue = dateValueStr
              const calendarMonth = this.dateValue || (this.defaultMonth && parseDate(this.defaultMonth, 'yyyy-MM')) || getTodayDate()
              this.year = calendarMonth.getFullYear()
              this.month = calendarMonth.getMonth()
            } else {
              // 设置为新选择的值
              this.inputValue = inputDateStr
              this.dateValue = inputDate
              this.emitEvent()
            }
          }
        } else if (this.inputValue !== inputDateStr) {
          // 如果输入框输入的日期格式错误，输入框值、年份、月份改为原日期值
          this.inputValue = dateValueStr
          const calendarMonth = this.dateValue || (this.defaultMonth && parseDate(this.defaultMonth, 'yyyy-MM')) || getTodayDate()
          this.year = calendarMonth.getFullYear()
          this.month = calendarMonth.getMonth()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped px2rem="false">
$date-input-right-padding: $input-padding + 14px + 5px;
$cell-size: 24px;
$cell-margin: 4px;

.datepicker {
  display: inline-block;
  .datepicker-selection {
    display: inline-block;
    position: relative;
    width: 100%;
    input.datepicker-selection-input {
      display: block;
      width: 100% !important;
      height: $form-item-height;
      line-height: $form-item-height - 2px;
      margin: 0;
      padding: 0 $date-input-right-padding 0 $input-padding;
      box-sizing: border-box;
      border-radius: $input-border-radius;
      border: 1px solid $border-color-base;
      outline: none;

      &:focus {
        @include primary-border-color();
      }
      &::placeholder {
        color: $color-text-placeholder;
      }
    }

    .datepicker-selection-iconbox {
      display: block;
      position: absolute;
      top: 1px;
      right: 1px;
      width: $date-input-right-padding;
      height: $form-item-height;
      text-align: center;
      box-sizing: border-box;
      border-radius: 0 $input-border-radius $input-border-radius 0;

      .datepicker-selection-icon {
        position: absolute;
        top: 50%;
        right: $input-padding;
        transform: translate(0, -50%);
        font-size: 14px;
        color: $color-text-placeholder;
      }
    }
  }

  .datepicker-dropdown {
    position: absolute;
    width: auto;
    margin: 4px 0;
    padding: 0;
    overflow: visible;
    max-height: none;
    background-color: #fff;
    box-sizing: border-box;
    // box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    z-index: 900;
    .datepicker-dropdown-content {
      border-radius: 4px;
      border: solid 1px $border-color-light;
    }

    .datepicker-panel-header {
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-bottom: 1px solid #e3e8ee;
    }

    .datepicker-panel-header > .header-btn {
      display: inline-block;
      width: 20px;
      height: 24px;
      line-height: 26px;
      margin-top: 4px;
      text-align: center;
      cursor: pointer;
      transition: color 0.2s ease-in-out;
    }

    .datepicker-panel-header > .arrow-left,
    .datepicker-panel-header > .arrow-double-left {
      float: left;
    }

    .datepicker-panel-header > .arrow-right,
    .datepicker-panel-header > .arrow-double-right {
      float: right;
    }

    .datepicker-panel-header > .arrow-double-left {
      margin-left: 10px;
    }

    .datepicker-panel-header > .arrow-double-right {
      margin-right: 10px;
    }

    .datepicker-cells {
      width: ($cell-size * 7) + ($cell-margin * 8) + 40px;
      white-space: normal;
      span {
        display: inline-block;
        text-align: center;
      }

      .datepicker-cells-header {
        span {
          width: $cell-size;
          height: $cell-size;
          line-height: $cell-size;
          margin: 2px $cell-margin;
        }
      }

      .datepicker-cells-days {
        span {
          cursor: pointer;
          em {
            display: inline-block;
            width: $cell-size;
            height: $cell-size;
            line-height: $cell-size;
            font-style: normal;
            border-radius: 3px;
            text-align: center;
            transition: all 0.2s ease-in-out;
            margin: 4px;
            &:hover {
              @include primary-background-color(0.1);
            }
          }
          &.cell-disabled {
            cursor: not-allowed;
            em {
              background: #f7f7f7;
              color: #c3cbd6;
            }
          }

          &.cell-prev-month em{
            color: #c3cbd6;
          }

          &.cell-next-month em{
            color: #c3cbd6;
          }

          &.cell-today > em {
            position: relative;
          }

          &.cell-today em:after {
            content: '';
            display: block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            @include primary-background-color();
            position: absolute;
            top: 1px;
            right: 1px;
          }

          &.cell-selected em, &.cell-selected:hover em {
            @include primary-background-color();
            color: #fff;
          }

          &.cell-selected em:after {
            background: #fff;
          }
        }
      }
      .datepicker-cells-footer {
        height: 32px;
        line-height: 32px;
        text-align: right;
        border-top: 1px solid #e3e8ee;
        padding: 0 10px;
        .btn {
          width: auto;
          height: auto;
          padding: 0 4px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
