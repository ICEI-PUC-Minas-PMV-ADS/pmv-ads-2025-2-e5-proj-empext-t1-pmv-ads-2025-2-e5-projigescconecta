import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Grid, Typography, Divider, TextField, Chip, Paper,
  alpha, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Table, { Column } from '@/components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { toast } from 'react-toastify';
import { mask } from 'remask';
import {
  CreateCompanyEndpointApi,
  ListCompaniesEndpointApi,
  ListCompanyEndpointApi,
  UpdateCompanyEndpointApi,
  InactivateCompanyEndpointApi,
  ReactivateCompanyEndpointApi,
  type CreateCompanyCommand,
  type UpdateCompanyCommand,
  type Filter,
  type CompanyViewModel,
} from '@/api';
import { apiConfig } from '@/services/auth';

interface CompanyFullDetails {
  id?: number;
  cnpj?: string;
  nome?: string;
  razaoSocial?: string;
  areaAtuacao?: string;
  cep?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  telefone?: string;
  email?: string;
  site?: string;
  redesSociais?: string;
  ativa?: boolean;
}

interface CompanyFormData {
  id?: number;
  cnpj: string;
  nome: string;
  razaoSocial: string;
  areaAtuacao: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  telefone: string;
  email: string;
  site: string;
  redesSociais: string;
  ativa: boolean;
}

const formatCnpjMask = (cnpj: string) => mask(cnpj ?? '', ['99.999.999/9999-99']);
const formatCepMask = (cep: string) => mask(cep ?? '', ['99999-999']);
const formatPhoneMask = (phone: string) => mask(phone ?? '', ['(99) 9999-9999', '(99) 99999-9999']);

const columns: Column<CompanyViewModel>[] = [
  { label: 'ID/CNPJ', field: 'cnpj', render: (row) => formatCnpjMask(row.cnpj!) },
  { label: 'Nome', field: 'nome' },
  { label: 'Razão Social', field: 'razaoSocial' },
  { label: 'Telefone', field: 'telefone', render: (row) => formatPhoneMask(row.telefone!) },
  {
    label: 'Status',
    field: 'ativa',
    render: (row) => (
      <Chip
        label={row.ativa ? 'Ativa' : 'Inativa'}
        size="small"
        color={row.ativa ? 'success' : 'error'}
        variant="outlined"
      />
    ),
  },
];

