import React from "react";
import styles from "./styles/ChatTable.module.css";

export function createDynamicTableData(jsonData: string | any[]) {
    let dataArray: any[];

    if (typeof jsonData === "string") {
        dataArray = JSON.parse(jsonData);
    } else {
        dataArray = jsonData;
    }

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return { columns: [], data: [] };
    }

    const firstRow = dataArray[0];
    const columns = Object.keys(firstRow).map((key) => ({
        title: key,
        dataIndex: key,
        key,
    }));

    return {
        columns,
        data: dataArray,
    };
}

export function ChatTable(jsondata: any) {
    const { columns, data } = createDynamicTableData(jsondata["jsonData"]);

    return (
        <div className={styles.chatTable}>
            <div className={styles.chatTable__container}>
                <table className={styles.chatTable__table}>
                    <thead>
                        <tr className={styles.chatTable__thead}>
                            {columns.map((col) => (
                                <th key={col.key}>{col.title}</th>
                            ))}
                        </tr>
                    </thead>
                </table>
                <div className={styles.chatTable__bodyContainer}>
                    <table className={styles.chatTable__table}>
                        <tbody className={styles.chatTable__tbody}>
                            {data.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                    {columns.map((col) => (
                                        <td key={col.key}>{row[col.dataIndex]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}