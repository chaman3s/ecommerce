function cn(...classes) {
  return classes.filter(Boolean).join(" ");
} 

function stringToDate(dateString) { // your timestamp in milliseconds
console.log("dateString", dateString);
const date = new Date(Number(dateString));
console.log("date", date);
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0");
const year = date.getFullYear();

return`${day}/${month}/${year}`;

}
export {cn, stringToDate};