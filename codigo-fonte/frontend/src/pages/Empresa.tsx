import React, { useState, useEffect } from 'react';
import {
  Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Grid, Typography, Stack, Divider, TextField, Chip, Paper,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { toast } from 'react-toastify';
import axios from 'axios';
import { mask } from 'remask';

// URL base dos seus Endpoints
const API_BASE_URL = 'http://localhost:5000/api/empresas';

// ==================== INTERFACES (PascalCase para Backend) ====================
interface Empresa {
  CNPJ: string;
  Nome: string;
  Endereco: string;
  Telefone: string;
  Email: string;
  Ativa: boolean;
}

// ==================== FUNÇÕES DE RENDERIZAÇÃO E COLUNAS ====================
const formatCnpjMask = (cnpj: string) => mask(cnpj, ['99.999.999/9999-99']);

const columns: Column<Empresa>[] = [
    { label: 'CNPJ', field: 'CNPJ', render: (data) => formatCnpjMask(data.CNPJ) },
    { label: 'Nome', field: 'Nome' },
    { label: 'Email', field: 'Email' },
    { label: 'Telefone', field: 'Telefone' },
    { 
        label: 'Status', 
        field: 'Ativa',
        render: (data) => (
            <Chip 
                label={data.Ativa ? 'Ativa' : 'Inativa'} 
                size="small" 
                color={data.Ativa ? 'success' : 'error'} 
                variant="outlined"
            />
        )
    },
];

// ==================== O COMPONENTE PRINCIPAL ====================
const EmpresaPage: React.FC = () => {
  // ==================== ESTADOS DE DADOS ====================
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [filterCnpj, setFilterCnpj] = useState('');
  
  // ==================== ESTADOS DE CONTROLE DE UI ====================
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [empresaToInactivate, setEmpresaToInactivate] = useState<Empresa | null>(null);

  const dialogTitle = isVisualizing ? 'Visualizar Empresa' : editingEmpresa?.CNPJ ? 'Editar Empresa' : 'Nova Empresa';
  const isEditing = !!editingEmpresa?.CNPJ && !isVisualizing; // Se tem CNPJ E não está visualizando = Editando

  // ==================== FUNÇÕES DE DADOS (CRUD) ====================

  const fetchEmpresas = async (cnpjFilter?: string) => {
    if (!cnpjFilter) {
      setEmpresas([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Chamando seu ListEmpresaQuery por CNPJ
      const { data } = await axios.get<Empresa>(`${API_BASE_URL}/${cnpjFilter}`);
      
      setEmpresas([data]); // Mostra apenas a que foi buscada
      setTotalCount(1);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.info('Nenhuma empresa encontrada com este CNPJ ou está inativa.');
          setEmpresas([]);
      } else {
          toast.error('Erro ao buscar empresas');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (filterCnpj.trim() === '') {
        toast.warn("Digite um CNPJ para buscar.");
        return;
    }
    setPage(0);
    fetchEmpresas(filterCnpj.replace(/\D/g, ''));
  };

  const handleClearFilters = () => {
    setPage(0);
    setFilterCnpj('');
    setEmpresas([]);
  };

  const handleAdd = () => {
    setEditingEmpresa({
        CNPJ: '',
        Nome: '',
        Endereco: '',
        Telefone: '',
        Email: '',
        Ativa: true,
    });
    setIsVisualizing(false);
    setOpenModal(true);
  };

  const handleEdit = async (empresa: Empresa) => {
    try {
      setModalLoading(true);
      const { data } = await axios.get<Empresa>(`${API_BASE_URL}/${empresa.CNPJ}`);
      setEditingEmpresa(data);
      setIsVisualizing(false);
      setOpenModal(true);
    } catch (error) {
      toast.error('Erro ao carregar edição da empresa');
    } finally {
      setModalLoading(false);
    }
  };

  const handleView = async (empresa: Empresa) => {
    try {
      const { data } = await axios.get<Empresa>(`${API_BASE_URL}/${empresa.CNPJ}`);
      setEditingEmpresa(data);
      setIsVisualizing(true);
      setOpenModal(true);
    } catch (error) {
      toast.error('Erro ao carregar detalhes da empresa');
    }
  };
  
  const handleDelete = (empresa: Empresa) => {
    setEmpresaToInactivate(empresa);
    setOpenDeleteModal(true);
  }
  
  const confirmInactivate = async () => {
      if (!empresaToInactivate) return;
  
      try {
          setModalLoading(true);
          // Chamando seu InativarEmpresaCommand (DELETE Lógico)
          await axios.delete(`${API_BASE_URL}/${empresaToInactivate.CNPJ}`);
          
          toast.success(`Empresa ${empresaToInactivate.Nome} inativada com sucesso!`);
          handleCloseModal();
          fetchEmpresas(filterCnpj.replace(/\D/g, '')); // Recarrega a lista
      } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            const errorDetails = error.response.data.errors?.join('; ') || 'Erro desconhecido.';
            toast.error(`Falha ao inativar: ${errorDetails}`);
          } else {
            toast.error('Erro de rede ou servidor não respondeu.');
          }
      } finally {
          setModalLoading(false);
          setOpenDeleteModal(false);
          setEmpresaToInactivate(null);
      }
  };
  

  const handleSave = async () => {
    const data = editingEmpresa;

    if (!data?.CNPJ || !data?.Nome) {
      toast.error('CNPJ e Nome são obrigatórios!');
      return;
    }
    
    const cnpjNumeros = data.CNPJ.replace(/\D/g, '');

    try {
      setModalLoading(true);
      const requestData = { ...data, CNPJ: cnpjNumeros };
      
      const isCreating = !isEditing;

      if (isCreating) { // Criar (POST)
        await axios.post(API_BASE_URL, requestData);
        toast.success('Empresa criada com sucesso!');
      } else { // Atualizar (PUT)
        await axios.put(`${API_BASE_URL}/${cnpjNumeros}`, requestData);
        toast.success('Empresa atualizada com sucesso!');
      }

      handleCloseModal();
      fetchEmpresas(filterCnpj.replace(/\D/g, ''));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorDetails = error.response.data.errors?.join('; ') || 'Erro desconhecido.';
        toast.error(`Falha ao salvar: ${errorDetails}`);
      } else {
        toast.error('Erro de rede ou servidor não respondeu.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingEmpresa(null);
    setIsVisualizing(false);
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingEmpresa({ ...editingEmpresa!, [name]: value });
  };
  
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Aplica a máscara para visualização e salva apenas números
      const maskedValue = mask(e.target.value, ['99.999.999/9999-99']);
      setEditingEmpresa({ ...editingEmpresa!, CNPJ: maskedValue.replace(/\D/g, '') });
  };


  // ==================== RENDERIZAÇÃO ====================
  return (
    <Container
      maxWidth="xl"
      sx={{ minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: alpha('#1E4EC4', 0.1),
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <TitleAndButtons title="Lista de Empresas" onAdd={handleAdd} addLabel="Nova Empresa" />

          {/* Filtro de Busca */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              mb: 3,
              backgroundColor: alpha('#1E4EC4', 0.02),
              border: '1px solid',
              borderColor: alpha('#1E4EC4', 0.1),
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <SearchIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
              <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>
                Busca de Empresa (CNPJ)
              </Typography>
              {filterCnpj && (
                <Chip label="Busca ativa" size="small" sx={{ ml: 1, bgcolor: alpha('#1E4EC4', 0.1), color: '#1E4EC4', fontWeight: 600 }} />
              )}
            </Box>

            <Grid container spacing={2.5}> 
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="CNPJ da Empresa"
                  value={mask(filterCnpj, ['99.999.999/9999-99'])}
                  onChange={(e) => setFilterCnpj(e.target.value.replace(/\D/g, ''))}
                  placeholder="Digite o CNPJ para buscar..."
                  fullWidth
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: 'white', '&.Mui-focused fieldset': { borderColor: '#1E4EC4', borderWidth: 2 } } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1.5 }}>
                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 4, py: 1, borderRadius: 1.5, textTransform: 'none', fontSize: '0.95rem' }}>
                  Buscar
                </Button>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters} sx={{ borderColor: alpha('#1E4EC4', 0.3), color: '#1E4EC4', fontWeight: 600, px: 4, py: 1, borderRadius: 1.5, textTransform: 'none', fontSize: '0.95rem' }}>
                  Limpar Filtros
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabela de Empresas */}
          <Box sx={{ flexGrow: 1, mt: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}><CircularProgress sx={{ color: '#1E4EC4' }} /></Box>
            ) : (
              <Table
                columns={columns}
                data={empresas}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                noDataMessage={filterCnpj ? "Nenhuma empresa encontrada com este CNPJ ou inativa." : "Use o filtro acima para buscar empresas."}
              />
            )}
          </Box>

          {/* Delete Modal (Inativar) */}
          <ConfirmDialog
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={confirmInactivate}
            title='Confirmar Inativação'
            message='Deseja realmente INATIVAR esta Empresa? Ela será removida das listagens ativas.'
            highlightText={empresaToInactivate?.Nome}
            confirmLabel='Inativar'
            cancelLabel='Cancelar'
            danger
          />

          {/* Modal de Criação/Edição/Visualização */}
          <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ bgcolor: alpha('#1E4EC4', 0.03), borderBottom: '1px solid', borderColor: alpha('#1E4EC4', 0.1), py: 2.5, px: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e' }}>{dialogTitle}</Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 3, mt: 1 }}>
              {editingEmpresa ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                    
                  <TextField label="CNPJ" 
                             value={formatCnpjMask(editingEmpresa.CNPJ)}
                             onChange={handleCnpjChange}
                             fullWidth 
                             // CNPJ é editável só na CRIAÇÃO
                             disabled={isVisualizing || isEditing} 
                             size="small"
                             inputProps={{ readOnly: isVisualizing || isEditing }} 
                  />
                  
                  <TextField label="Nome/Razão Social" 
                             name="Nome"
                             value={editingEmpresa.Nome || ''} 
                             onChange={handleValueChange} 
                             fullWidth 
                             disabled={isVisualizing || !editingEmpresa.Ativa} // Desabilitado se inativa
                             size="small"
                             inputProps={{ readOnly: isVisualizing || !editingEmpresa.Ativa }}
                  />
                  <TextField label="Email" 
                             name="Email"
                             value={editingEmpresa.Email || ''} 
                             onChange={handleValueChange} 
                             fullWidth 
                             disabled={isVisualizing || !editingEmpresa.Ativa}
                             size="small"
                             inputProps={{ readOnly: isVisualizing || !editingEmpresa.Ativa }}
                  />
                  <TextField label="Endereço" 
                             name="Endereco"
                             value={editingEmpresa.Endereco || ''} 
                             onChange={handleValueChange} 
                             fullWidth 
                             disabled={isVisualizing || !editingEmpresa.Ativa}
                             size="small"
                             inputProps={{ readOnly: isVisualizing || !editingEmpresa.Ativa }}
                  />
                  <TextField label="Telefone" 
                             name="Telefone"
                             value={editingEmpresa.Telefone || ''} 
                             onChange={handleValueChange} 
                             fullWidth 
                             disabled={isVisualizing || !editingEmpresa.Ativa}
                             size="small"
                             inputProps={{ readOnly: isVisualizing || !editingEmpresa.Ativa }}
                  />
                  
                  {isVisualizing && (
                    <Box mt={2}>
                        <Typography variant="subtitle1"><strong>Status:</strong></Typography>
                        <Chip label={editingEmpresa.Ativa ? 'Ativa' : 'Inativa'} color={editingEmpresa.Ativa ? 'success' : 'error'} />
                    </Box>
                  )}
                  
                </Box>
              ) : (
                <Typography>Nenhum dado para exibir.</Typography>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2.5, bgcolor: alpha('#1E4EC4', 0.02), borderTop: '1px solid', borderColor: alpha('#1E4EC4', 0.1), gap: 1.5 }}>
              {isVisualizing ? (
                <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleCloseModal} sx={{ bgcolor: '#6b7280', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5 }}>
                  Voltar
                </Button>
              ) : (
                <>
                  <Button onClick={handleCloseModal} disabled={modalLoading} sx={{ color: '#6b7280', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5 }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} variant="contained" disabled={modalLoading || (isEditing && !editingEmpresa.Ativa)} startIcon={modalLoading ? <CircularProgress size={20} color="inherit" /> : null} 
                          sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none' }}>
                    {isEditing ? 'Atualizar' : 'Criar'}
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmpresaPage;