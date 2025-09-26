import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { toast } from 'react-toastify';

// Interface para os dados do programa
interface Program {
  id: number;
  name: string;
}

// Interface para resposta paginada da API
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

const Course: React.FC = () => {
  // Estados principais
  const [search, setSearch] = useState('');
  const [programs, setPrograms] = useState<Program[]>([]);

  // Estados da tabela
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Estados do modal
  const [openModal, setOpenModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programName, setProgramName] = useState('');

  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Carregar dados da API
  useEffect(() => {
    fetchPrograms();
  }, [page, rowsPerPage]);

  // Função para buscar programas da API
  const fetchPrograms = async () => {
    try {
      setLoading(true);

      // TODO: Substituir por chamada real da API
      // const response = await fetch(`/api/programs?page=${page + 1}&limit=${rowsPerPage}&search=${search}`);
      // const data: PaginatedResponse<Program> = await response.json();

      // Simulação de delay da API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dados temporários vazios - serão substituídos pela API
      const data = {
        items: [],
        total: 0,
        page: page + 1,
        limit: rowsPerPage,
      };

      setPrograms(data.items);
      setTotalCount(data.total);
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
      toast.error('Erro ao carregar programas');
    } finally {
      setLoading(false);
    }
  };

  // Definição das colunas da tabela
  const columns: Column<Program>[] = [
    { label: 'ID', field: 'id' },
    { label: 'Nome do Programa', field: 'name' },
  ];

  // Função de pesquisa
  const handleSearch = () => {
    setPage(0); // Reset para primeira página
    fetchPrograms(); // Refaz a busca com o novo termo
  };

  // Função para abrir modal de criação
  const handleAdd = () => {
    setEditingProgram(null);
    setProgramName('');
    setOpenModal(true);
  };

  // Função para abrir modal de edição
  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setProgramName(program.name);
    setOpenModal(true);
  };

  // Função para visualizar
  const handleView = (program: Program) => {
    toast.info(`Visualizando: ${program.name}`);
  };

  // Função para deletar
  const handleDelete = async (program: Program) => {
    try {
      // TODO: Substituir por chamada real da API
      // await fetch(`/api/programs/${program.id}`, { method: 'DELETE' });

      // Simulação de delay da API
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast.success(`Programa "${program.name}" excluído com sucesso!`);

      // Recarregar dados após exclusão
      fetchPrograms();
    } catch (error) {
      console.error('Erro ao excluir programa:', error);
      toast.error('Erro ao excluir programa');
    }
  };

  // Função para salvar (criar ou editar)
  const handleSave = async () => {
    if (!programName.trim()) {
      toast.error('O nome do programa é obrigatório!');
      return;
    }

    try {
      setModalLoading(true);

      if (editingProgram) {
        // TODO: Substituir por chamada real da API
        /* Editar! */
        toast.success('Programa atualizado com sucesso!');
      } else {
        // TODO: Substituir por chamada real da API
        /* Criar! */
        toast.success('Programa criado com sucesso!');
      }

      handleCloseModal();
      fetchPrograms();
    } catch (error) {
      console.error('Erro ao salvar programa:', error);
      toast.error('Erro ao salvar programa');
    } finally {
      setModalLoading(false);
    }
  };

  // Função para fechar modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProgram(null);
    setProgramName('');
  };

  // Dados paginados para exibição na tabela (já vem paginado da API)
  const paginatedData = programs;

  return (
    <Container
      maxWidth="xl"
      sx={{
        backgroundColor: '#e2e2e2',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <TitleAndButtons title="Listar Programas" onAdd={handleAdd} addLabel="Novo Programa" />

      {/* Campo de pesquisa + botão */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: 2,
          mb: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          label="Buscar por nome"
          variant="outlined"
          value={search}
          size="small"
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          sx={{ m: 1, width: '25ch' }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Pesquisar
        </Button>
      </Box>

      {/* Tabela */}
      <Box sx={{ flexGrow: 1 }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table<Program>
            columns={columns}
            data={paginatedData}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={totalCount}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Box>

      {/* Modal de Criação/Edição */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProgram ? 'Editar Programa' : 'Novo Programa'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Programa"
            type="text"
            fullWidth
            variant="outlined"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" disabled={modalLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={modalLoading}
            startIcon={modalLoading ? <CircularProgress size={20} /> : null}
          >
            {modalLoading ? 'Salvando...' : editingProgram ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Course;
