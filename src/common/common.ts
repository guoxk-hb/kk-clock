export function hasScrollbar(element) {
  // 获取元素的滚动条宽度和高度  
  const scrollbarWidth = element.offsetWidth - element.clientWidth;
  const scrollbarHeight = element.offsetHeight - element.clientHeight;

  // 判断是否存在水平或垂直滚动条  
  return scrollbarWidth > 0 || scrollbarHeight > 0;
}
export function formateTime(time: number): string {
  return time < 10 ? '0' + time : String(time)
}
let lunarOptions = {
  calendar: 'chinese',
  dateStyle: 'medium',
}
//转农历
export const toCnDate = date => date.toLocaleString('zh-u-ca-chinese', lunarOptions)