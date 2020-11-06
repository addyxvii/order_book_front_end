import React, { FunctionComponent } from 'react';
import './Book.css';


interface TableProps {
    title: string,
    data: any[]
}

const Book: FunctionComponent<TableProps> = ({
    title,
    data
}) => {
    console.log(data.length)
    return (
        <table>
            <thead>
                <tr>
                    <td>{title}</td>
                </tr>
            </thead>
            <thead>
                <tr>
                    <th> Exchange </th>
                    <th> Rate </th>
                    <th> Amount </th>
                </tr>
            </thead>
            <tbody>
                {
                    data && data.length && data.length > 8 ? data.map((row: any) => {
                        return (
                            <tr>
                                {
                                    Object.values(row).map((item: any) => {
                                        return (
                                            <td>{item}</td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    }) : "loading table..."
                }
            </tbody>
        </table>
    )
}

export default Book;

