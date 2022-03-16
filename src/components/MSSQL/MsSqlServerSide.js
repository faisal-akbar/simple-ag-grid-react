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
import { LOCAL_KEY_MSSQL } from '../../Workers/localConstants';
import { ThemeContext } from '../Theme/ThemeContext';
import ViewsToolPanel from '../Views/ViewsToolPanel';

const MsSqlServerSide = () => {
    const [components] = useState({
        customViewsToolPanel: ViewsToolPanel,
    });
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const { theme, setTheme } = useContext(ThemeContext);
    const [defaultColDef, autoGroupColumnDef] = useMemoize();
    const [isLoading, segmentFilter, regionFilter, categoryFilter, subCategoryFilter] = useAPI();
    const { setLocalKey } = useFeature();

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
                    if (response.rows.length === 0) {
                        params.successCallback(response.rows, 0);
                        return params.api.showNoRowsOverlay();
                    }
                    params.api.hideOverlay();
                    // =========THIS CODE IS FOR HANDLING DATE IN ROW GROUP==============
                    const exists =
                        response.rows.filter((o) => o.hasOwnProperty('order_date')).length > 0;
                    console.log('exists', exists);
                    if (exists) {
                        const newRows = response.rows.map((d) => {
                            const properties = {
                                ...d,
                                order_date: d.order_date.slice(0, 10),
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

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        // register datasource with the grid
        params.api.setServerSideDatasource(datasource);
        setLocalKey(LOCAL_KEY_MSSQL);
    };

    return (
        <div
            className={
                theme === 'dark' ? 'ag-theme-alpine-dark grid-wh' : 'ag-theme-alpine grid-wh'
            }
        >
            <AgGridReact
                // rowStyle={rowStyle}
                defaultColDef={defaultColDef}
                autoGroupColumnDef={autoGroupColumnDef}
                // suppressHorizontalScroll
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
                {/* <AgGridColumn field="segment" filter="agTextColumnFilter" /> */}
                <AgGridColumn
                    headerName="Segment"
                    field="segment"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ values: segmentFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Region"
                    field="region"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ values: regionFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Category"
                    field="category"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{ values: categoryFilter, buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sub Category"
                    field="sub_category"
                    enableRowGroup
                    rowGroup
                    hide
                    filterParams={{
                        values: subCategoryFilter,
                        buttons: ['apply', 'reset'],
                    }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sales"
                    field="sales"
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
                    chartDataType="series"

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
                    enableRowGroup
                    rowGroup
                    hide
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
                    chartDataType="series"
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
                    chartDataType="series"
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

export default MsSqlServerSide;
