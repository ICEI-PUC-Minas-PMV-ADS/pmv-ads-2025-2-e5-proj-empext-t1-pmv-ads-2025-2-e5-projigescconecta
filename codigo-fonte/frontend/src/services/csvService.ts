import Papa from 'papaparse';

export class CsvService{
    static async parseCsvFile<T>(file: File): Promise<T[]>{
        return new Promise((resolve, reject) =>{
            Papa.parse<T>(file, {
                header: 'true',
                skipEmptyLines: 'true',
                dynamicTyping: 'true',
                complete: (results) => resolve(results.data),
                error: (error) => reject(error),
            });
        });
    }
}