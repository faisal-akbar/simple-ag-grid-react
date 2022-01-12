/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { icons } from '../../lib/icons';
import { sideBar } from '../../lib/sideBarConfig';
import {
    currencyFormatter,
    numberFormatter,
    numberParser,
    // eslint-disable-next-line prettier/prettier
    percentFormatter
} from '../../lib/utils';
import { DATA_URL } from '../../Workers/constants';
import { useAPI } from '../Context/apiContext';
import { ThemeContext } from '../Theme/ThemeContext';

const MySQLServerSide = () => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const { theme, setTheme } = useContext(ThemeContext);
    const [isLoading, segmentFilter, regionFilter, categoryFilter, subCategoryFilter] = useAPI();

    const datasource = {
        getRows(params) {
            console.log(JSON.stringify(params.request, null, 1));

            fetch(DATA_URL, {
                method: 'post',
                body: JSON.stringify(params.request),
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
            })
                .then((httpResponse) => httpResponse.json())
                .then((response) => {
                    console.log('In POST', response);
                    params.successCallback(response.rows, response.lastRow);
                })
                .catch((error) => {
                    console.error(error);
                    params.failCallback();
                });
        },
    };

    const onGridReady = (params) => {
        setGridApi(params);
        // register datasource with the grid
        params.api.setServerSideDatasource(datasource);
    };

    const numberFilterParams = {
        buttons: ['apply', 'reset'],
        defaultOption: 'inRange',
        alwaysShowBothConditions: false,
        defaultJoinOperator: 'AND',
    };

    const dateFilterParams = {
        buttons: ['apply', 'reset'],
        // eslint-disable-next-line consistent-return
        comparator: (filterLocalDateAtMidnight, cellValue) => {
            const cellDate = moment(cellValue).startOf('day').toDate();

            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                return 0;
            }

            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }

            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
        },
        defaultOption: 'inRange',
    };

    return (
        <div
            className={
                theme === 'dark'
                    ? 'w-full h-[91vh] overflow-hidden ag-theme-alpine-dark'
                    : 'w-full h-[91vh] overflow-hidden ag-theme-alpine'
            }
        >
            <AgGridReact
                defaultColDef={{
                    flex: 1,
                    minWidth: 150,
                    filter: true,
                    sortable: true,
                    resizable: true,
                }}
                autoGroupColumnDef={{
                    headerName: 'Segment',
                    // field: 'Segment',
                    minWidth: 300,
                    cellRendererParams: {
                        footerValueGetter: (params) => {
                            const isRootLevel = params.node.level === -1;
                            if (isRootLevel) {
                                return 'Grand Total';
                            }
                            return `Sub Total (${params.value})`;
                        },
                    },
                }}
                suppressHorizontalScroll
                groupIncludeFooter
                groupIncludeTotalFooter
                suppressAggFuncInHeader
                animateRows
                sideBar={!isLoading ? sideBar : null}
                icons={icons}
                rowGroupPanelShow="always"
                rowSelection="multiple"
                enableCharts
                enableRangeSelection
                onGridReady={onGridReady}
                rowModelType="serverSide"
                serverSideStoreType="partial"
                cacheBlockSize={5}
                // onFirstDataRendered={(params) => {
                //     params.api.getFilterInstance('YEAR', (filterInstance) => {
                //         filterInstance.setModel({
                //             filterType: 'set',
                //             values: ['2012'],
                //         });
                //         params.api.onFilterChanged();
                //     });
                // }}
            >
                {/* <AgGridColumn field="segment" filter="agTextColumnFilter" /> */}
                <AgGridColumn
                    headerName="Segment"
                    field="segment"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ values: segmentFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Region"
                    field="region"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ values: regionFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Category"
                    field="category"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ values: categoryFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sub Category"
                    field="sub_category"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ values: subCategoryFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sales"
                    field="sales"
                    aggFunc="sum"
                    enableValue
                    valueFormatter={currencyFormatter}
                    // cellClassRules={{
                    //     'bg-green-500': 'x < 1000',
                    //     'bg-amber': 'x >= 1000 && x < 2000',
                    //     'bg-red-400': 'x >= 2000',
                    // }}
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    chartType="series"

                    // filterParams={{
                    //   alwaysShowBothConditions: true,
                    //   defaultJoinOperator: 'OR',
                    // }}
                    // allowedAggFuncs={['sum', 'min', 'max']}
                />
                <AgGridColumn
                    headerName="Order Date"
                    field="order_date"
                    filter="agDateColumnFilter"
                    filterType="date"
                    enableRowGroup
                    rowGroup
                    hide
                    // filterParams={dateFilterParams}
                    filterParams={dateFilterParams}
                    valueFormatter={(params) =>
                        params.value !== undefined ? moment(params.value).format('MM/DD/YYYY') : ''
                    }
                />

                <AgGridColumn
                    headerName="Quantity"
                    field="quantity"
                    enableValue
                    aggFunc="sum"
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    valueFormatter={numberFormatter}
                    chartType="series"
                    // filterParams={{
                    //   alwaysShowBothConditions: true,
                    //   defaultJoinOperator: 'OR',
                    // }}
                />
                <AgGridColumn
                    headerName="Discount"
                    field="discount"
                    aggFunc="avg"
                    enableValue
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    valueFormatter={percentFormatter}
                    chartType="series"
                />
                <AgGridColumn
                    headerName="Profit"
                    field="profit"
                    aggFunc="sum"
                    enableValue
                    valueFormatter={currencyFormatter}
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    chartType="series"
                    cellClassRules={{
                        'text-green-500': 'x >= 0',
                        'text-red-400': 'x < 0',
                    }}
                />
            </AgGridReact>
        </div>
    );
};

export default MySQLServerSide;
