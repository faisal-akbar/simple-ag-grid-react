/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import React, { useContext, useMemo, useState } from 'react';
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
import Banner from '../Banner';
import { useAPI } from '../Context/apiContext';
import { useNotification } from '../Context/notificationContext';
import SaveViewToolPanel from '../CustomToolPanel/SaveViewToolPanel';
import { ThemeContext } from '../Theme/ThemeContext';

const MySQLMemo = () => {
    const { notification, setNotification, setBannerOpen } = useNotification();
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const { theme, setTheme } = useContext(ThemeContext);
    const [isLoading, segmentFilter, regionFilter, categoryFilter, subCategoryFilter] = useAPI();

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

    const colDefs = useMemo(
        () => [
            {
                headerName: 'Segment',
                field: 'segment',
                enableRowGroup: true,
                rowGroup: true,
                hide: true,
                filter: 'agSetColumnFilter',
                filterParams: { values: segmentFilter, buttons: ['apply', 'reset'] },
                chartDataType: 'category',
            },
            {
                headerName: 'Region',
                field: 'region',
                enableRowGroup: true,
                rowGroup: true,
                hide: true,
                filter: 'agSetColumnFilter',
                filterParams: { values: regionFilter, buttons: ['apply', 'reset'] },
                chartDataType: 'category',
            },
            {
                headerName: 'Category',
                field: 'category',
                enableRowGroup: true,
                rowGroup: true,
                hide: true,
                filter: 'agSetColumnFilter',
                filterParams: { values: categoryFilter, buttons: ['apply', 'reset'] },
                chartDataType: 'category',
            },
            {
                headerName: 'Sub Category',
                field: 'sub_category',
                enableRowGroup: true,
                rowGroup: true,
                hide: true,
                filter: 'agSetColumnFilter',
                filterParams: { values: subCategoryFilter, buttons: ['apply', 'reset'] },
                chartDataType: 'category',
            },
            {
                headerName: 'Sales',
                field: 'sales',
                aggFunc: 'sum',
                enableValue: true,
                valueFormatter: currencyFormatter,
                filter: 'agNumberColumnFilter',
                // eslint-disable-next-line no-use-before-define
                filterParams: numberFilterParams,
                valueParser: numberParser,
                chartType: 'series',
            },
            {
                headerName: 'Order Date',
                field: 'order_date',
                filter: 'agDateColumnFilter',
                filterType: 'date',
                enableRowGroup: true,
                rowGroup: true,
                hide: true,
                filterParams: dateFilterParams,
                valueFormatter: (params) =>
                    params.value !== undefined ? moment(params.value).format('MM/DD/YYYY') : '',
            },
            {
                headerName: 'Quantity',
                field: 'quantity',
                enableValue: true,
                aggFunc: 'sum',
                filter: 'agNumberColumnFilter',
                filterParams: numberFilterParams,
                valueParser: numberParser,
                valueFormatter: numberFormatter,
                chartType: 'series',
            },
            {
                headerName: 'Discount',
                field: 'discount',
                aggFunc: 'avg',
                enableValue: true,
                filter: 'agNumberColumnFilter',
                filterParams: numberFilterParams,
                valueParser: numberParser,
                valueFormatter: percentFormatter,
                chartType: 'series',
            },
            {
                headerName: 'Profit',
                field: 'profit',
                aggFunc: 'sum',
                enableValue: true,
                valueFormatter: currencyFormatter,
                filter: 'agNumberColumnFilter',
                filterParams: numberFilterParams,
                valueParser: numberParser,
                chartType: 'series',
                cellClassRules: {
                    'text-green-500': 'x >= 0',
                    'text-red-400': 'x < 0',
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [categoryFilter, regionFilter, segmentFilter, subCategoryFilter]
    );

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
                    if (response.rows.length === 0) {
                        params.successCallback(response.rows, 0);
                        return params.api.showNoRowsOverlay();
                    }
                    params.api.hideOverlay();
                    console.log('In POST', response);
                    return params.successCallback(response.rows, response.lastRow);
                })
                .catch((error) => {
                    console.error(error);
                    params.failCallback();
                });
        },
    };

    const onGridReady = (params) => {
        console.log(params);
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        // register datasource with the grid
        params.api.setServerSideDatasource(datasource);
    };

    // SAVE STATE
    const onSaveFilterAndColumnState = () => {
        const filterState = gridApi.getFilterModel();
        const columnState = gridColumnApi.getColumnState();
        console.log('saved filterState & columnState');
        localStorage.setItem('filterState', JSON.stringify(filterState));
        console.log('filterState', filterState);
        localStorage.setItem('columnState', JSON.stringify(columnState));
        console.log('columnState', columnState);
        setBannerOpen(true);
        setNotification('saved');
    };

    const onLoadFilterAndColumnState = () => {
        if (localStorage.filterState) {
            gridApi.setFilterModel(JSON.parse(localStorage.filterState));
        }
        if (localStorage.columnState) {
            gridColumnApi.applyColumnState({
                state: JSON.parse(localStorage.columnState),
                applyOrder: true,
            });
        }
        setBannerOpen(true);
        setNotification('loaded');
    };

    // const onFirstDataRendered = (params) => {
    //     if (localStorage.filterState) {
    //         gridApi.setFilterModel(JSON.parse(localStorage.filterState));
    //     }
    //     if (localStorage.columnState) {
    //         gridColumnApi.applyColumnState({
    //             state: JSON.parse(localStorage.columnState),
    //             applyOrder: true,
    //         });
    //     }
    // };

    // console.log('gridApi', gridApi);

    return (
        <div
            className={
                theme === 'dark'
                    ? 'w-full h-[91vh] overflow-hidden ag-theme-alpine-dark'
                    : 'w-full h-[91vh] overflow-hidden ag-theme-alpine'
            }
        >
            {/* <HeaderServerSide
                onSave={onSaveFilterAndColumnState}
                onLoad={onLoadFilterAndColumnState}
            /> */}
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
                columnDefs={colDefs}
                rowModelType="serverSide"
                serverSideStoreType="partial"
                cacheBlockSize={5}
                frameworkComponents={{ customViewsToolPanel: SaveViewToolPanel }}
                // onFirstDataRendered={onFirstDataRendered}

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
            </AgGridReact>

            {/* eslint-disable-next-line no-nested-ternary */}
            {notification === 'saved' ? (
                <Banner alertTitle="Saved View" />
            ) : notification === 'loaded' ? (
                <Banner alertTitle="Loaded View" />
            ) : null}
        </div>
    );
};

export default MySQLMemo;