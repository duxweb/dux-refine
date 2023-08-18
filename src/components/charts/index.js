import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useAppStore } from '../../stores/app';
import merge from 'deepmerge';
const Charts = ({ single, options, min }) => {
    const dark = useAppStore((state) => state.dark);
    const option = useMemo(() => {
        const config = options || [];
        let defaultConfig = {
            grid: {
                top: 30,
                right: 30,
                left: 30,
                bottom: 30,
            },
        };
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
            };
        }
        return merge.all([defaultConfig, ...config]);
    }, [min, options]);
    return (_jsx(ReactECharts, { option: option, theme: dark ? (single ? 'dark-single' : 'dark') : single ? 'light-single' : 'light', style: { height: '100%', width: '100%' }, opts: { renderer: 'svg' } }));
};
export default Charts;
export const ChartBar = ({ labels, data, legend, min, options }) => {
    const config = useMemo(() => {
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
        };
        if (legend) {
            defineConfig.legend = {
                show: true,
            };
        }
        return defineConfig;
    }, [data, labels, legend]);
    return _jsx(Charts, { options: [config, options || {}], min: min });
};
export const ChartLine = ({ labels, data, min, options }) => {
    const config = useMemo(() => {
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
        };
    }, [data, labels]);
    return _jsx(Charts, { options: [config, options || {}], min: min });
};
export const ChartArea = ({ labels, data, min, options }) => {
    const config = useMemo(() => {
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
        };
    }, [data, labels]);
    return _jsx(Charts, { options: [config, options || {}], min: min });
};
export const ChartRing = ({ data, min, options, single }) => {
    const dark = useAppStore((state) => state.dark);
    const config = useMemo(() => {
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
        };
    }, [dark, data]);
    return _jsx(Charts, { options: [config, options || {}], min: min, single: single });
};
