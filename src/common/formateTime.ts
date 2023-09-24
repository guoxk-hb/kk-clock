export default function formateTime(time:number):string{
  return time<10?'0'+time:String(time)
}