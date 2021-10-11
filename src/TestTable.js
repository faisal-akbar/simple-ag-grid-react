import React, { useState } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import getData from './data';

export const TestExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        id="myGrid"
        style={{
          height: '90vh',
          width: '100vw',
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          defaultColDef={{
            flex: 1,
            minWidth: 150,
            sortable: true,
            resizable: true,
          }}
          autoGroupColumnDef={{
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
          groupIncludeFooter={true}
          groupIncludeTotalFooter={true}
          animateRows={true}
          rowData={getData()}
          onGridReady={onGridReady}
        >
          <AgGridColumn field="country" rowGroup={true} hide={true} />
          <AgGridColumn field="year" rowGroup={true} hide={true} />
          <AgGridColumn field="gold" aggFunc="sum" />
          <AgGridColumn field="silver" aggFunc="sum" />
          <AgGridColumn field="bronze" aggFunc="sum" />
        </AgGridReact>
      </div>
    </div>
  );
};