/* eslint-disable no-shadow */
const dateArray = [];
const dimensionArray = [];
const measureArray = [];
const textArray = [];

const makeDateColDef = (dateArray) => {
    const colArray = dateArray;
    const colDefs = colArray.map(
        (col) =>
            `{headerName: '${col}',field: '${col}',filter: 'agDateColumnFilter',enableRowGroup: true,rowGroup: true,hide: true,filterParams: dateFilterParams,valueFormatter: (params) => params.value !== undefined ? moment(params.value).format('MM/DD/YYYY') : ''}`
    );
    return colDefs;
};

const makeDimensionColDef = (dimArray) => {
    const colArray = dimArray;
    const colDefs = colArray.map(
        (col) =>
            `{headerName: '${col}',field: '${col}',enableRowGroup: true,rowGroup: true,hide: true,filter: 'agSetColumnFilter',filterParams: { values: ${col}Filter, buttons: ['apply', 'reset'] },chartDataType: 'category'}`
    );
    return colDefs;
};

// change valueFormatter based on format ex. currency, percent etc
const makeMeasureColDef = (numArray) => {
    const colArray = numArray;
    const colDefs = colArray.map(
        (col) =>
            `{headerName: '${col}',field: '${col}',enableValue: true,aggFunc: 'sum',filter: 'agNumberColumnFilter',filterParams: numberFilterParams,valueParser: numberParser,valueFormatter: numberFormatter,chartDataType: 'series'}`
    );
    return colDefs;
};

const makeTextColDef = (textArray) => {
    const colArray = textArray;
    const colDefs = colArray.map(
        (col) =>
            `{headerName: '${col}',field: '${col}',enableRowGroup: true,rowGroup: true,hide: true,filter: 'agTextColumnFilter',filterParams: { buttons: ['apply', 'reset'] },chartDataType: 'category'}`
    );
    return colDefs;
};

// eslint-disable-next-line consistent-return
const makeColDefs = (fieldsArray, type) => {
    const colArray = fieldsArray;

    if (type === 'date') {
        return makeDateColDef(colArray);
    }
    if (type === 'dimension') {
        return makeDimensionColDef(colArray);
    }
    if (type === 'measure') {
        return makeMeasureColDef(colArray);
    }
    if (type === 'text') {
        return makeTextColDef(colArray);
    }
};

// Find number distinct value for creating set Filter and decide text filter
const checkDistinctCategory = (dimArray, tableName) => {
    const colArray = dimArray;
    const query = colArray.map((col) => `SELECT COUNT(DISTINCT ${col}) FROM ${tableName};`);
    return query;
};

// Query for selected dimensions  filter values
const filterQuery = (filterArray, tableName) => {
    const colArray = filterArray;
    const query = colArray.map(
        (col) => `SELECT DISTINCT ${col} FROM ${tableName} ORDER BY ${col} ASC;`
    );
    return query;
};

// create useState for each dimension Filter
const createFilterHooks = (filterArray) => {
    const colArray = filterArray;
    const removeUnderscore = colArray.map((col) => col.replace(/_/g, ' '));
    const firstLetterCase = removeUnderscore.map((col) =>
        col.replace(/\b\w/g, (l) => l.toUpperCase())
    );
    const removeSpace = firstLetterCase.map((col) => col.replace(/ /g, ''));

    const hooks = removeSpace.map(
        (item) =>
            `const [${item.charAt(0).toLowerCase()}${item.slice(
                1
            )}Filter, set${item}Filter] = useState([]);`
    );
    return hooks;
};

// setFilter hooks for each dimension filter
const setFilter = (filterArray) => {
    const colArray = filterArray;
    const removeUnderscore = colArray.map((col) => col.replace(/_/g, ' '));
    const firstLetterCase = removeUnderscore.map((col) =>
        col.replace(/\b\w/g, (l) => l.toUpperCase())
    );
    const removeSpace = firstLetterCase.map((col) => col.replace(/ /g, ''));

    const setFilterValues = removeSpace.map(
        (item, index) => `set${item}Filter(data[${index}].map(item=>item.${colArray[index]}));`
    );
    return setFilterValues;
};

console.log(makeColDefs(dateArray, 'date'));
console.log(makeColDefs(dimensionArray, 'dimension'));
console.log(makeColDefs(measureArray, 'measure'));
console.log(makeColDefs(textArray, 'text'));

// Check dimensions for filters values in MySql
console.log(checkDistinctCategory(dimensionArray, 'sample_Data.superstore'));

const selectedDimForFilters = [];
// Server Side
console.log(filterQuery(selectedDimForFilters, 'sample_Data.superstore'));

// Client Side
console.log(createFilterHooks(selectedDimForFilters));
console.log(setFilter(selectedDimForFilters));
