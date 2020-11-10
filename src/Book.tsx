import React from 'react';
import { Exchange } from './App';
import './Book.css';

interface TableProps {
    title: string,
    data: Exchange[],
};

export const Book: React.FC<TableProps> = ({
    title,
    data
}) => {
    return (
        <div className="table-wrapper">
            <table>
                <thead className="title">{title}</thead>
                <thead>
                    <tr>
                        <th> Exchange </th>
                        <th> Rate </th>
                        <th> Amount </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length && data.length > 5 ? data.map((row: Exchange) => {
                            return (
                                <tr>
                                    {
                                        Object.values(row).map((item: string): JSX.Element => {
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
        </div>
    );
};