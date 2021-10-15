/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useState } from 'react';
import { icons } from '../lib/icons';
import { sideBar } from '../lib/sideBarConfig';
import { currencyFormatter, numberParser, percentFormatter } from '../lib/utils';

const RowGroupTable = () => {
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
                    groupIncludeFooter={groupIncludeFooter}
                    groupIncludeTotalFooter={groupIncludeTotalFooter}
                    suppressAggFuncInHeader
                    animateRows
                    sideBar={sideBar}
                    icons={icons}
                    rowGroupPanelShow="always"
                    rowSelection="multiple"
                    rowData={rowData}
                    onGridReady={onGridReady}
                >
                    <AgGridColumn
                        headerName="Segment"
                        field="Segment"
                        enableRowGroup
                        rowGroup
                        hide
                    />
                    <AgGridColumn field="Region" enableRowGroup rowGroup hide />
                    <AgGridColumn field="Category" enableRowGroup rowGroup hide />
                    <AgGridColumn field="Sub_Category" enableRowGroup rowGroup hide />
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

export default RowGroupTable;
