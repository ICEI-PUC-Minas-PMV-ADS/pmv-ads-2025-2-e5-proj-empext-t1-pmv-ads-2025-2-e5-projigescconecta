import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Exemplo de uso da Tabela com ações e paginação backend:
 *
 * 1️⃣ Defina suas colunas:
 * 
 *    const columns: Column<User>[] = [
 *      { label: 'ID', field: 'id' },
 *      { label: 'Nome', field: 'name' },
 *      { label: 'Email', field: 'email' },
 *      { label: 'Perfil', field: 'profile' },
 *    ];
 *
 * 2️⃣ Controle os dados e a paginação via backend:
 * 
 *    const [data, setData] = useState<User[]>([]);
 *    const [page, setPage] = useState(0);
 *    const [rowsPerPage, setRowsPerPage] = useState(10);
 *    const [totalCount, setTotalCount] = useState(0);
 *
 *   * Exemplo de chamada à API:
 * 
 *    useEffect(() => {
 *      fetch(`/api/users?page=${page + 1}&limit=${rowsPerPage}`)
 *        .then(res => res.json())
 *        .then(result => {
 *          setData(result.items);       // items da página atual
 *          setTotalCount(result.total); // total de registros no backend
 *        });
 *    }, [page, rowsPerPage]);
 *
 * 3️⃣ Defina funções de ação opcionais:
 * 
 *    const handleView = (user: User) => {...};
 *    const handleEdit = (user: User) => {...};
 *    const handleDelete = (user: User) => {...};
 *
 * 4️⃣ Renderize a tabela:
 * 
 *    <Table<User>
 *      columns={columns}
 *      data={data}
 *      page={page}
 *      rowsPerPage={rowsPerPage}
 *      totalCount={totalCount}
 *      onPageChange={setPage}
 *      onRowsPerPageChange={setRowsPerPage}
 *      onView={handleView}
 *      onEdit={handleEdit}
 *      onDelete={handleDelete}
 *    />
 *
 * 🔹 Observações:
 * - A coluna "Ações" aparece automaticamente se passar qualquer função de ação.
 * - Cada botão recebe a linha correspondente como parâmetro.
 * - A tabela suporta paginação backend: apenas os itens da página atual são carregados da API.
 */

export type Column<T> = {
  label: string;
  field: keyof T;
  align?: 'left' | 'right' | 'center';
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

function Table<T extends { [key: string]: any }>({
  columns,
  data,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
  onView,
  onEdit,
  onDelete,
}: TableProps<T>) {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const hasActions = onView || onEdit || onDelete;

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
      >
        {/* Total de registros acima */}
        <Box px={2} py={1}>
          <Typography variant="body2" color="#656d77">
            Total de registros: {totalCount}
          </Typography>
        </Box>

        <MuiTable size="medium">
          {/* Cabeçalho */}
          <TableHead sx={{ backgroundColor: '#1E4EC4' }}>
            <TableRow sx={{ height: 45 }}>
              {columns.map((col) => (
                <TableCell
                  key={col.field as string}
                  align={col.align || 'left'}
                  sx={{
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    paddingY: 1,
                    paddingX: 1.5,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell
                  align="center"
                  sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem', paddingY: 1 }}
                >
                  Ações
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          {/* Corpo */}
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{
                  '&:nth-of-type(even)': { backgroundColor: '#f6f6f7' },
                  '&:hover': { backgroundColor: '#e0e7ff' },
                  height: 40,
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.field as string}
                    align={col.align || 'left'}
                    sx={{ paddingY: 0.75, paddingX: 1.5, fontSize: '0.9rem' }}
                  >
                    {row[col.field]}
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell align="center" sx={{ paddingY: 0.75, paddingX: 1.5 }}>
                    <Box display="flex" gap={1} justifyContent="center">
                      {onView && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => onView(row)}
                          sx={{
                            minWidth: 0,
                            color: '#1E4EC4',
                            borderColor: '#1E4EC4',
                            textTransform: 'none',
                          }}
                        >
                          Visualizar
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => onEdit(row)}
                          sx={{
                            minWidth: 0,
                            color: '#F59E0B',
                            borderColor: '#F59E0B',
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: '#F59E0B',
                              background: '#FEF3C7',
                              color: '#D97706',
                            },
                          }}
                        >
                          Editar
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => onDelete(row)}
                          sx={{
                            minWidth: 0,
                            color: '#EF4444',
                            borderColor: '#EF4444',
                            textTransform: 'none',
                            '&:hover': { borderColor: '#EF4444', background: '#FEE2E2' },
                          }}
                        >
                          Remover
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>

        {/* Rodapé apenas com paginação */}
        <Box display="flex" justifyContent="flex-end" mt={0.5} px={2}>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage="Linhas por página"
            sx={{
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                color: '#264197',
                fontSize: '0.875rem',
              },
              '.MuiSelect-select': { color: '#264197', fontSize: '0.875rem' },
              '.MuiTablePagination-actions button': { color: '#1E4EC4' },
            }}
          />
        </Box>
      </TableContainer>
    </Box>
  );
}

export default Table;
