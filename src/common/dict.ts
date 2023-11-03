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
const clockStyleOptions = [
  {
    value: 1,
    label: '电子',
  },
  {
    value: 2,
    label: '古典',
  },
  {
    value:3,
    label:'粒子',
  }
]
const quitOptions = [
  {
    value:1,
    label:'最小化到托盘，不退出程序',
  },
  {
    value:2,
    label:'退出程序',
  }
]
const weatherOptions = [
'晴','少云','晴间多云','多云','阴','有风','平静','微风','和风','清风',
'强风/劲风','疾风','大风','烈风','风暴','狂爆风','飓风','热带风暴','霾',
'中度霾','重度霾','严重霾','阵雨','雷阵雨','雷阵雨并伴有冰雹','小雨',
'中雨','大雨','暴雨','大暴雨','特大暴雨','强阵雨','强雷阵雨','极端降雨',
'毛毛雨/细雨','雨','小雨-中雨','中雨-大雨','大雨-暴雨','暴雨-大暴雨',
'大暴雨-特大暴雨','雨雪天气','雨夹雪','阵雨夹雪','冻雨','雪','阵雪','小雪',
'中雪','大雪','暴雪','小雪-中雪','中雪-大雪','大雪-暴雪','浮尘','扬沙',
'沙尘暴','强沙尘暴','龙卷风','雾','浓雾','强浓雾','轻雾','大雾','特强浓雾',
'热','冷','未知']
enum weather{
  '晴':'sunny',
  '少云':'partly-cloudy',
  '晴间多云':'sunny-and-cloudy',
  '多云':'cloudy',
  '阴':'overcast',
  '有风':'windy',
  '平静':'calm',
  '微风':'breeze',
  '和风':'moderate-breeze',
  '清风':'fresh-breeze',
  '强风/劲风':'strong-breeze',
  '疾风':'high-wind',
  '大风':'gale',
  '烈风':'strong-gale',
  '风暴':'storm',
  '狂爆风':'violent-storm',
  '飓风':'hurricane',
  '热带风暴':'tropical-storm',
  '霾':'haze',
  '中度霾':'moderate-haze',
  '重度霾':'heavy-haze',
  '严重霾':'severe-haze',
  '阵雨':'shower',
  '雷阵雨':'thundershower',
  '雷阵雨并伴有冰雹':'thundershower-with-hail',
  '小雨':'light-rain',
  '中雨':'moderate-rain',
  '大雨':'heavy-rain',
  '暴雨':'rain',
  '大暴雨':'severe-rain',
  '特大暴雨':'extreme-rain',
  '强阵雨':'strong-shower',
  '强雷阵雨':'strong-thundershower',
  '极端降雨':'extreme-rain',    
  '毛毛雨/细雨':'shower-showers',
  '雨':'rain',
  '小雨-中雨':'light-rain-to-moderate-rain',
  '中雨-大雨':'moderate-rain-to-heavy-rain',
  '大雨-暴雨':'heavy-rain-to-storm',
  '暴雨-大暴雨':'storm-to-severe-rain',
  '大暴雨-特大暴雨':'severe-rain-to-extreme-rain',
  '雨雪天气':'rainy-and-snowy',
}
export {
  WEEK,
  weekOptions,
  timeFrameOptions,
  clockStyleOptions,
  quitOptions,
  weatherOptions
}