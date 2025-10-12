import React, { useState, useEffect, useMemo } from 'react';
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
import { mask } from 'remask';
import { apiConfig } from '@/services/auth';
import axios from 'axios';

// --- CORREÇÃO: Importando as 4 APIs corretas de seus respectivos arquivos ---
import { CreateEmpresaEndpointApi } from '@/api/apis/create-empresa-endpoint-api';
import { ListEmpresaEndpointApi } from '@/api/apis/list-empresa-endpoint-api';
import { UpdateEmpresaEndpointApi } from '@/api/apis/update-empresa-endpoint-api';
import { InativarEmpresaEndpointApi } from '@/api/apis/inativar-empresa-endpoint-api';

// --- CORREÇÃO: Importando os tipos para as requisições, para garantir a tipagem correta ---
import { type CreateEmpresaCommand, type UpdateEmpresaCommand } from '@/api';

// Interface para o estado do componente React
interface Empresa {
  CNPJ: string;
  Nome: string;
  RazaoSocial: string;
  AreaAtuacao: string;
  CEP: string;
  Endereco: string;
  Bairro: string;
  Cidade: string;
  UF: string;
  Telefone: string;
  Email: string;
  Site: string;
  RedesSociais: string;
  Ativa: boolean;
}

// ==================== FUNÇÕES DE RENDERIZAÇÃO E COLUNAS ====================
const formatCnpjMask = (cnpj: string) => mask(cnpj, ['99.999.999/9999-99']);
const formatCepMask = (cep: string) => mask(cep, ['99999-999']);

