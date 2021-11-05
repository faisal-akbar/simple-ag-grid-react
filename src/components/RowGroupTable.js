/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useContext, useState } from 'react';
import { icons } from '../lib/icons';
import { sideBar } from '../lib/sideBarConfig';
import { currencyFormatter, numberFormatter, numberParser, percentFormatter } from '../lib/utils';
import { ThemeContext } from './Theme/ThemeContext';

const RowGroupTable = () => {
    document.title = 'Row Group - React ag-grid';
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState(null);
    const { theme, setTheme } = useContext(ThemeContext);

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => {
            const newData = data.map((d) => {
                const properties = {
                    ...d,
                    // Order_Date: moment(d.Order_Date).format('YYYY-MM-DD'),
                    // Ship_Date: moment(d.Ship_Date).format('YYYY-MM-DD'),
                    Year: d.Order_Date.slice(-4),
                    Sales: +d.Sales,
                    Quantity: +d.Quantity,
                    Discount: +d.Discount,
                    Profit: +d.Profit,
                };
                return properties;
            });
            setRowData(newData);
        };

        fetch('data/superstore_data.json')
            .then((resp) => resp.json())
            .then((data) => updateData(data));
    };

    const numberFilterParams = {
        buttons: ['reset'],
        defaultOption: 'inRange',
        alwaysShowBothConditions: false,
        defaultJoinOperator: 'AND',
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
                    field: 'Segment',
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
                sideBar={sideBar}
                icons={icons}
                rowGroupPanelShow="always"
                rowSelection="multiple"
                rowData={rowData}
                onGridReady={onGridReady}
                enableCharts
                enableRangeSelection
            >
                <AgGridColumn
                    headerName="Segment"
                    field="Segment"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ excelMode: 'windows' }}
                    chartDataType="category"
                />
                <AgGridColumn
                    field="Region"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ excelMode: 'windows' }}
                    chartDataType="category"
                />
                <AgGridColumn
                    field="Category"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ excelMode: 'windows' }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sub Category"
                    field="Sub_Category"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ excelMode: 'windows' }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sales"
                    field="Sales"
                    // aggFunc="sum"
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
                    field="Quantity"
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
                    field="Discount"
                    aggFunc="avg"
                    enableValue
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    valueFormatter={percentFormatter}
                    chartType="series"
                />
                <AgGridColumn
                    field="Profit"
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

export default RowGroupTable;
