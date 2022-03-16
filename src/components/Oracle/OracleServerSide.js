/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useAPI } from '../../context/apiContext';
import { useFeature } from '../../context/featureContext';
import useMemoize from '../../hooks/useMemoize';
import { icons } from '../../lib/icons';
import { sideBar } from '../../lib/sideBarConfig';
import {
    currencyFormatter,
    dateFilterParams,
    numberFilterParams,
    numberFormatter,
    numberParser,
    // eslint-disable-next-line prettier/prettier
    percentFormatter
} from '../../lib/utils';
import { DATA_URL } from '../../Workers/constants';
import { LOCAL_KEY_ORACLE } from '../../Workers/localConstants';
import { ThemeContext } from '../Theme/ThemeContext';
import ViewsToolPanel from '../Views/ViewsToolPanel';

const OracleServerSide = () => {
    const [components] = useState({
        customViewsToolPanel: ViewsToolPanel,
    });
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState(null);
    const { theme, setTheme } = useContext(ThemeContext);
    const [isLoading, segmentFilter, regionFilter, categoryFilter, subCategoryFilter] = useAPI();
    const [defaultColDef, autoGroupColumnDef] = useMemoize();
    const { setLocalKey } = useFeature();

    const datasource = {
        getRows(params) {
            console.log(JSON.stringify(params.request, null, 1));

            fetch(DATA_URL, {
                method: 'post',
                body: JSON.stringify(params.request),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            })
                .then((httpResponse) => httpResponse.json())
                .then((response) => {
                    console.log('In POST', response);
                    // console.log('In POST', response.lastRow);
                    if (response.rows.length === 0) {
                        params.successCallback(response.rows, 0);
                        return params.api.showNoRowsOverlay();
                    }
                    params.api.hideOverlay();
                    // =========THIS CODE IS FOR HANDLING DATE IN ROW GROUP==============
                    const exists =
                        response.rows.filter((o) => o.hasOwnProperty('ORDER_DATE')).length > 0;
                    console.log('exists', exists);
                    if (exists) {
                        const newRows = response.rows.map((d) => {
                            const properties = {
                                ...d,
                                ORDER_DATE: moment(d.ORDER_DATE).format('DD-MMM-YY'),
                            };
                            return properties;
                        });

                        return params.successCallback(newRows, response.lastRow);
                    }
                    // ==================================================================
                    return params.successCallback(response.rows, response.lastRow);
                })
                .catch((error) => {
                    console.error(error);
                    params.failCallback();
                });
        },
    };

    // console.log(datasource);
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        // register datasource with the grid
        params.api.setServerSideDatasource(datasource);
        setLocalKey(LOCAL_KEY_ORACLE);
    };

    return (
        <div
            className={
                theme === 'dark' ? 'ag-theme-alpine-dark grid-wh' : 'ag-theme-alpine grid-wh'
            }
        >
            <AgGridReact
                defaultColDef={defaultColDef}
                autoGroupColumnDef={autoGroupColumnDef}
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
                components={components}
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
                {/* <AgGridColumn field="SEGMENT" filter="agTextColumnFilter" /> */}

                <AgGridColumn
                    headerName="Segment"
                    field="SEGMENT"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ values: segmentFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Region"
                    field="REGION"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ values: regionFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Category"
                    field="CATEGORY"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ values: categoryFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sub Category"
                    field="SUB_CATEGORY"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{
                        values: subCategoryFilter,
                        buttons: ['apply', 'reset'],
                    }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Order Date"
                    field="ORDER_DATE"
                    filter="agDateColumnFilter"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={dateFilterParams}
                    valueFormatter={(params) =>
                        params.value !== undefined ? moment(params.value).format('MM/DD/YYYY') : ''
                    }
                />
                <AgGridColumn
                    headerName="Order Id"
                    field="ORDER_ID"
                    filter="agTextColumnFilter"
                    enableRowGroup
                    hide
                    filterParams={{ buttons: ['apply', 'reset'] }}
                />
                <AgGridColumn
                    headerName="Sales"
                    field="SALES"
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
                    chartDataType="series"
                    // filterParams={{
                    //   alwaysShowBothConditions: true,
                    //   defaultJoinOperator: 'OR',
                    // }}
                    // allowedAggFuncs={['sum', 'min', 'max']}
                />

                <AgGridColumn
                    headerName="Quantity"
                    field="QUANTITY"
                    enableValue
                    aggFunc="sum"
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    valueFormatter={numberFormatter}
                    chartDataType="series"
                    // filterParams={{
                    //   alwaysShowBothConditions: true,
                    //   defaultJoinOperator: 'OR',
                    // }}
                />
                <AgGridColumn
                    headerName="Discount"
                    field="DISCOUNT"
                    aggFunc="avg"
                    enableValue
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    valueFormatter={percentFormatter}
                    chartDataType="series"
                />
                <AgGridColumn
                    headerName="Profit"
                    field="PROFIT"
                    aggFunc="sum"
                    enableValue
                    valueFormatter={currencyFormatter}
                    filter="agNumberColumnFilter"
                    filterParams={numberFilterParams}
                    valueParser={numberParser}
                    chartDataType="series"
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
