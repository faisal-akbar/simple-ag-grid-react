/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useFeature } from "../../context/featureContext";
import { icons } from "../../lib/icons";
import { sideBar } from "../../lib/sideBarConfig";
import {
    currencyFormatter,
    numberFormatter,
    numberParser,
    percentFormatter
} from "../../lib/utils";
import { LOCAL_KEY_MYSQL_SOCKET } from "../../Workers/localConstants";
import {
    disconnectSocket,
    initiateSocketConnection,
    subscribeToInitialData,
    subscribeToStreamData
} from "../../Workers/socketio.service";
import PreLoader from "../PreLoader";
import { ThemeContext } from "../Theme/ThemeContext";
import ViewsToolPanel from "../Views/ViewsToolPanel";
import CustomAnimationRenderer from "./CustomAnimationRenderer";

const SocketApp = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [initialData, setInitialData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setLocalKey } = useFeature();

  useEffect(() => {
    initiateSocketConnection();
    subscribeToInitialData((err, data) => {
      setInitialData(data);
      setLocalKey(LOCAL_KEY_MYSQL_SOCKET);
      setIsLoading(false);
    });
    return () => {
      disconnectSocket();
    };
  }, [setLocalKey]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    params.api.setRowData(initialData);
    // eslint-disable-next-line no-use-before-define
    startFeed(params.api);
  };

  function startFeed(api) {
    let count = 1;
    // setInterval(() => {
    const thisCount = count++;

    subscribeToStreamData((err, data) => {
      const resultCallback = () => {
        console.log(`transactionApplied() - ${thisCount}`);
      };
      api.applyTransactionAsync({ add: data }, resultCallback);
      console.log(`applyTransactionAsync() - ${thisCount}`);
    });
    // }, 500);
  }

  const onFlushTransactions = () => {
    gridApi.flushAsyncTransactions();
  };

  const numberFilterParams = {
    buttons: ["apply", "reset"],
    defaultOption: "inRange",
    alwaysShowBothConditions: false,
    defaultJoinOperator: "AND",
  };

  const dateFilterParams = {
    buttons: ["apply", "reset"],
    // eslint-disable-next-line consistent-return
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      const cellDate = moment(cellValue).startOf("day").toDate();

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
    defaultOption: "inRange",
  };

  const colDefs = useMemo(
    () => [
      {
        headerName: "Segment",
        field: "segment",
        enableRowGroup: true,
        rowGroup: true,
        hide: true,
        filter: "agSetColumnFilter",
        filterParams: { buttons: ["apply", "reset"] },
        chartDataType: "category",
        keyCreator: ({ value }) => (value === null ? "Null" : value),
      },
      {
        headerName: "Region",
        field: "region",
        enableRowGroup: true,
        rowGroup: true,
        hide: true,
        filter: "agSetColumnFilter",
        filterParams: { buttons: ["apply", "reset"] },
        chartDataType: "category",
        keyCreator: ({ value }) => (value === null ? "Null" : value),
      },
      {
        headerName: "Category",
        field: "category",
        enableRowGroup: true,
        rowGroup: true,
        hide: true,
        filter: "agSetColumnFilter",
        filterParams: { buttons: ["apply", "reset"] },
        chartDataType: "category",
        keyCreator: ({ value }) => (value === null ? "Null" : value),
      },
      {
        headerName: "Sub Category",
        field: "sub_category",
        enableRowGroup: true,
        rowGroup: true,
        hide: true,
        filter: "agSetColumnFilter",
        filterParams: { buttons: ["apply", "reset"] },
        chartDataType: "category",
        keyCreator: ({ value }) => (value === null ? "Null" : value),
      },
      {
        headerName: "Sales",
        field: "sales",
        aggFunc: "sum",
        enableValue: true,
        valueFormatter: currencyFormatter,
        filter: "agNumberColumnFilter",
        // eslint-disable-next-line no-use-before-define
        filterParams: numberFilterParams,
        valueParser: numberParser,
        chartType: "series",
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        headerName: "Order Date",
        field: "order_date",
        filter: "agDateColumnFilter",
        filterType: "date",
        enableRowGroup: true,
        rowGroup: true,
        hide: true,
        filterParams: dateFilterParams,
        valueFormatter: (params) =>
          params.value !== undefined
            ? moment(params.value).format("MM/DD/YYYY")
            : "",
      },
      {
        headerName: "Quantity",
        field: "quantity",
        enableValue: true,
        aggFunc: "sum",
        filter: "agNumberColumnFilter",
        filterParams: numberFilterParams,
        valueParser: numberParser,
        valueFormatter: numberFormatter,
        chartType: "series",
        // cellRenderer:"agAnimateShowChangeCellRenderer"
        cellRendererFramework: CustomAnimationRenderer,
      },
      {
        headerName: "Discount",
        field: "discount",
        aggFunc: "avg",
        enableValue: true,
        filter: "agNumberColumnFilter",
        filterParams: numberFilterParams,
        valueParser: numberParser,
        valueFormatter: percentFormatter,
        chartType: "series",
        // cellRenderer:"agAnimateShowChangeCellRenderer"
        // cellRendererFramework: CustomAnimationRenderer,
      },
      {
        headerName: "Profit",
        field: "profit",
        aggFunc: "sum",
        enableValue: true,
        valueFormatter: currencyFormatter,
        filter: "agNumberColumnFilter",
        filterParams: numberFilterParams,
        valueParser: numberParser,
        chartType: "series",
        cellRenderer: "agAnimateShowChangeCellRenderer",
        // cellRendererFramework: CustomAnimationRenderer,
        // cellClassRules: {
        //     'text-green-500': 'x >= 0',
        //     'text-red-400': 'x < 0',
        // },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div
      className={
        theme === "dark"
          ? "ag-theme-alpine-dark grid-wh"
          : "ag-theme-alpine grid-wh"
      }
    >
      {/* <div style={{ marginBottom: '5px' }}>
          <button type="button" onClick={() => onFlushTransactions()}>
            Flush Transactions
          </button>
          <span id="eMessage" />
        </div> */}
      {!isLoading ? (
        <AgGridReact
          getRowNodeId={(data) => data.row_id}
          defaultColDef={{
            flex: 1,
            minWidth: 150,
            filter: true,
            sortable: true,
            resizable: true,
          }}
          autoGroupColumnDef={{
            // headerName: 'Segment',
            // field: 'Segment',
            minWidth: 300,
            cellRendererParams: {
              footerValueGetter: (params) => {
                const isRootLevel = params.node.level === -1;
                if (isRootLevel) {
                  return "Grand Total";
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
          columnDefs={colDefs}
          frameworkComponents={{ customViewsToolPanel: ViewsToolPanel }}
          // rowModelType="serverSide"
          // serverSideStoreType="partial"
          // cacheBlockSize={5}
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
      ) : (
        <div>
          <PreLoader isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default SocketApp;
