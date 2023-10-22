enum WEEK {
  '日' = 0,
  '一' = 1,
  '二' = 2,
  '三' = 3,
  '四' = 4,
  '五' = 5,
  '六' = 6,
}
const weekOptions = [
  {
    value: 0,
    label: '星期日',
  },
  {
    value: 1,
    label: '星期一',
  },
  {
    value: 2,
    label: '星期二',
  },
  {
    value: 3,
    label: '星期三',
  },
  {
    value: 4,
    label: '星期四',
  },
  {
    value: 5,
    label: '星期五',
  },
  {
    value: 6,
    label: '星期六',
  },
]

// enum timeFrame {
//   '凌晨' = 0,
//   '早晨' = 1,
//   '上午' = 2,
//   '中午' = 3,
//   '下午' = 4,
//   '傍晚' = 5,
//   '晚上' = 6,
// // 凌晨：0时至5时59分。
// // 早晨：6时至8时59分。
// // 上午：9时至11时59分。
// // 中午：12时至13时59分。
// // 下午：14时至17时59分。
// // 傍晚：18时至19时59分。
// // 晚上：20时至23时59分。
// }
const timeFrameOptions=[
    {
      value: [0,6],
      label: '凌晨',
    },
    {
      value: [6,9],
      label: '早晨',
    },
    {
      value: [9,12],
      label: '上午',
    },
    {
      value: [12,14],
      label: '中午',
    },
    {
      value: [14,18],
      label: '下午',
    },
    {
      value: [18,20],
      label: '傍晚',
    },
    {
      value: [20,24],
      label: '晚上',      
    },
]

export {
  WEEK,
  weekOptions,
  timeFrameOptions
}