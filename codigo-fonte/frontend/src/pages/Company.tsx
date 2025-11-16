import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Button,
  CircularProgress, Grid, Typography, Divider, TextField, Chip, Paper,
  alpha, FormControl, RadioGroup, FormControlLabel, Radio,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import Table, { Column } from '@/components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { toast } from 'react-toastify';
import { mask } from 'remask';
import {
  CompanyApi,
  type CreateCompanyCommand,
  type UpdateCompanyCommand,
  type Filter,
  Op,
  type CompanyViewModel,
} from '@/api';
import { apiConfig } from '@/services/auth';
import DialogPadronized from '@/components/DialogPadronized';
import { UploadCsvModal } from '@/components/UploadCsvModal';

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

interface CompanyCsvRow{
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
  site: string;
  redesSociais: string;
}

const formatCnpjMask = (cnpj: string) => mask(cnpj ?? '', ['99.999.999/9999-99']);
const formatCepMask = (cep: string) => mask(cep ?? '', ['99999-999']);
const formatPhoneMask = (phone: string) => mask(phone ?? '', ['(99) 9999-9999', '(99) 99999-9999']);

const columns: Column<any>[] = [
  { label: 'ID/CNPJ', field: 'cnpj' },
  { label: 'Nome', field: 'nome' },
  { label: 'Razão Social', field: 'razaoSocial' },
  { label: 'Telefone', field: 'telefone' },
  { label: 'Status', field: 'statusComponent' },
];

