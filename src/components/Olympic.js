/* eslint-disable no-unused-vars */
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React, { useState } from 'react';
import { icons } from '../lib/icons';
import { sideBar } from '../lib/sideBarConfig';

const OlympicServerSide = () => {
    const avoidServerRequest = true;
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const datasource = {
        getRows(params) {
            console.log(JSON.stringify(params.request, null, 1));
            const url = 'http://localhost:7000/data';
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

    const onGridReady = (params) => {
        setGridApi(params.api);
        // register datasource with the grid
        params.api.setServerSideDatasource(datasource);
    };

    const [countryFilter, setCountryFilter] = useState([]);
    const [sportFilter, setSportFilter] = useState([]);
    const [yearFilter, setYearFilter] = useState([]);
    // useEffect(() => {
    //     fetch('http://localhost:7000/filters')
    //         .then((res) => res.json())
    //         .then((data) => {
    //             const country = data[0].map((item) => item.country);
    //             const sports = data[1].map((item) => item.sport);
    //             const year = data[2].map((item) => item.year);
    //             setCountryFilter(country);
    //             setSportFilter(sports);
    //             setYearFilter(year);
    //         });
    // }, []);

    // useEffect(() => {
    //     fetch('http://localhost:8000/sport')
    //         .then((res) => res.json())
    //         .then((data) => setSportFilter(data));
    // }, []);

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
                suppressHorizontalScroll
                // groupIncludeFooter
                // groupIncludeTotalFooter
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
                //     params.api.getFilterInstance('date', (filterInstance) => {
                //         filterInstance.setModel({
                //             filterType: 'set',
                //             values: ['24/08/2008'],
                //         });
                //         params.api.onFilterChanged();
                //     });
                // }}
            >
                {/* <AgGridColumn field="ATHLETE" filter="agTextColumnFilter" />
                <AgGridColumn field="AGE" />
                <AgGridColumn
                    field="COUNTRY"
                    filter="agSetColumnFilter"
                    filterParams={{ values: countryFilter }}
                    menuTabs={['filterMenuTab']}
                />
                <AgGridColumn field="YEAR" />
                <AgGridColumn field="DATE" />
                <AgGridColumn
                    field="SPORT"
                    filter="agSetColumnFilter"
                    filterParams={{ values: sportFilter }}
                    menuTabs={['filterMenuTab']}
                /> */}
                <AgGridColumn field="athlete" filter="agTextColumnFilter" />
                <AgGridColumn field="age" filter="agNumberColumnFilter" />
                <AgGridColumn
                    field="country"
                    filter="agSetColumnFilter"
                    filterParams={{ values: countryFilter }}
                    menuTabs={['filterMenuTab']}
                />
                {/* <AgGridColumn field="year" filter="agNumberColumnFilter" /> */}
                <AgGridColumn
                    field="year"
                    filter="agSetColumnFilter"
                    filterParams={{ values: yearFilter }}
                />
                <AgGridColumn field="date" />
                <AgGridColumn
                    field="sport"
                    filter="agSetColumnFilter"
                    filterParams={{ values: sportFilter }}
                    menuTabs={['filterMenuTab']}
                />
            </AgGridReact>
        </div>
    );
};

export default OlympicServerSide;
