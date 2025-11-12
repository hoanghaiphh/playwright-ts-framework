import logger from '@utils/logger';
import * as ExcelJS from 'exceljs';
import * as path from 'path';

export interface DataRow {
    [header: string]: string | number | null;
}

function getCellValue(value: ExcelJS.CellValue): string | number | null {
    if (value === undefined || value === null || value === '') return null;

    if (typeof value === 'object') {
        // Formula Result --> result
        if ('formula' in value && 'result' in value) {
            return value.result === undefined ? null : (value.result as string | number | null);
        }
        // Rich Text --> text
        if ('text' in value) return value.text?.toString().trim() ?? null;
        // Date
        if (value instanceof Date) return value.toISOString();
        // other objects --> convert to string
        return value.toString().trim() !== '' ? value.toString().trim() : null;
    }

    const stringValue = value.toString().trim(); // string, number, boolean

    return stringValue !== '' ? (value as string | number | null) : null;
}

export async function readExcelFile(relativePath: string, sheetName?: string): Promise<DataRow[]> {
    const filePath = path.resolve(relativePath);

    const workbook = new ExcelJS.Workbook();
    try {
        await workbook.xlsx.readFile(filePath);
    } catch (error) {
        logger.error(`ERROR: Failed to read file ${filePath}.`, error);
        return [];
    }

    const worksheet = sheetName
        ? workbook.getWorksheet(sheetName)
        : workbook.worksheets[0];

    if (!worksheet) {
        logger.error(`ERROR: Sheet "${sheetName}" not found in file: ${filePath}`);
        return [];
    }

    const headerRow = worksheet.getRow(1);
    if (!headerRow) {
        logger.error(`ERROR: Header row is missing in sheet: ${worksheet.name}`);
        return [];
    }

    const rawHeaders = headerRow.values as (string | undefined)[];
    const headers: string[] = rawHeaders.slice(1)
        .map(headerValue => (headerValue ?? '').toString().trim().replace(/[\s\(\)]/g, '_').toLowerCase())
        .filter(headerValue => headerValue.length > 0);

    const dataRows: DataRow[] = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const dataRow: DataRow = {};
        let hasData = false;

        headers.forEach((header, index) => {
            const cellValue = row.getCell(index + 1).value;
            const value = getCellValue(cellValue);
            dataRow[header] = value;

            if (value !== null) hasData = true;
        });

        if (hasData) dataRows.push(dataRow);
    });

    return dataRows;
}