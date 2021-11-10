/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { icons } from '../lib/icons';
import { currencyFormatter, numberFormatter, numberParser, percentFormatter } from '../lib/utils';
import { ThemeContext } from './Theme/ThemeContext';

const BasicTable = () => {
    document.title = 'Basic Table - React ag-grid';
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
                    year: d.order_date.slice(-4),
                    sales: +d.sales,
                    quantity: +d.quantity,
                    discount: +d.discount,
                    profit: +d.profit,
                };
                return properties;
            });

            setRowData(newData);
        };

        fetch('data/superstore.json')
            .then((resp) => resp.json())
            .then((data) => updateData(data));
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

    const numberFilterParams = {
        buttons: ['apply', 'reset'],
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
                    floatingFilter: true,
                    sortable: true,
                    resizable: true,
                    menuTabs: [],
                }}
                suppressHorizontalScroll
                groupIncludeFooter
                groupIncludeTotalFooter
                animateRows
                icons={icons}
                // rowGroupPanelShow="always"
                rowSelection="multiple"
                rowData={rowData}
                onGridReady={onGridReady}
            >
                <AgGridColumn
                    headerName="Order Id"
                    field="order_id"
                    filterParams={{ buttons: ['apply', 'reset'] }}
                />
                <AgGridColumn
                    headerName="Customer Name"
                    field="customer_name"
                    filterParams={{ buttons: ['apply', 'reset'] }}
                />
                <AgGridColumn
                    headerName="Segment"
                    field="segment"
                    filterParams={{ buttons: ['apply', 'reset'] }}
                />
                <AgGridColumn
                    headerName="Order Date"
                    field="order_date"
                    filter="agDateColumnFilter"
                    filterType="date"
                    // filterParams={dateFilterParams}
                    filterParams={dateFilterParams}
                    valueFormatter={(params) => moment(params.value).format('MM/DD/YYYY')}
                />
                {/* <AgGridColumn field="Year" filterParams={{ excelMode: 'windows' }} /> */}
                <AgGridColumn
                    headerName="Ship Date"
                    field="ship_date"
                    filter="agDateColumnFilter"
                    filterType="date"
                    filterParams={dateFilterParams}
                    valueFormatter={(params) => moment(params.value).format('MM/DD/YYYY')}
                />

                <AgGridColumn
                    headerName="Sales"
                    field="sales"
                    aggFunc="sum"
                    enableValue
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueFormatter={currencyFormatter}
                    valueParser={numberParser}
                    // lowedAggFuncs={['sum', 'min', 'max']}
                    // cellClassRules={{
                    //     'rag-green': 'x < 1000',
                    //     'rag-amber': 'x >= 1000 && x < 2000',
                    //     'rag-red': 'x >= 2000',
                    // }}
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
                />
                <AgGridColumn
                    headerName="Profit"
                    field="profit"
                    aggFunc="sum"
                    enableValue
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    valueFormatter={currencyFormatter}
                    cellClassRules={{
                        'text-green-500': 'x >= 0',
                        'text-red-400': 'x < 0',
                    }}
                />
            </AgGridReact>
        </div>
    );
};

export default BasicTable;
