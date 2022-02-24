import { useMemo } from 'react';

export default function useMemoize() {
    const rowStyle = useMemo(
        () => ({
            height: '41px',
        }),
        []
    );
    const defaultColDef = useMemo(
        () => ({
            flex: 1,
            minWidth: 150,
            filter: true,
            sortable: true,
            resizable: true,
        }),
        []
    );
    const autoGroupColumnDef = useMemo(
        () => ({
            // headerName: 'Segment',
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
        }),
        []
    );

    return [rowStyle, defaultColDef, autoGroupColumnDef];
}
