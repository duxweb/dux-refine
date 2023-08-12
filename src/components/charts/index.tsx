import { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useAppStore } from '@/stores/app'
import { useMemo } from 'react'
import merge from 'deepmerge'
import defineConfig from '../../../vite.config'

interface ChartsProps {
  options?: EChartsOption[]
  min?: boolean
  single?: boolean
}

const Charts = ({ single, options, min }: ChartsProps) => {
  const dark = useAppStore((state) => state.dark)

  const option: EChartsOption = useMemo(() => {
    const config = options || []
    let defaultConfig: EChartsOption = {
      grid: {
        top: 30,
        right: 30,
        left: 30,
        bottom: 30,
      },
    }
    if (min) {
      defaultConfig = {
        grid: {
          top: 5,
          right: 5,
          bottom: 5,
          left: 5,
          show: false,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          show: false,
        },
      }
    }
    return merge.all([defaultConfig, ...config]) as EChartsOption
  }, [min, options])

  return (
    <ReactECharts
      option={option}
      theme={dark ? (single ? 'dark-single' : 'dark') : single ? 'light-single' : 'light'}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  )
}
export default Charts

interface ChartProps {
  labels?: string[]
  data?: ChartsDataProps[]
  min?: boolean
  options?: EChartsOption
}

export interface ChartsDataProps {
  name?: string
  data?: any[]
}

interface ChartBarProps extends ChartProps {
  legend?: boolean
  single?: boolean
}

export const ChartBar = ({ labels, data, legend, min, options }: ChartBarProps) => {
  const config = useMemo<EChartsOption>(() => {
    const defineConfig = {
      xAxis: {
        type: 'category',
        data: labels,
      },
      yAxis: {
        type: 'value',
      },
      series: data?.map((item) => ({
        name: item.name,
        data: item.data,
        type: 'bar',
      })),
      tooltip: {
        trigger: 'axis',
      },
    } as EChartsOption

    if (legend) {
      defineConfig.legend = {
        show: true,
      }
    }
    return defineConfig
  }, [data, labels, legend])
  return <Charts options={[config, options || {}]} min={min} />
}

export const ChartLine = ({ labels, data, min, options }: ChartProps) => {
  const config = useMemo<EChartsOption>(() => {
    return {
      xAxis: {
        type: 'category',
        data: labels,
      },
      yAxis: {
        type: 'value',
      },
      series: data?.map((item) => ({
        data: item.data,
        type: 'line',
      })),
      tooltip: {
        trigger: 'axis',
      },
    }
  }, [data, labels])

  return <Charts options={[config, options || {}]} min={min} />
}

export const ChartArea = ({ labels, data, min, options }: ChartProps) => {
  const config = useMemo<EChartsOption>(() => {
    return {
      xAxis: {
        type: 'category',
        data: labels,
      },
      yAxis: {
        type: 'value',
        splitArea: {
          show: true,
        },
      },
      series: data?.map((item) => ({
        data: item.data,
        type: 'line',
        symbol: 'none',
        areaStyle: {
          opacity: 0.2,
        },
      })),
      tooltip: {
        trigger: 'axis',
      },
    }
  }, [data, labels])

  return <Charts options={[config, options || {}]} min={min} />
}

export interface ChartRingProps {
  data?: Record<string, any>[]
  min?: boolean
  single?: boolean
  options?: EChartsOption
}

export const ChartRing = ({ data, min, options, single }: ChartRingProps) => {
  const dark = useAppStore((state) => state.dark)
  const config = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        top: 'bottom',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: !dark ? '#fff' : '#242424',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    }
  }, [dark, data])
  return <Charts options={[config, options || {}]} min={min} single={single} />
}
