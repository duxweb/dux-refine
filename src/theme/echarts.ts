import * as echarts from 'echarts'
import { darkColor, lightColor, singleLightColor, singleDarkColor } from './color'

const light = {
  textColor: 'rgba(0, 0, 0, 0.9)',
  placeholderColor: 'rgba(0, 0, 0, 0.35)',
  borderColor: '#dcdcdc',
  containerColor: '#fff',
}
const dark = {
  textColor: 'rgba(255, 255, 255, 0.9)',
  placeholderColor: 'rgba(255, 255, 255, 0.35)',
  borderColor: '#5e5e5e',
  containerColor: '#242424',
  legend: {
    textStyle: {
      color: '#dddddd',
    },
  },
  tooltip: {
    textColor: '#dddddd',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: 'rgba(0,0,0,0.8)',
    textStyle: {
      color: '#dddddd',
    },
  },
  categoryAxis: {
    splitLine: {
      lineStyle: {
        color: ['var(--td-font-gray-5)'],
      },
    },
  },
  valueAxis: {
    splitLine: {
      lineStyle: {
        color: ['#777777'],
      },
    },
  },
  logAxis: {
    splitLine: {
      lineStyle: {
        color: ['var(--td-font-gray-5)'],
      },
    },
  },
  timeAxis: {
    splitLine: {
      lineStyle: {
        color: ['var(--td-font-gray-5)'],
      },
    },
  },
}

export const registerCharts = () => {
  echarts.registerTheme('light', { ...light, color: lightColor })
  echarts.registerTheme('dark', { ...dark, color: darkColor })
  echarts.registerTheme('light-single', { ...light, color: singleLightColor })
  echarts.registerTheme('dark-single', { color: singleDarkColor, ...dark })
}
