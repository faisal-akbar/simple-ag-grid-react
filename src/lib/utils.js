const formatNumber = (num, decimal) => Number.parseFloat(num).toFixed(decimal);
// const formatNumber=(number)=> {
//     return Math.floor(number)
//       .toString()
//       .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
//   }

export const currencyFormatter = (params) => {
    if (params.value !== undefined) {
        return `$${formatNumber(params.value, 2)}`;
    }
    return null;
};

// Function to convert String and do sum/avg
export const CustomSumFunc = (array) => {
    let sum = 0;
    array.forEach((value) => {
        sum += Number(value);
    });
    return sum;
};
// function CustomAvgFunc(array) {
//     var sum = 0;
//     array.forEach( function(value) {sum += Number(value);} );
//     return sum / array.length
// }

export const numberParser = (params) => {
    const { newValue } = params;
    let valueAsNumber;
    if (newValue === null || newValue === undefined || newValue === '') {
        valueAsNumber = null;
    } else {
        valueAsNumber = parseFloat(params.newValue);
    }
    return valueAsNumber;
};

export const percentFormatter = (params) => {
    if (params.value !== undefined) {
        return `${formatNumber(params.value, 3) * 100}%`;
    }
    return null;
};
