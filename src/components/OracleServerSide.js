/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';
import { icons } from '../lib/icons';
import { sideBar } from '../lib/sideBarConfig';
import { currencyFormatter, numberFormatter, numberParser, percentFormatter } from '../lib/utils';

const OracleServerSide = () => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState(null);

    const datasource = {
        getRows(params) {
            console.log(JSON.stringify(params.request, null, 1));
            const url = 'http://localhost:8000/data';
            fetch(url, {
                method: 'post',
                body: JSON.stringify(params.request),
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
            })
                .then((httpResponse) => httpResponse.json())
                .then((response) => {
                    console.log('In POST', response.rows);
                    console.log('In POST', response.lastRow);
                    params.successCallback(response.rows, response.lastRow);
                })
                .catch((error) => {
                    console.error(error);
                    params.failCallback();
                });
        },
    };

    console.log(datasource);
    const onGridReady = (params) => {
        setGridApi(params);
        // register datasource with the grid
        params.api.setServerSideDatasource(datasource);
    };

    const [segmentFilter, setSegmentFilter] = useState([]);
    const [regionFilter, setRegionFilter] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [subCategoryFilter, setSubCategoryFilter] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8000/filters')
            .then((res) => res.json())
            .then((data) => {
                const segment = data[0].map((item) => item.SEGMENT);
                const region = data[1].map((item) => item.REGION);
                const category = data[2].map((item) => item.CATEGORY);
                const subCategory = data[3].map((item) => item.SUB_CATEGORY);
                setSegmentFilter(segment);
                setRegionFilter(region);
                setCategoryFilter(category);
                setSubCategoryFilter(subCategory);
            });
    }, []);

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
                sideBar={sideBar}
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
                {/* <AgGridColumn field="DATE" /> */}
                <AgGridColumn
                    headerName="Segment"
                    field="SEGMENT"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ values: segmentFilter, excelMode: 'windows' }}
                    chartDataType="category"
                />
                <AgGridColumn
                    field="REGION"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ values: regionFilter, excelMode: 'windows' }}
                    chartDataType="category"
                />
                <AgGridColumn
                    field="CATEGORY"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ values: categoryFilter, excelMode: 'windows' }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sub Category"
                    field="SUB_CATEGORY"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ values: subCategoryFilter, excelMode: 'windows' }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sales"
                    field="SALES"
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
                    field="QUANTITY"
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
                    field="DISCOUNT"
                    aggFunc="avg"
                    enableValue
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    valueFormatter={percentFormatter}
                    chartType="series"
                />
                <AgGridColumn
                    field="PROFIT"
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

export default OracleServerSide;
