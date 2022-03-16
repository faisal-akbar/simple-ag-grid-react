/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useFeature } from '../../context/featureContext';
import { icons } from '../../lib/icons';
import { sideBar } from '../../lib/sideBarConfig';
import {
    currencyFormatter,
    numberFormatter,
    numberParser,
    // eslint-disable-next-line prettier/prettier
    percentFormatter
} from '../../lib/utils';
import { LOCAL_KEY_ROW_GROUP_TABLE } from '../../Workers/localConstants';
import { ThemeContext } from '../Theme/ThemeContext';
import ViewsToolPanel from '../Views/ViewsToolPanel';

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
const store = new Store(window.localStorage);
const OPEN_GROUP_KEY = 'openGroups';

(function initialiseGroupStore() {
    let groups = store.getItem(OPEN_GROUP_KEY);
    if (!groups) groups = [];
    store.setItem(OPEN_GROUP_KEY, groups);
})();

function addGroupToStore(id) {
    const groups = store.getItem(OPEN_GROUP_KEY);
    if (groups.indexOf(id) > -1) {
        return;
    }
    groups.push(id);
    store.setItem(OPEN_GROUP_KEY, groups);
}

function removeGroupFromStore(id) {
    const groups = store.getItem(OPEN_GROUP_KEY);
    const index = groups.indexOf(id);
    if (index > -1) {
        groups.splice(index, 1);
    }
    store.setItem(OPEN_GROUP_KEY, groups);
}

const RowGroupTable = () => {
    document.title = 'Row Group - React ag-grid';
    const [component] = useState({
        customViewsToolPanel: ViewsToolPanel,
    });
    const { setLocalKey } = useFeature();
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState(null);
    const { theme, setTheme } = useContext(ThemeContext);

    const onGridReady = (params) => {
        setLocalKey(LOCAL_KEY_ROW_GROUP_TABLE);
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

    // Save group state
    const onFirstDataRendered = (_params) => {
        const groups = store.getItem(OPEN_GROUP_KEY);
        groups.forEach((groupId) => {
            const node = gridApi.getRowNode(groupId);
            node.setExpanded(true);
        });
    };

    const onRowGroupOpened = (params) => {
        if (params.node.expanded) {
            console.log('adding id to store', params.node.id);
            addGroupToStore(params.node.id);
        } else {
            console.log('removing id from store', params.node.id);
            removeGroupFromStore(params.node.id);
        }
        console.log(store.getItem(OPEN_GROUP_KEY));
    };

    return (
        <div
            className={
                theme === 'dark' ? 'ag-theme-alpine-dark grid-wh' : 'ag-theme-alpine grid-wh'
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
                components={component}
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
                    keyCreator={({ value }) => (value === null ? 'Null' : value)}
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
                    keyCreator={({ value }) => (value === null ? 'Null' : value)}
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
                    keyCreator={({ value }) => (value === null ? 'Null' : value)}
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
                    keyCreator={({ value }) => (value === null ? 'Null' : value)}
                />
                <AgGridColumn
                    headerName="Order Date"
                    field="order_date"
                    filter="agDateColumnFilter"
                    enableRowGroup
                    rowGroup
                    hide
                    // filterParams={dateFilterParams}
                    filterParams={dateFilterParams}
                    valueFormatter={(params) =>
                        params.value !== undefined ? moment(params.value).format('MM/DD/YYYY') : ''
                    }
                    // keyCreator={({ value }) => (value === null ? 'Null' : value)}
                />
                <AgGridColumn
                    headerName="Order Id"
                    field="order_id"
                    filter="agTextColumnFilter"
                    enableRowGroup
                    hide
                    filterParams={{ buttons: ['apply', 'reset'] }}
                    keyCreator={({ value }) => (value === null ? 'Null' : value)}
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
            {/* eslint-disable-next-line no-nested-ternary */}
            {/* {notification === 'saved' ? (
                <Banner alertTitle="Saved View" />
            ) : notification === 'loaded' ? (
                <Banner alertTitle="Loaded View" />
            ) : null} */}
        </div>
    );
};

export default RowGroupTable;
