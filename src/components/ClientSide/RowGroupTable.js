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
import Banner from '../Banner';
import { useNotification } from '../Context/notificationContext';
import SaveViewToolPanel from '../CustomToolPanel/SaveViewToolPanel';
import { ThemeContext } from '../Theme/ThemeContext';

const RowGroupTable = () => {
    document.title = 'Row Group - React ag-grid';
    const { notification, setNotification, setBannerOpen } = useNotification();
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

    // Save Group State
    function Store(store) {
        return {
            setItem: (key, item) => {
                if (!key) {
                    return null;
                }
                return store.setItem(key, JSON.stringify(item));
            },
            getItem: (key) => {
                if (!key) {
                    return null;
                }
                return JSON.parse(store.getItem(key));
            },
            clear: () => store.clear(),
        };
    }
    const OPEN_GROUP_KEY = 'openGroups';
    const store = Store(window.localStorage);

    function addGroupToStore(id, storeKey) {
        const groups = store.getItem(storeKey);
        if (groups.indexOf(id) > -1) {
            return;
        }
        groups.push(id);
        store.setItem(storeKey, groups);
    }

    function removeGroupFromStore(id, storeKey) {
        const groups = store.getItem(storeKey);
        const index = groups.indexOf(id);
        if (index > -1) {
            groups.splice(index, 1);
        }
        store.setItem(storeKey, groups);
    }

    const onFirstDataRendered = (params) => {
        const groups = store.getItem(OPEN_GROUP_KEY);
        console.log('onFirstDataRendered groups', groups);
        groups.forEach((groupId) => {
            console.log('groupId', groupId);
            const node = params.api.getRowNode(groupId);
            console.log('node', node);
            node.setExpanded(true);
        });
    };

    const onRowGroupOpened = (params) => {
        if (params.node.expanded) {
            console.log('adding id to store', params.node.id);
            addGroupToStore(params.node.id, OPEN_GROUP_KEY);
        } else {
            console.log('removing id from store', params.node.id);
            removeGroupFromStore(params.node.id, OPEN_GROUP_KEY);
        }
    };

    function initialiseGroupStore(storeKey) {
        let groups = store.getItem(storeKey);
        if (!groups) groups = [];
        store.setItem(storeKey, groups);
    }
    initialiseGroupStore(OPEN_GROUP_KEY);

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
                    // field: 'segment',
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
                // suppressHorizontalScroll
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
                onRowGroupOpened={onRowGroupOpened}
                onFirstDataRendered={onFirstDataRendered}
                frameworkComponents={{ customViewsToolPanel: SaveViewToolPanel }}
                // onCellClicked={(params) => {
                //     console.log(getExpandedDetails(params.node));
                // }}
            >
                <AgGridColumn
                    headerName="Segment"
                    field="segment"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Region"
                    field="region"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Category"
                    field="category"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ buttons: ['apply', 'reset'] }}
                    chartDataType="category"
                />
                <AgGridColumn
                    headerName="Sub Category"
                    field="sub_category"
                    enableRowGroup
                    rowGroup
                    hide
                    filter="agSetColumnFilter"
                    filterParams={{ buttons: ['apply', 'reset'] }}
                    chartDataType="category"
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
                    headerName="Order Id"
                    field="order_id"
                    filter="agTextColumnFilter"
                    enableRowGroup
                    hide
                    filterParams={{ buttons: ['apply', 'reset'] }}
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
                    chartType="series"

                    // filterParams={{
                    //   alwaysShowBothConditions: true,
                    //   defaultJoinOperator: 'OR',
                    // }}
                    // allowedAggFuncs={['sum', 'min', 'max']}
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
            {/* eslint-disable-next-line no-nested-ternary */}
            {notification === 'saved' ? (
                <Banner alertTitle="Saved View" />
            ) : notification === 'loaded' ? (
                <Banner alertTitle="Loaded View" />
            ) : null}
        </div>
    );
};

export default RowGroupTable;