const CompanyPage: React.FC = () => {
  const createApi = useMemo(() => new CreateCompanyEndpointApi(apiConfig), []);
  const listApi = useMemo(() => new ListCompanyEndpointApi(apiConfig), []);
  const listAllApi = useMemo(() => new ListCompaniesEndpointApi(apiConfig), []);
  const updateApi = useMemo(() => new UpdateCompanyEndpointApi(apiConfig), []);
  const inactivateApi = useMemo(() => new InactivateCompanyEndpointApi(apiConfig), []);
  const reactivateApi = useMemo(() => new ReactivateCompanyEndpointApi(apiConfig), []);

  const [companies, setCompanies] = useState<CompanyViewModel[]>([]);
  const [editingData, setEditingData] = useState<Partial<CompanyFormData> | null>(null);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ativas');
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openReactivateModal, setOpenReactivateModal] = useState(false);
  const [companyToAction, setCompanyToAction] = useState<CompanyViewModel | null>(null);

  const isCreating = editingData ? !('id' in editingData) : false;
  const dialogTitle = isVisualizing ? 'Visualizar Empresa' : isCreating ? 'Nova Empresa' : 'Editar Empresa';
  const isReadOnlyMode = isVisualizing;

  const mapApiDataToFormData = (data: CompanyFullDetails): CompanyFormData => ({
    id: data.id,
    cnpj: data.cnpj || '',
    nome: data.nome || '',
    razaoSocial: data.razaoSocial || '',
    areaAtuacao: data.areaAtuacao || '',
    cep: data.cep || '',
    endereco: data.endereco || '',
    bairro: data.bairro || '',
    cidade: data.cidade || '',
    uf: data.uf || '',
    telefone: data.telefone || '',
    email: data.email || '',
    site: data.site || '',
    redesSociais: data.redesSociais || '',
    ativa: data.ativa ?? false,
  });

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const localFilters: Filter[] = [];
      if (filterText) {
        localFilters.push({ propertyName: 'CompanyName', operation: 7, value: filterText });
      }
      if (statusFilter === 'ativas') {
        localFilters.push({ propertyName: 'IsActive', operation: 0, value: true });
      } else if (statusFilter === 'inativas') {
        localFilters.push({ propertyName: 'IsActive', operation: 0, value: false });
      }
      const response = await listAllApi.apiCompaniesSearchPost({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters: localFilters.length > 0 ? localFilters : null,
      });
      setCompanies(response.data.items ?? []);
      setTotalCount(response.data.totalItems ?? 0);
    } catch (err: any) {
      console.error("Erro detalhado da API:", err.response || err);
      toast.error('Erro ao buscar empresas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, statusFilter]);

  const handleSearch = () => {
    setPage(0);
    fetchCompanies();
  };

  const handleClearFilters = () => {
    setFilterText('');
    setStatusFilter('ativas');
    if (page !== 0) {
        setPage(0);
    } else if (filterText || statusFilter !== 'ativas') {
        fetchCompanies();
    }
  };

  const handleAdd = () => {
    setEditingData({
      cnpj: '', nome: '', razaoSocial: '', areaAtuacao: '', cep: '', endereco: '', bairro: '',
      cidade: '', uf: '', telefone: '', email: '', site: '', redesSociais: '', ativa: true,
    });
    setIsVisualizing(false);
    setOpenModal(true);
  };

  const handleEdit = async (company: CompanyViewModel) => {
    if (!company.cnpj) return;
    try {
      setModalLoading(true);
      const response = await listApi.getCompanyByCnpj(company.cnpj);
      const companyData = response.data as CompanyFullDetails;
      setEditingData(mapApiDataToFormData(companyData));
      setIsVisualizing(false);
      setOpenModal(true);
    } catch {
      toast.error('Erro ao carregar dados para edição.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleView = async (company: CompanyViewModel) => {
    if (!company.cnpj) return;
    try {
      setModalLoading(true);
      const response = await listApi.getCompanyByCnpj(company.cnpj);
      const companyData = response.data as CompanyFullDetails;
      setEditingData(mapApiDataToFormData(companyData));
      setIsVisualizing(true);
      setOpenModal(true);
    } catch {
      toast.error('Erro ao carregar detalhes da empresa.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleActive = (company: CompanyViewModel) => {
    setCompanyToAction(company);
    if (company.ativa) {
      setOpenDeleteModal(true);
    } else {
      setOpenReactivateModal(true);
    }
  };

  const confirmInactivate = async () => {
    if (!companyToAction?.cnpj) return;
    try {
      setModalLoading(true);
      await inactivateApi.apiCompaniesCnpjDelete(companyToAction.cnpj);
      toast.success(`Empresa ${companyToAction.nome} inativada com sucesso!`);
      fetchCompanies();
    } catch (err: any) {
      toast.error(err?.response?.data?.title || 'Erro ao inativar empresa.');
    } finally {
      setModalLoading(false);
      setOpenDeleteModal(false);
      setCompanyToAction(null);
    }
  };

  const confirmReactivate = async () => {
    if (!companyToAction?.cnpj) return;
    try {
      setModalLoading(true);
      await reactivateApi.apiCompaniesCnpjActivatePatch(companyToAction.cnpj);
      toast.success(`Empresa ${companyToAction.nome} reativada com sucesso!`);
      fetchCompanies();
    } catch (err: any) {
      toast.error(err?.response?.data?.title || 'Erro ao reativar empresa.');
    } finally {
      setModalLoading(false);
      setOpenReactivateModal(false);
      setCompanyToAction(null);
    }
  };

  const handleSave = async () => {
    const data = editingData;
    if (!data?.cnpj || !data?.nome || !data?.razaoSocial) {
      toast.error('CNPJ, Nome Fantasia e Razão Social são obrigatórios!');
      return;
    }

    const cnpjDigits = data.cnpj.replace(/\D/g, '');
    const payload = {
      cnpj: cnpjDigits,
      companyName: data.nome,
      corporateReason: data.razaoSocial,
      fieldOfActivity: data.areaAtuacao,
      zipCode: (data.cep || '').replace(/\D/g, ''),
      address: data.endereco,
      neighborhood: data.bairro,
      city: data.cidade,
      state: data.uf,
      phoneNumber: (data.telefone || '').replace(/\D/g, ''),
      website: data.site,
      socialMedia: data.redesSociais,
      isActive: data.ativa,
      email: data.email,
    };

    try {
      setModalLoading(true);
      if (isCreating) {
        await createApi.apiCompaniesPost(payload as CreateCompanyCommand);
        toast.success('Empresa criada com sucesso!');
      } else {
        await updateApi.apiCompaniesCnpjPut(cnpjDigits, payload as UpdateCompanyCommand);
        toast.success('Empresa atualizada com sucesso!');
      }
      handleCloseModal();
      fetchCompanies();
    } catch (err: any) {
      toast.error(err?.response?.data?.title || 'Erro ao salvar empresa.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingData(null);
    setIsVisualizing(false);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingData((p) => (p ? { ...p, [name]: value } : null));
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCreating) {
      const masked = formatCnpjMask(e.target.value);
      setEditingData((p) => (p ? { ...p, cnpj: masked } : null));
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCepMask(e.target.value);
    setEditingData((p) => (p ? { ...p, cep: masked } : null));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatPhoneMask(e.target.value);
    setEditingData((p) => (p ? { ...p, telefone: masked } : null));
  };

  const handleUfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 2);
    setEditingData((p) => (p ? { ...p, uf: value } : null));
  };

  return (
    <Container maxWidth="xl" sx={{ minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Paper elevation={0} sx={{ backgroundColor: '#ffffff', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: alpha('#1E4EC4', 0.1) }}>
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <TitleAndButtons title="Lista de Empresas" onAdd={handleAdd} addLabel="Nova Empresa" />
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, mb: 3, backgroundColor: alpha('#1E4EC4', 0.02), border: '1px solid', borderColor: alpha('#1E4EC4', 0.1), borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <SearchIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
              <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>
                Busca de Empresa
              </Typography>
            </Box>
            <Grid container spacing={2.5} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  label="Nome da Empresa"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Digite o nome para buscar..."
                  fullWidth
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <FormControl>
                  <RadioGroup
                    row
                    name="status-filter"
                    value={statusFilter}
                    onChange={(e) => {
                      setPage(0);
                      setStatusFilter(e.target.value);
                    }}
                  >
                    <FormControlLabel value="ativas" control={<Radio size="small" />} label="Ativas" />
                    <FormControlLabel value="inativas" control={<Radio size="small" />} label="Inativas" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 4, py: 1, borderRadius: 1.5 }}>
                  Buscar
                </Button>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters} sx={{ color: '#1E4EC4', fontWeight: 600, px: 4, py: 1, borderRadius: 1.5 }}>
                  Limpar
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ flexGrow: 1, mt: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}><CircularProgress sx={{ color: '#1E4EC4' }} /></Box>
            ) : (
              <Table
                columns={columns}
                data={companies}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleToggleActive}
                noDataMessage={companies.length > 0 ? '' : 'Nenhuma empresa encontrada.'}
              />
            )}
          </Box>

          <ConfirmDialog
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={confirmInactivate}
            title="Confirmar Inativação"
            message="Deseja realmente INATIVAR esta Empresa?"
            highlightText={companyToAction?.nome}
            confirmLabel="Inativar"
            cancelLabel="Cancelar"
            danger
          />

          <ConfirmDialog
            open={openReactivateModal}
            onClose={() => setOpenReactivateModal(false)}
            onConfirm={confirmReactivate}
            title="Confirmar Reativação"
            message="Deseja realmente REATIVAR esta Empresa?"
            highlightText={companyToAction?.nome}
            confirmLabel="Reativar"
            cancelLabel="Cancelar"
          />

          <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ bgcolor: alpha('#1E4EC4', 0.03), borderBottom: '1px solid', borderColor: alpha('#1E4EC4', 0.1), py: 2.5, px: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                {dialogTitle}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 3, mt: 1 }}>
              {editingData && (
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="CNPJ"
                        name="cnpj"
                        value={formatCnpjMask(editingData.cnpj || '')}
                        onChange={handleCnpjChange}
                        fullWidth
                        disabled={!isCreating}
                        size="small"
                        inputProps={{ readOnly: !isCreating }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Razão Social"
                        name="razaoSocial"
                        value={editingData.razaoSocial || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Nome Fantasia"
                        name="nome"
                        value={editingData.nome || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Área de Atuação"
                        name="areaAtuacao"
                        value={editingData.areaAtuacao || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                    <Grid item xs={12} md={9}>
                      <TextField
                        label="Endereço"
                        name="endereco"
                        value={editingData.endereco || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="CEP"
                        name="cep"
                        value={editingData.cep || ''}
                        onChange={handleCepChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                        inputProps={{ maxLength: 9 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Bairro"
                        name="bairro"
                        value={editingData.bairro || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Cidade"
                        name="cidade"
                        value={editingData.cidade || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="UF"
                        name="uf"
                        value={editingData.uf || ''}
                        onChange={handleUfChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                        inputProps={{ maxLength: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Telefone"
                        name="telefone"
                        value={editingData.telefone || ''}
                        onChange={handlePhoneChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                        inputProps={{ maxLength: 15 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Email"
                        name="email"
                        value={editingData.email || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Site"
                        name="site"
                        value={editingData.site || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Redes Sociais"
                        name="redesSociais"
                        value={editingData.redesSociais || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2.5, bgcolor: alpha('#1E4EC4', 0.02), borderTop: '1px solid', borderColor: alpha('#1E4EC4', 0.1) }}>
              {isReadOnlyMode ? (
                <Button onClick={handleCloseModal}>Voltar</Button>
              ) : (
                <>
                  <Button onClick={handleCloseModal} disabled={modalLoading}>Cancelar</Button>
                  <Button onClick={handleSave} variant="contained" disabled={modalLoading}>
                    {modalLoading ? <CircularProgress size={24} /> : (isCreating ? 'Criar' : 'Atualizar')}
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

export default CompanyPage;