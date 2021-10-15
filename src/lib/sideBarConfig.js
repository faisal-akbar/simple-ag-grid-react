// eslint-disable-next-line import/prefer-default-export
export const sideBar = {
    toolPanels: [
        {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            minWidth: 225,
            maxWidth: 225,
            width: 225,
            toolPanelParams: {
                // suppressRowGroups: true,
                // suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true,
                // suppressColumnFilter: true,
                // suppressColumnSelectAll: true,
                suppressColumnExpandAll: true,
            },
        },
        {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
            minWidth: 180,
            maxWidth: 400,
            width: 250,
        },
    ],
    position: 'right',
    // defaultToolPanel: 'filters'
};
