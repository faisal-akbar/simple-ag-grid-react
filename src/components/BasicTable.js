/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import React, { useState } from 'react';
import { icons } from '../lib/icons';
import { currencyFormatter, numberParser, percentFormatter } from '../lib/utils';

const BasicTable = () => {
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

    // adds subtotals
    const groupIncludeFooter = true;
    // includes grand total
    const groupIncludeTotalFooter = true;

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

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div
                id="myGrid"
                style={{
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                }}
                className="ag-theme-alpine"
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
                    autoGroupColumnDef={{
                        // headerName: 'Segment',
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
                    groupIncludeFooter={groupIncludeFooter}
                    groupIncludeTotalFooter={groupIncludeTotalFooter}
                    suppressAggFuncInHeader
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
                    <AgGridColumn field="Customer_Name" filterParams={{ excelMode: 'windows' }} />
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
                    <AgGridColumn field="Country_Region" filterParams={{ excelMode: 'windows' }} />
                    <AgGridColumn
                        headerName="Sales"
                        field="Sales"
                        // aggFunc="sum"
                        aggFunc="sum"
                        enableValue
                        valueFormatter={currencyFormatter}
                        // cellClassRules={{
                        //     'rag-green': 'x < 1000',
                        //     'rag-amber': 'x >= 1000 && x < 2000',
                        //     'rag-red': 'x >= 2000',
                        // }}
                        filter="agNumberColumnFilter"
                        valueParser={numberParser}

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
                        valueParser={numberParser}
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
                        valueParser={numberParser}
                        valueFormatter={percentFormatter}
                    />
                    <AgGridColumn
                        field="Profit"
                        aggFunc="sum"
                        enableValue
                        valueFormatter={currencyFormatter}
                        filter="agNumberColumnFilter"
                        valueParser={numberParser}
                        cellClassRules={{
                            'text-green-500': 'x >= 0',
                            'text-red-400': 'x < 0',
                        }}
                    />
                </AgGridReact>
            </div>
        </div>
    );
};

export default BasicTable;
