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
  alpha,
  Stack,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DescriptionIcon from '@mui/icons-material/Description';

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
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  // Paginação opcional
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  // Controla a exibição da paginação. Padrão: true (mantém comportamento atual)
  pagination?: boolean;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onOriginBusinessCase?: (row: T) => void;
  onTeam?: (row: T) => void;
  onPersonOsc?: (row: T) => void;
  onReport?: (row: T) => void;
  onProjectDocument?: (row: T) => void;
  noDataMessage?: string;
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
  pagination = true,
  onView,
  onEdit,
  onDelete,
  onOriginBusinessCase,
  onTeam,
  onPersonOsc,
  onReport,
  onProjectDocument,
  noDataMessage,
}: TableProps<T>) {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onPageChange?.(newPage);
  };

  // Usa o totalCount quando fornecido; caso contrário, utiliza o tamanho da lista atual
  const effectiveTotalCount = typeof totalCount === 'number' ? totalCount : data.length;

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
    onPageChange?.(0);
  };

  const hasActions =
    onView ||
    onEdit ||
    onDelete ||
    onOriginBusinessCase ||
    onTeam ||
    onPersonOsc ||
    onReport ||
    onProjectDocument;

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha('#1E4EC4', 0.1),
        }}
      >
        {/* Total de registros */}
        <Box
          px={3}
          py={2}
          sx={{
            bgcolor: alpha('#1E4EC4', 0.02),
            borderBottom: '1px solid',
            borderColor: alpha('#1E4EC4', 0.1),
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#1a1a2e',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Total de registros:{' '}
            <Box component="span" sx={{ color: '#1E4EC4' }}>
              {effectiveTotalCount}
            </Box>
          </Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <MuiTable size="medium">
            {/* Cabeçalho */}
            <TableHead>
              <TableRow sx={{ height: 56 }}>
                {columns.map((col) => (
                  <TableCell
                    key={col.field as string}
                    align={col.align || 'left'}
                    sx={{
                      bgcolor: '#1E4EC4',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      paddingY: 2,
                      paddingX: 2,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: '#1E4EC4',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      paddingY: 2,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
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
                    '&:nth-of-type(even)': {
                      backgroundColor: alpha('#1E4EC4', 0.02),
                    },
                    '&:hover': {
                      backgroundColor: alpha('#1E4EC4', 0.08),
                      transition: 'background-color 0.2s ease',
                    },
                    height: 52,
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.field as string}
                      align={col.align || 'left'}
                      sx={{
                        paddingY: 1.5,
                        paddingX: 2,
                        fontSize: '0.9rem',
                        color: '#374151',
                      }}
                    >
                      {col.render ? col.render(row[col.field], row) : row[col.field]}
                    </TableCell>
                  ))}

                  {hasActions && (
                    <TableCell align="center" sx={{ paddingY: 1.5, paddingX: 2 }}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {onView && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityIcon sx={{ fontSize: '1rem' }} />}
                            onClick={() => onView(row)}
                            sx={{
                              minWidth: 0,
                              color: '#1E4EC4',
                              borderColor: alpha('#1E4EC4', 0.3),
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              px: 2,
                              py: 0.75,
                              borderRadius: 1.5,
                              '&:hover': {
                                borderColor: '#1E4EC4',
                                bgcolor: alpha('#1E4EC4', 0.08),
                                borderWidth: 1.5,
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            Visualizar
                          </Button>
                        )}
                        {onEdit && row.isDeleted !== true && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
                            onClick={() => onEdit(row)}
                            sx={{
                              minWidth: 0,
                              color: '#F59E0B',
                              borderColor: alpha('#F59E0B', 0.3),
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              px: 2,
                              py: 0.75,
                              borderRadius: 1.5,
                              '&:hover': {
                                borderColor: '#F59E0B',
                                bgcolor: alpha('#F59E0B', 0.08),
                                borderWidth: 1.5,
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            Editar
                          </Button>
                        )}
                        {onDelete && row.isDeleted !== true && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                            onClick={() => onDelete(row)}
                            sx={{
                              minWidth: 0,
                              color: '#EF4444',
                              borderColor: alpha('#EF4444', 0.3),
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              px: 2,
                              py: 0.75,
                              borderRadius: 1.5,
                              '&:hover': {
                                borderColor: '#EF4444',
                                bgcolor: alpha('#EF4444', 0.08),
                                borderWidth: 1.5,
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            Remover
                          </Button>
                        )}
                        {onOriginBusinessCase && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<TravelExploreIcon sx={{ fontSize: '1rem' }} />}
                            onClick={() => onOriginBusinessCase?.(row)}
                            sx={{
                              minWidth: 0,
                              color: '#7244efff',
                              borderColor: alpha('#7244efff', 0.3),
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              px: 2,
                              py: 0.75,
                              borderRadius: 1.5,
                              '&:hover': {
                                borderColor: '#7244efff',
                                bgcolor: alpha('#7244efff', 0.08),
                                borderWidth: 1.5,
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            Causas
                          </Button>
                        )}
                        {onTeam && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PersonAddAltIcon sx={{ fontSize: '1rem', alignSelf: 'center' }} />}
                            onClick={() => onTeam?.(row)}
                            sx={{
                              minWidth: 0,
                              color: '#7244efff',
                              borderColor: alpha('#7244efff', 0.3),
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              px: 2,
                              py: 0.75,
                              borderRadius: 1.5,
                              '&:hover': {
                                borderColor: '#7244efff',
                                bgcolor: alpha('#7244efff', 0.08),
                                borderWidth: 1.5,
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            Integrantes
                          </Button>
                        )}
                        {onPersonOsc && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PersonAddAltIcon sx={{ fontSize: '1rem', alignSelf: 'center' }} />}
                            onClick={() => onPersonOsc?.(row)}
                            sx={{
                              minWidth: 0,
                              color: '#7244efff',
                              borderColor: alpha('#7244efff', 0.3),
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              px: 2,
                              py: 0.75,
                              borderRadius: 1.5,
                              '&:hover': {
                                borderColor: '#7244efff',
                                bgcolor: alpha('#7244efff', 0.08),
                                borderWidth: 1.5,
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            Integrantes
                          </Button>
                        )}
                        {onReport && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<TravelExploreIcon sx={{ fontSize: '1rem' }} />}
                            onClick={() => onReport(row)}
                            sx={{
                              minWidth: 0,
                              color: '#21AD53',
                              borderColor: alpha('#21AD53', 0.3),
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              px: 2,
                              py: 0.75,
                              borderRadius: 1.5,
                              '&:hover': {
                                borderColor: '#21AD53',
                                bgcolor: alpha('#21AD53', 0.08),
                                borderWidth: 1.5,
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            Executar
                          </Button>
                        )}
                        {onProjectDocument && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DescriptionIcon sx={{ fontSize: '1rem' }} />}
                            onClick={() => onProjectDocument(row)}
                            sx={{
                              minWidth: 0,
                              color: '#1E4EC4',
                              borderColor: alpha('#1E4EC4', 0.3),
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              px: 2,
                              py: 0.75,
                              borderRadius: 1.5,
                              '&:hover': {
                                borderColor: '#1E4EC4',
                                bgcolor: alpha('#1E4EC4', 0.08),
                                borderWidth: 1.5,
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            Documentos
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </MuiTable>
        </Box>

        {/* Mensagem de nenhum dado */}
        {noDataMessage ? (
          <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', py: 4 }}>
            {noDataMessage}
          </Typography>
        ) : (
          <></>
        )}

        {/* Paginação (opcional) */}
        {pagination && typeof page === 'number' && typeof rowsPerPage === 'number' ? (
          <Box
            display="flex"
            justifyContent="flex-end"
            sx={{
              bgcolor: alpha('#1E4EC4', 0.02),
              borderTop: '1px solid',
              borderColor: alpha('#1E4EC4', 0.1),
              px: 2,
            }}
          >
            <TablePagination
              component="div"
              count={effectiveTotalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
              labelRowsPerPage="Linhas por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`
              }
              sx={{
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  color: '#1a1a2e',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
                '.MuiSelect-select': {
                  color: '#1a1a2e',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                },
                '.MuiTablePagination-actions button': {
                  color: '#1E4EC4',
                  '&:hover': {
                    bgcolor: alpha('#1E4EC4', 0.08),
                  },
                },
              }}
            />
          </Box>
        ) : null}
      </TableContainer>
    </Box>
  );
}

export default Table;
