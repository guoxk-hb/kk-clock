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

enum timeFrame {
//   凌晨：0时至5时59分。
// 早晨：6时至8时59分。
// 上午：9时至11时59分。
// 中午：12时至13时59分。
// 下午：14时至17时59分。
// 傍晚：18时至19时59分。
// 晚上：20时至23时59分。
}


export {
  WEEK,
  weekOptions
}