const columns: Column<Empresa>[] = [
    { label: 'ID/CNPJ', field: 'CNPJ', render: (data) => formatCnpjMask(data.CNPJ) },
    { label: 'Nome', field: 'Nome' },
    { label: 'Razão Social', field: 'RazaoSocial' },
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
    // --- CORREÇÃO: Instanciando cada uma das 4 APIs com a configuração de autenticação ---
    const createApi = useMemo(() => new CreateEmpresaEndpointApi(apiConfig), []);
    const listApi = useMemo(() => new ListEmpresaEndpointApi(apiConfig), []);
    const updateApi = useMemo(() => new UpdateEmpresaEndpointApi(apiConfig), []);
    const inativarApi = useMemo(() => new InativarEmpresaEndpointApi(apiConfig), []);

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [createEmpresa, setCreateEmpresa] = useState<Empresa | null>(null);
  const [updateEmpresa, setUpdateEmpresa] = useState<Empresa | null>(null);
  const [filterCnpj, setFilterCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [empresaToInactivate, setEmpresaToInactivate] = useState<Empresa | null>(null);

  const dataToEdit = updateEmpresa || createEmpresa;
  const dialogTitle = isVisualizing ? 'Visualizar Empresa' : updateEmpresa ? 'Editar Empresa' : 'Nova Empresa';
  const isEditing = !!updateEmpresa && !isVisualizing;
  const isCreating = !!createEmpresa && !isVisualizing;
  const isReadOnlyMode = isVisualizing || (dataToEdit && !dataToEdit.Ativa);
  
  const fetchEmpresas = async (cnpjFilter?: string) => {
    if (!cnpjFilter) {
      setEmpresas([]);
      setTotalCount(0);
      return;
    }
    try {
      setLoading(true);
      // --- CORREÇÃO: Usando a 'listApi' e o método 'get' ---
      const { data } = await listApi.get(cnpjFilter);
      setEmpresas([data as Empresa]);
      setTotalCount(1);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.info('Nenhuma empresa encontrada com este CNPJ ou está inativa.');
          setEmpresas([]);
      } else {
          toast.error('Erro ao buscar empresas');
          console.error("Erro ao buscar empresa:", error);
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
    setCreateEmpresa({
        CNPJ: '', Nome: '', RazaoSocial: '', AreaAtuacao: '', CEP: '', Endereco: '', Bairro: '',
        Cidade: '', UF: '', Telefone: '', Email: '', Site: '', RedesSociais: '', Ativa: true,
    });
    setUpdateEmpresa(null);
    setIsVisualizing(false);
    setOpenModal(true);
  };

  const handleEdit = async (empresa: Empresa) => {
    try {
      setModalLoading(true);
      // --- CORREÇÃO: Usando a 'listApi' e o método 'get' ---
      const { data } = await listApi.get(empresa.CNPJ);
      setUpdateEmpresa(data as Empresa);
      setCreateEmpresa(null);
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
      setModalLoading(true);
      // --- CORREÇÃO: Usando a 'listApi' e o método 'get' ---
      const { data } = await listApi.get(empresa.CNPJ);
      setUpdateEmpresa(data as Empresa);
      setCreateEmpresa(null);
      setIsVisualizing(true);
      setOpenModal(true);
    } catch (error) {
      toast.error('Erro ao carregar detalhes da empresa');
    } finally {
        setModalLoading(false);
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
          // --- CORREÇÃO: Usando a 'inativarApi' e o método 'delete' ---
          await inativarApi._delete(empresaToInactivate.CNPJ); // O nome correto provavelmente é '_delete' para não conflitar com a palavra 'delete' do JS
          
          toast.success(`Empresa ${empresaToInactivate.Nome} inativada com sucesso!`);
          handleClearFilters();
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
    const data = dataToEdit;

    if (!data?.CNPJ || !data?.Nome || !data?.RazaoSocial) {
      toast.error('CNPJ, Nome e Razão Social são obrigatórios!');
      return;
    }
    
    const cnpjNumeros = data.CNPJ.replace(/\D/g, '');
    
    try {
      setModalLoading(true);
      
      if (isCreating) {
        // --- CORREÇÃO: Usando a 'createApi' e o método 'post' ---
        const requestData: CreateEmpresaCommand = { ...data, CNPJ: cnpjNumeros };
        await createApi.post(requestData);
        toast.success('Empresa criada com sucesso!');
        handleCloseModal();
        setFilterCnpj(cnpjNumeros); 
        fetchEmpresas(cnpjNumeros); 
      } else {
        // --- CORREÇÃO: Usando a 'updateApi' e o método 'put' ---
        const requestData: UpdateEmpresaCommand = { ...data, CNPJ: cnpjNumeros };
        await updateApi.put(cnpjNumeros, requestData);
        toast.success('Empresa atualizada com sucesso!');
        handleCloseModal();
        fetchEmpresas(cnpjNumeros);
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorDetails = error.response.data?.errors?.join('; ') || error.response.data?.title || 'Erro desconhecido.';
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
    setUpdateEmpresa(null);
    setCreateEmpresa(null);
    setIsVisualizing(false);
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditing) {
        setUpdateEmpresa(prev => ({ ...prev!, [name]: value }));
    } else if (isCreating) {
        setCreateEmpresa(prev => ({ ...prev!, [name]: value }));
    }
  };
  
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = mask(e.target.value, ['99.999.999/9999-99']);
      const cnpjNumeros = maskedValue.replace(/\D/g, '');
      if (isCreating) {
          setCreateEmpresa(prev => ({ ...prev!, CNPJ: cnpjNumeros }));
      }
  };
  
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = mask(e.target.value, ['99999-999']);
      const cepNumeros = maskedValue.replace(/\D/g, '');
      if (isEditing) {
          setUpdateEmpresa(prev => ({ ...prev!, CEP: cepNumeros }));
      } else if (isCreating) {
          setCreateEmpresa(prev => ({ ...prev!, CEP: cepNumeros }));
      }
  };

  const handleUfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toUpperCase().slice(0, 2);
      if (isEditing) {
          setUpdateEmpresa(prev => ({ ...prev!, UF: value }));
      } else if (isCreating) {
          setCreateEmpresa(prev => ({ ...prev!, UF: value }));
      }
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
              {dataToEdit ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                    
                    <Grid container spacing={2}>
                        {/* LINHA 1: CNPJ / RAZÃO SOCIAL */}
                        <Grid item xs={12} md={6}>
                            <TextField label="CNPJ" 
                                      name="CNPJ"
                                      value={formatCnpjMask(dataToEdit.CNPJ)}
                                      onChange={handleCnpjChange}
                                      fullWidth 
                                      disabled={!isCreating}
                                      size="small"
                                      inputProps={{ readOnly: !isCreating, maxLength: 18 }} 
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Razão Social (Nome Legal)" 
                                      name="RazaoSocial"
                                      value={dataToEdit.RazaoSocial || ''} 
                                      onChange={handleValueChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode }}
                            />
                        </Grid>
                        
                        {/* LINHA 2: NOME CURTO / ÁREA DE ATUAÇÃO */}
                        <Grid item xs={12} md={6}>
                            <TextField label="Nome (Nome Fantasia)" 
                                      name="Nome"
                                      value={dataToEdit.Nome || ''} 
                                      onChange={handleValueChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Área de Atuação" 
                                      name="AreaAtuacao"
                                      value={dataToEdit.AreaAtuacao || ''} 
                                      onChange={handleValueChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode }}
                            />
                        </Grid>

                        <Divider sx={{ my: 2, width: '100%', mx: 2 }} />

                        {/* LINHA 3: ENDEREÇO / CEP */}
                        <Grid item xs={12} md={9}>
                            <TextField label="Endereço" 
                                      name="Endereco"
                                      value={dataToEdit.Endereco || ''} 
                                      onChange={handleValueChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="CEP" 
                                      name="CEP"
                                      value={formatCepMask(dataToEdit.CEP)} 
                                      onChange={handleCepChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode, maxLength: 9 }}
                            />
                        </Grid>
                        
                        {/* LINHA 4: BAIRRO / CIDADE / UF */}
                        <Grid item xs={12} md={4}>
                            <TextField label="Bairro" 
                                      name="Bairro"
                                      value={dataToEdit.Bairro || ''} 
                                      onChange={handleValueChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField label="Cidade" 
                                      name="Cidade"
                                      value={dataToEdit.Cidade || ''} 
                                      onChange={handleValueChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField label="UF" 
                                      name="UF"
                                      value={dataToEdit.UF || ''} 
                                      onChange={handleUfChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode, maxLength: 2 }}
                            />
                        </Grid>

                        <Divider sx={{ my: 2, width: '100%', mx: 2 }} />

                        {/* LINHA 5: CONTATO E REDES */}
                        <Grid item xs={12} md={4}>
                            <TextField label="Telefone" 
                                      name="Telefone"
                                      value={dataToEdit.Telefone || ''} 
                                      onChange={handleValueChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField label="Site" 
                                      name="Site"
                                      value={dataToEdit.Site || ''} 
                                      onChange={handleValueChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField label="Redes Sociais" 
                                      name="RedesSociais"
                                      value={dataToEdit.RedesSociais || ''} 
                                      onChange={handleValueChange} 
                                      fullWidth 
                                      disabled={isReadOnlyMode}
                                      size="small"
                                      inputProps={{ readOnly: isReadOnlyMode }}
                            />
                        </Grid>

                        {/* Status de Visualização */}
                        {isReadOnlyMode && (
                          <Box mt={2} px={1}>
                              <Typography variant="subtitle1"><strong>Status:</strong></Typography>
                              <Chip label={dataToEdit.Ativa ? 'Ativa' : 'Inativa'} color={dataToEdit.Ativa ? 'success' : 'error'} />
                          </Box>
                        )}
                    </Grid>
                </Box>
              ) : (
                <Typography>Nenhum dado para exibir.</Typography>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2.5, bgcolor: alpha('#1E4EC4', 0.02), borderTop: '1px solid', borderColor: alpha('#1E4EC4', 0.1), gap: 1.5 }}>
              {isReadOnlyMode ? (
                <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleCloseModal} sx={{ bgcolor: '#6b7280', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5 }}>
                  Voltar
                </Button>
              ) : (
                <>
                  <Button onClick={handleCloseModal} disabled={modalLoading} sx={{ color: '#6b7280', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5 }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} variant="contained" disabled={modalLoading || (isEditing && !dataToEdit.Ativa)} startIcon={modalLoading ? <CircularProgress size={20} color="inherit" /> : null} 
                          sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none' }}>
                    {isCreating ? 'Criar' : 'Atualizar'}
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