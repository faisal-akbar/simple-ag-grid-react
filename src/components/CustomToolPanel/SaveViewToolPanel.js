/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNotification } from '../Context/notificationContext';

const totalStyle = { paddingBottom: '15px' };

const SaveViewToolPanel = (props) => {
    const { notification, setNotification, setBannerOpen } = useNotification();
    const [numMedals, setNumMedals] = useState(0);
    const [numGold, setNumGold] = useState(0);
    const [numSilver, setNumSilver] = useState(0);
    const [numBronze, setNumBronze] = useState(0);

    const onSaveFilterAndColumnState = () => {
        const filterState = props.api.getFilterModel();
        const columnState = props.columnApi.getColumnState();
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
            props.api.setFilterModel(JSON.parse(localStorage.filterState));
        }
        if (localStorage.columnState) {
            props.columnApi.applyColumnState({
                state: JSON.parse(localStorage.columnState),
                applyOrder: true,
            });
        }
        setBannerOpen(true);
        setNotification('loaded');
    };
    return (
        <div>
            <div className="w-64 my-4">
                <h2 className="my-4 ml-2">
                    <i className="fa fa-view" /> Custom Views
                </h2>
                <div className="border-b border-b-gray-400" />
                <div className="flex flex-col justify-between space-y-2 mt-3">
                    <button
                        onClick={onSaveFilterAndColumnState}
                        type="button"
                        className="mx-3 px-3 py-2 bg-sky-600 dark:rounded-lg cursor-pointer"
                    >
                        Save
                    </button>
                    <button
                        onClick={onLoadFilterAndColumnState}
                        type="button"
                        className="mx-3 px-3 py-2 bg-sky-600 rounded-lg cursor-pointer"
                    >
                        Load
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveViewToolPanel;
