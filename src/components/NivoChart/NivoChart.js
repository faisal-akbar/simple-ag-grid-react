/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { NIVO_CHART_URL } from '../../Workers/constants';
import { chartThemeDark, chartThemeLight } from '../Theme/ChartTheme';
import { ThemeContext } from '../Theme/ThemeContext';

const NivoChart = ({ segment, region, category }) => {
    // const { lineChartData, multiLineChartData } = useAPI();
    const customDate = (date, format = 'MMM DD, YY') => moment(date).format(format);

    // console.log('group by region and d', test);

    const { theme } = useContext(ThemeContext);

    // Bring Data
    const [data, setData] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(true);
    // Fetch data
    useEffect(() => {
        fetch(`${NIVO_CHART_URL}?segment='${segment}'&region='${region}'&category='${category}'`)
            .then((response) => response.json())
            .then((d) => {
                setData(d);
                setIsLoading(false);
            })
            .then((err) => console.error(err));
    }, [category, region, segment]);

    // Prepare Data for Line Chart
    const lineChartData = [];
    const prepareChartData = {};
    if (data.length > 0) {
        prepareChartData.id = `Sales by Order Date`;
        // eslint-disable-next-line camelcase
        prepareChartData.data = data.map(({ order_date, sales }) => ({
            // eslint-disable-next-line camelcase
            x: order_date,
            y: sales,
        }));
    }
    lineChartData.push(prepareChartData);

    console.log(lineChartData);

    return (
        <div className="chart-card h-[26rem]">
            <h3 className="chart-title">Monthly Sales</h3>
            {!isLoading ? (
                <ResponsiveLine
                    data={lineChartData}
                    margin={{ top: 30, right: 60, bottom: 90, left: 60 }}
                    theme={theme === 'dark' ? chartThemeDark : chartThemeLight}
                    // For Date field use following instead of xScale Point
                    xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false, precision: 'day' }}
                    xFormat="time:%Y-%m-%d"
                    // xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        stacked: false,
                        reverse: false,
                    }}
                    yFormat=" >-.2f"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Order Date',
                        legendOffset: 65,
                        legendPosition: 'middle',
                        // For Date field use these additional properties
                        // tickValues: 'every 7 day',
                        tickValues:
                            data.length >= 180
                                ? 'every 3 month'
                                : data.length >= 90
                                ? 'every 2 month'
                                : data.length >= 60
                                ? 'every 15 day'
                                : data.length >= 30
                                ? 'every 7 day'
                                : 'every 1 day',
                        // format: (tick) => moment(tick).format('MMM DD, YY'),
                        format: (tick) => moment(tick).format("MMM-DD' YY"),
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Sales',
                        legendOffset: -50,
                        legendPosition: 'middle',
                        // labelFormat: '.0s',
                        format: (d) => `${d / 1000}K`,
                    }}
                    enableSlices="x"
                    sliceTooltip={({ slice }) => {
                        const date = slice.points[0].data.xFormatted;
                        console.log(date);
                        return (
                            <div className="relative">
                                <div className="tooltip">
                                    <div>Month: {customDate(date, 'MMM, YY')}</div>
                                    {slice.points.map((point) => (
                                        <div>Sales: ${point.data.yFormatted}</div>
                                    ))}
                                </div>
                                <svg className="tooltip-arrow" width="8" height="8">
                                    <rect
                                        x="12"
                                        y="-10"
                                        width="8"
                                        height="8"
                                        transform="rotate(45)"
                                    />
                                </svg>
                            </div>
                        );
                    }}
                    color={{ scheme: 'category10' }}
                    pointSize={6}
                    pointColor={{ from: 'color', modifiers: [] }}
                    pointBorderWidth={1}
                    pointBorderColor={{ from: 'serieColor', modifiers: [] }}
                    pointLabelYOffset={-12}
                    enableCrosshair={false}
                    useMesh
                    legends={[]}
                />
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
};

export default NivoChart;
