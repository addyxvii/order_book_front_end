import React, { FunctionComponent } from 'react';

type TableProps = {
    title: string,
    exchange?: string,
    rate?: string,
    amount?: string,

}
 const Book: FunctionComponent<TableProps> = ({ title, exchange, rate, amount }) => {
return (
<table>
 <tr>
    {title}
 </tr>
 <tr>
    <th> Exchange </th>
    <th> Rate </th>
    <th> Amount </th>
    <tr>{amount}</tr>
</tr>
 <tr>
    <td>{exchange}</td>
    <td>{rate}</td>
    <td>$100</td>
 </tr>
</table> 
)}

export default Book;