const CompanyPage: React.FC = () => {
  const companyApi = useMemo(() => new CompanyApi(apiConfig), []);

  const [companies, setCompanies] = useState<any[]>([]);
  const [editingData, setEditingData] = useState<Partial<CompanyFormData> | null>(null);
  
  const [filterNome, setFilterNome] = useState('');
  const [filterAreaAtuacao, setFilterAreaAtuacao] = useState('');
  const [filterCnpj, setFilterCnpj] = useState('');
  const [filterCidade, setFilterCidade] = useState('');
  const [filterUf, setFilterUf] = useState('');
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
  const [isUploadOpen, setUploadOpen] = useState(false);

  const isCreating = editingData ? !('id' in editingData) : false;
  const dialogTitle = isVisualizing ? 'Visualizar Empresa' : isCreating ? 'Nova Empresa' : 'Editar Empresa';
  const isReadOnlyMode = isVisualizing;

  const handleUploadCompany = () =>{
    setUploadOpen(true);
  }

  const apiCreate = (data: CompanyCsvRow) => companyApi.apiCompaniesPost({
    cnpj: data.cnpj,
    companyName: data.nome,
    corporateReason: data.razaoSocial,
    fieldOfActivity: data.areaAtuacao,
    zipCode: data.cep,
    address: data.endereco,
    neighborhood: data.bairro,
    city: data.cidade,
    state: data.uf,
    phoneNumber: data.telefone,
    website: data.site,
    socialMedia: data.redesSociais,
  })

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

  const fetchCompanies = async (filtersToUse: Filter[]) => {
    try {
      setLoading(true);
      const response = await companyApi.apiCompaniesSearchPost({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters: filtersToUse.length > 0 ? filtersToUse : undefined,
      });

      const formattedItems = (response.data.items ?? []).map(item => ({
        ...item,
        cnpj: formatCnpjMask(item.cnpj!),
        telefone: formatPhoneMask(item.telefone!),
        statusComponent: (
          <Chip
            label={item.ativa ? 'Ativa' : 'Inativa'}
            size="small"
            color={item.ativa ? 'success' : 'error'}
            variant="outlined"
          />
        )
      }));

      setCompanies(formattedItems);
      setTotalCount(response.data.totalItems ?? 0);
    } catch (err: any) {
      console.error("Erro detalhado da API:", err.response || err);
      toast.error('Erro ao buscar empresas.');
    } finally {
      setLoading(false);
    }
  };

  const buildFilters = (forceClear = false) => {
    const localFilters: Filter[] = [];
    
    if (forceClear) {
      localFilters.push({ propertyName: 'IsActive', operation: Op.NUMBER_0, value: true });
      return localFilters;
    }

    if (filterNome) {
      localFilters.push({ propertyName: 'CompanyName', operation: Op.NUMBER_7, value: filterNome });
    }
    if (filterAreaAtuacao) {
      localFilters.push({ propertyName: 'FieldOfActivity', operation: Op.NUMBER_7, value: filterAreaAtuacao });
    }
    if (filterCnpj) {
      localFilters.push({ propertyName: 'CNPJ', operation: Op.NUMBER_7, value: filterCnpj.replace(/\D/g, '') });
    }
    if (filterCidade) {
      localFilters.push({ propertyName: 'City', operation: Op.NUMBER_7, value: filterCidade });
    }
    if (filterUf) {
      localFilters.push({ propertyName: 'State', operation: Op.NUMBER_0, value: filterUf });
    }

    if (statusFilter === 'ativas') {
      localFilters.push({ propertyName: 'IsActive', operation: Op.NUMBER_0, value: true });
    } else if (statusFilter === 'inativas') {
      localFilters.push({ propertyName: 'IsActive', operation: Op.NUMBER_0, value: false });
    }

    return localFilters;
  }

  useEffect(() => {
    const filters = buildFilters();
    fetchCompanies(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, statusFilter]);

  const handleSearch = () => {
    setPage(0);
    const filters = buildFilters();
    fetchCompanies(filters);
  };

  const handleClearFilters = () => {
    setFilterNome('');
    setFilterAreaAtuacao('');
    setFilterCnpj('');
    setFilterCidade('');
    setFilterUf('');
    setStatusFilter('ativas');
    
    if (page !== 0) {
        setPage(0);
    }
    const filters = buildFilters(true);
    fetchCompanies(filters);
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
      const response = await companyApi.getCompanyByCnpj(company.cnpj.replace(/\D/g, '')) as any;
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
      const response = await companyApi.getCompanyByCnpj(company.cnpj.replace(/\D/g, '')) as any;
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
      await companyApi.apiCompaniesCnpjDelete(companyToAction.cnpj.replace(/\D/g, ''));
      toast.success(`Empresa ${companyToAction.nome} inativada com sucesso!`);
      handleSearch();
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
      await companyApi.apiCompaniesCnpjActivatePatch(companyToAction.cnpj.replace(/\D/g, ''));
      toast.success(`Empresa ${companyToAction.nome} reativada com sucesso!`);
      handleSearch();
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

    if (!data) return;

    if(validateCompanyForm(data) !== null){
      console.log(data)
      return
    }

    const cnpjDigits = data.cnpj!.replace(/\D/g, '');
    const payload = {
      cnpj: cnpjDigits,
      companyName: data.nome!,
      corporateReason: data.razaoSocial!,
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
        await companyApi.apiCompaniesPost(payload as CreateCompanyCommand);
        toast.success('Empresa criada com sucesso!');
      } else {
        await companyApi.apiCompaniesCnpjPut(cnpjDigits, payload as UpdateCompanyCommand);
        toast.success('Empresa atualizada com sucesso!');
      }
      handleCloseModal();
      handleSearch();
    } catch (err: any) {
      toast.error(err?.response?.data?.title || 'Erro ao salvar empresa.');
    } finally {
      setModalLoading(false);
    }
  };

  const validateCompanyForm = (company: any): string | null => {
    const requiredFields = ['cnpj', 'razaoSocial', 'nome']

    for(const field of requiredFields){
      if(!company || !company[field] || company[field].toString().trim() === ''){
        const message = (`O campo "${formatFieldName(field)}" é obrigatório!`);
        toast.error(message);
        return message;
      }
    }

    return null;
  }

  const formatFieldName = (field: string): string => {
    const mapping: Record<string, string> = {
      cnpj: 'CNPJ',
      nome: 'Nome Fantasia',
      razaoSocial: 'Razão Social'
    };
    return mapping[field] || field;
  }

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

  const handleFilterCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCnpjMask(e.target.value);
    setFilterCnpj(masked);
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
  
  const handleFilterUfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 2);
    setFilterUf(value);
  };

  const headerTranslations ={
    cnpj: 'CPNJ*',
    nome: 'Nome Fantasia*' ,
    razaoSocial: 'Razão Social*',
    areaAtuacao: 'Área de Atuação',
    cep: 'UF',
    endereco: 'Endereço',
    bairro: 'Bairro',
    cidade: 'Cidade',
    uf: 'Estado',
    telefone: 'Telefone',
    site: 'Website',
    redesSociais: 'Mídia Social',
  }

  return (
    <Container maxWidth="xl" sx={{ minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Paper elevation={0} sx={{ backgroundColor: '#ffffff', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: alpha('#1E4EC4', 0.1) }}>
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <TitleAndButtons title="Lista de Empresas" onAdd={handleAdd} addLabel="Nova Empresa" onImportCsv={handleUploadCompany} importLabel='Importar Empresa'/>
          
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
              <FilterListIcon sx={{ color: '#1E4EC4', fontSize: '1.25rem' }} />
              <Typography variant="h6" sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '1.1rem' }}>
                Filtro de Busca
              </Typography>
            </Box>
            
            <Grid container spacing={2.5} alignItems="center">
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <TextField
                  label="Nome da Empresa"
                  value={filterNome}
                  onChange={(e) => setFilterNome(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <TextField
                  label="Área de Atuação"
                  value={filterAreaAtuacao}
                  onChange={(e) => setFilterAreaAtuacao(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <TextField
                  label="CNPJ"
                  value={filterCnpj}
                  onChange={handleFilterCnpjChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <TextField
                  label="Cidade"
                  value={filterCidade}
                  onChange={(e) => setFilterCidade(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <TextField
                  label="UF"
                  value={filterUf}
                  onChange={handleFilterUfChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  inputProps={{ maxLength: 2 }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                <FormControl>
                  <RadioGroup
                    row
                    name="status-filter"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(0);
                    }}
                  >
                    <FormControlLabel value="ativas" control={<Radio size="small" />} label="Ativas" />
                    <FormControlLabel value="inativas" control={<Radio size="small" />} label="Inativas" />
                    <FormControlLabel value="todas" control={<Radio size="small" />} label="Todas" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1.5, mt: 1 }}>
                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ bgcolor: '#1E4EC4', color: 'white', fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none', fontSize: '0.95rem' }}>
                  Buscar
                </Button>
                <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters} sx={{ color: '#1E4EC4', borderColor: alpha('#1E4EC4', 0.3), fontWeight: 600, px: 3, py: 1, borderRadius: 1.5, textTransform: 'none', fontSize: '0.95rem', '&:hover': { borderColor: '#1E4EC4', bgcolor: alpha('#1E4EC4', 0.05), borderWidth: 1.5 } }}>
                  Limpar Filtros
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

          {isUploadOpen &&(
            <UploadCsvModal<CompanyCsvRow>
              title='Importar Empresa'
              onClose={() => setUploadOpen(false)}
              apiCreate={apiCreate}
              expectedHeaders={['cnpj', 'nome', 'razaoSocial', 'areaAtuacao', 'cep', 'endereco', 'bairro', 'cidade', 'uf', 'telefone', 'site', 'redesSociais']}
              headerTranslations={headerTranslations}
              validateFields={validateCompanyForm}
              onFinish={handleSearch}
            />
          )}

          <DialogPadronized
            open={openModal}
            onClose={handleCloseModal}
            maxWidth="md"
            title={dialogTitle}
            content={
              editingData && (
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="CNPJ *"
                        name="cnpj"
                        value={formatCnpjMask(editingData.cnpj || '')}
                        onChange={handleCnpjChange}
                        fullWidth
                        disabled={!isCreating}
                        size="small"
                        inputProps={{ readOnly: !isCreating }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Razão Social *"
                        name="razaoSocial"
                        value={editingData.razaoSocial || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Nome Fantasia *"
                        name="nome"
                        value={editingData.nome || ''}
                        onChange={handleValueChange}
                        fullWidth
                        disabled={isReadOnlyMode}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
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
                    <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /></Grid>
                    <Grid size={{ xs: 12, md: 9 }}>
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
                    <Grid size={{ xs: 12, md: 3 }}>
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
                    <Grid size={{ xs: 12, md: 4 }}>
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
                    <Grid size={{ xs: 12, md: 4 }}>
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
                    <Grid size={{ xs: 12, md: 4 }}>
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
                    <Grid size={{ xs: 12 }}><Divider sx={{ my: 1 }} /></Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
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
                    <Grid size={{ xs: 12, md: 6 }}>
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
                    <Grid size={{ xs: 12, md: 6 }}>
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
                    <Grid size={{ xs: 12, md: 6 }}>
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
              )
            }
            actions= {
              isReadOnlyMode ? (
                <Button onClick={handleCloseModal}>Voltar</Button>
              ) : (
                <>
                  <Button onClick={handleCloseModal} disabled={modalLoading}>Cancelar</Button>
                  <Button onClick={handleSave} variant="contained" disabled={modalLoading}>
                    {modalLoading ? <CircularProgress size={24} /> : (isCreating ? 'Criar' : 'Atualizar')}
                  </Button>
                </>
              )
            }
          /> 
        </Box>
      </Paper>
    </Container>
  );
};

export default CompanyPage;