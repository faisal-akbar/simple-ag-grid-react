/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import React, { useState } from 'react';
import { icons } from '../lib/icons';
import { currencyFormatter, numberFormatter, numberParser, percentFormatter } from '../lib/utils';

const BasicTable = () => {
    document.title = 'Basic Table - React ag-grid';
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState(null);

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

    const dateFilterParams = {
        buttons: ['reset'],
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
        buttons: ['reset'],
        defaultOption: 'inRange',
        alwaysShowBothConditions: false,
        defaultJoinOperator: 'AND',
    };

    return (
        <div className="w-full h-[91vh] overflow-hidden ag-theme-alpine">
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
                    field="Order_ID"
                    filterParams={{ excelMode: 'windows' }}
                />
                <AgGridColumn
                    headerName="Customer Name"
                    field="Customer_Name"
                    filterParams={{ excelMode: 'windows' }}
                />
                <AgGridColumn field="Segment" filterParams={{ excelMode: 'windows' }} />
                <AgGridColumn
                    headerName="Order Date"
                    field="Order_Date"
                    filter="agDateColumnFilter"
                    filterType="date"
                    // filterParams={dateFilterParams}
                    filterParams={dateFilterParams}
                    valueFormatter={(params) => moment(params.value).format('MM/DD/YYYY')}
                />
                {/* <AgGridColumn field="Year" filterParams={{ excelMode: 'windows' }} /> */}
                <AgGridColumn
                    headerName="Ship Date"
                    field="Ship_Date"
                    filter="agDateColumnFilter"
                    filterType="date"
                    filterParams={dateFilterParams}
                    valueFormatter={(params) => moment(params.value).format('MM/DD/YYYY')}
                />

                <AgGridColumn
                    headerName="Sales"
                    field="Sales"
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
                    field="Quantity"
                    enableValue
                    aggFunc="sum"
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    valueFormatter={numberFormatter}
                />
                <AgGridColumn
                    field="Discount"
                    aggFunc="avg"
                    enableValue
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    valueFormatter={percentFormatter}
                />
                <AgGridColumn
                    field="Profit"
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
