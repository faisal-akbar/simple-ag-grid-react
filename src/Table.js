import React, { useState } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => {
      setRowData(data);
    };

    fetch('data/superstore_data.json')
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };


  // adds subtotals
const groupIncludeFooter = true;
// includes grand total
const groupIncludeTotalFooter = true;

const currencyFormatter =(params)=>{
    if(params.value!==undefined){
    return '$' + formatNumber(params.value)}
}

// Function to convert String and do sum/avg
function CustomSumFunc(array) {
    let sum = 0;
    array.forEach( function(value) {sum += Number(value);} );
    return sum;
}
// function CustomAvgFunc(array) {
//     var sum = 0;
//     array.forEach( function(value) {sum += Number(value);} );
//     return sum / array.length
// }

function formatNumber(number) {
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        id="myGrid"
        style={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden'
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
          suppressAggFuncInHeader= {true}
          animateRows={true}
        //   sideBar={true}
          rowData={rowData}
          onGridReady={onGridReady}
        >
          <AgGridColumn headerName= 'Sales' field="Segment" rowGroup={true} hide={true} />
          <AgGridColumn field="Region" rowGroup={true} hide={true} />
          <AgGridColumn field="Category" rowGroup={true} hide={true} />
          <AgGridColumn field="Sub_Category" rowGroup={true} hide={true} />
          <AgGridColumn
            headerName= 'Sales'
            field="Sales"
            // aggFunc="sum"
            aggFunc={CustomSumFunc}
            enableValue={true}
            valueFormatter={currencyFormatter}
            // allowedAggFuncs={['sum', 'min', 'max']}
          />
          <AgGridColumn field="Profit" aggFunc={CustomSumFunc} valueFormatter={currencyFormatter} />
          <AgGridColumn field="Quantity" aggFunc={CustomSumFunc}  />
        </AgGridReact>
      </div>
    </div>
  );
};