import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface GenerateXlsxOptions {
  headers: string[];
  filename?: string;
  sampleRows?: string[][];
}

const generateXlsx = (options: GenerateXlsxOptions): void => {
  const { headers, filename = 'template.xlsx', sampleRows = [] } = options;

  if (!headers || headers.length === 0) {
    console.error('Array de Headers é necessário e não pode estar vazio.');
    return;
  }

  const data: string[][] = [headers];
  if (sampleRows.length > 0) {
    data.push(...sampleRows);
  }

  try {
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    const columnWidths = headers.map((header) => {
      const maxLength = Math.max(
        header.length,
        ...data.slice(1).map((row) => String(row[headers.indexOf(header)] || '').length)
      );
      return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
    });
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    const workbookOutput = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      compression: true,
    });

    const blob = new Blob([workbookOutput], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, filename);
  } catch (error) {
    console.error('Erro ao gerar arquivo XLSX:', error);
    throw new Error('Erro ao gerar arquivo XLSX.');
  }
};

export default generateXlsx;
