const moment = require('moment');

const text = "WHERE REGION ='USA' AND EFFECTIVE_DATE = '2021-10-14T04jhjhuuhu' and REGION ='USA'";

// const regex = /EFFECTIVE_DATE = '.+?(?= )/gm;
const regex = /EFFECTIVE_DATE\s=\s([^\s]+)/gm;
const dateExtract = /EFFECTIVE_DATE = '.{0,10}/gm;

const newDate = `${text.match(dateExtract)}'`;
console.log(newDate);
console.log(text.replace(regex, newDate));

// const test = [`country IN ('Afghanistan', 'Algeria')`];
// console.log(test.length);

const cellDate = moment('20-NOV-21').startOf('day').toDate();
console.log(cellDate);
