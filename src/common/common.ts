export function hasScrollbar(element) {
  // 获取元素的滚动条宽度和高度  
  const scrollbarWidth = element.offsetWidth - element.clientWidth;
  const scrollbarHeight = element.offsetHeight - element.clientHeight;

  // 判断是否存在水平或垂直滚动条  
  return scrollbarWidth > 0 || scrollbarHeight > 0;
}

//时间转换字符串
export function formateTime(time: number): string {
  return time < 10 ? '0' + time : String(time)
}

//字符串转换时间戳
export function formateTimestamp(time: string): number {
  const hour:number=Number(time.split(':')[0])
  const minute:number=Number(time.split(':')[1])
  return hour*60+minute
}

//转农历
const lunarOptions = {
  calendar: 'chinese',
  dateStyle: 'medium',
}
export const toCnDate = date => date.toLocaleString('zh-u-ca-chinese', lunarOptions)