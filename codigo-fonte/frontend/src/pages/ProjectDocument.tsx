import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table, { Column } from '../components/Table';
import TitleAndButtons from '@/components/TitleAndButtons';
import DialogPadronized from '@/components/DialogPadronized';
import { ConfirmDialog } from '@/components/ConfirmDelete';
import { apiConfig } from '../services/auth';
import { ProjectDocumentsApi, ProjectDocumentListItem } from '../api';

type Row = ProjectDocumentListItem & {
  createdAtFormatted?: string;
  hasFile?: boolean;
};

const FIELD_STYLE = { minWidth: 240, flex: '1 1 240px' };

const ProjectDocument: React.FC = () => {
  const { projectProgramId } = useParams<{ projectProgramId: string }>();
  const location = useLocation();
  const { name: projectName } = (location.state as { name?: string }) || {};
  const api = new ProjectDocumentsApi(apiConfig);
  const navigate = useNavigate();

  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileLabel, setFileLabel] = useState('');

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    loading: boolean;
    row: Row | null;
  }>({ open: false, loading: false, row: null });

  const columns: Column<Row>[] = [
    { label: 'ID', field: 'projectDocumentId', align: 'left', width: '60px' },
    { label: 'Nome', field: 'name', align: 'left', width: '200px' },
    { label: 'Descrição', field: 'description', align: 'left', width: '250px' },
    {
      label: 'Arquivo',
      field: 'fileName',
      align: 'left',
      width: '250px',
      render: (value, row) =>
        row.hasFile ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              width: '100%',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                maxWidth: 180,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={value || ''}
            >
              {value || '—'}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
              <Button
                size="small"
                startIcon={<DownloadIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => handleDownload(row)}
                sx={{
                  minWidth: 0,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  px: 1.5,
                  py: 0.5,
                }}
              >
                Baixar
              </Button>
              <Button
                size="small"
                startIcon={<PictureAsPdfIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => handleOpenPdf(row)}
                sx={{
                  minWidth: 0,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  px: 1.5,
                  py: 0.5,
                }}
              >
                Ver
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      label: 'Criado em',
      field: 'createdAtFormatted',
      align: 'left',
      width: '150px',
    },
  ];

  const fetchList = async () => {
    try {
      setLoading(true);
      const projId = Number(projectProgramId);
      const { data } = await api.listProjectDocuments(projId);
      const list: Row[] =
        (data.items || []).map((item) => ({
          ...item,
          createdAtFormatted: item.createdAt
            ? new Date(item.createdAt).toLocaleString('pt-BR')
            : '',
          hasFile: !!item.fileName,
        })) ?? [];
      setItems(list);
      setNoDataMessage(list.length ? '' : 'Nenhum documento encontrado.');
    } catch {
      toast.error('Erro ao carregar documentos.');
      setItems([]);
      setNoDataMessage('Nenhum documento encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setFile(null);
    setFileLabel('');
  };

  const handleAdd = () => {
    if (items.length >= 5) {
      toast.warning('Limite de 5 documentos atingido para este projeto.');
      return;
    }
    resetForm();
    setIsVisualizing(false);
    setOpenModal(true);
  };

  const handleView = async (row: Row) => {
    try {
      const { data } = await api.getProjectDocument(row.projectDocumentId!);
      setEditing(row);
      setName(data.name || '');
      setDescription(data.description || '');
      setFile(null);
      setFileLabel(data.fileName || '');
      setIsVisualizing(true);
      setOpenModal(true);
    } catch {
      toast.error('Erro ao carregar documento.');
    }
  };

  const handleEdit = async (row: Row) => {
    try {
      const { data } = await api.getProjectDocument(row.projectDocumentId!);
      setEditing(row);
      setName(data.name || '');
      setDescription(data.description || '');
      setFile(null);
      setFileLabel(data.fileName || '');
      setIsVisualizing(false);
      setOpenModal(true);
    } catch {
      toast.error('Erro ao carregar documento para edição.');
    }
  };

  const handleDelete = (row: Row) => {
    setConfirmDialog({ open: true, loading: false, row });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.row) return;
    try {
      setConfirmDialog((p) => ({ ...p, loading: true }));
      await api.deleteProjectDocument(confirmDialog.row.projectDocumentId!);
      toast.success('Documento removido com sucesso.');
      setConfirmDialog({ open: false, loading: false, row: null });
      fetchList();
    } catch {
      toast.error('Erro ao remover documento.');
      setConfirmDialog((p) => ({ ...p, loading: false }));
    }
  };

  const handleDownload = async (row: Row) => {
    try {
      const response = await api.downloadProjectDocument(
        row.projectDocumentId!,
        { responseType: 'blob' as any }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = row.fileName || 'documento.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Erro ao baixar arquivo.');
    }
  };

  const handleOpenPdf = async (row: Row) => {
    try {
      const response = await api.downloadProjectDocument(
        row.projectDocumentId!,
        { responseType: 'blob' as any }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      toast.error('Erro ao abrir arquivo.');
    }
  };

  const validateForm = () => {
    if (!name.trim()) return 'Informe o nome do documento.';
    if (!editing && !file) return 'Selecione um arquivo.';
    return '';
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    try {
      setModalLoading(true);
      if (editing) {
        await api.updateProjectDocument(
          editing.projectDocumentId!,
          name.trim(),
          description.trim(),
          file || undefined,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Documento atualizado com sucesso.');
      } else {
        await api.createProjectDocument(
          Number(projectProgramId),
          name.trim(),
          description.trim(),
          file!,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Documento criado com sucesso.');
      }
      setOpenModal(false);
      resetForm();
      fetchList();
    } catch {
      toast.error('Erro ao salvar documento.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setFile(null);
      setFileLabel('');
      return;
    }
    const selected = files[0];
    setFile(selected);
    setFileLabel(selected.name);
  };

  const dialogTitle = () =>
    isVisualizing
      ? 'Visualizar Documento'
      : editing
      ? 'Editar Documento'
      : 'Adicionar Documento';

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha('#1E4EC4', 0.1),
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            borderColor: '#1E4EC4',
            color: '#1E4EC4',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            mb: 2,
          }}
        >
          Voltar
        </Button>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Projeto
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {projectName || 'Projeto'}
          </Typography>
        </Box>

        <TitleAndButtons
          title="Documentos do Projeto"
          onAdd={handleAdd}
          addLabel="Novo Documento"
          addIcon={<AddCircleOutlineIcon />}
        />

        <Box sx={{ mt: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table<Row>
              columns={columns}
              data={items}
              pagination={false}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              noDataMessage={noDataMessage}
            />
          )}
        </Box>
      </Paper>

      <DialogPadronized
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        title={dialogTitle()}
        content={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              mt: 1.5,
            }}
          >
            <TextField
              label="Nome*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
            />
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Selecionar arquivo
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </Button>
              {(fileLabel || editing?.fileName) && (
                <Chip
                  label={fileLabel || editing?.fileName}
                  sx={{ ml: 2, mt: { xs: 1, sm: 0 } }}
                />
              )}
            </Box>
          </Box>
        }
        actions={
          <>
            <Button
              onClick={() => setOpenModal(false)}
              disabled={modalLoading}
              sx={{ textTransform: 'none' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={modalLoading}
              sx={{
                bgcolor: '#1E4EC4',
                color: 'white',
                textTransform: 'none',
              }}
            >
              {modalLoading ? <CircularProgress size={20} /> : 'Salvar'}
            </Button>
          </>
        }
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, loading: false, row: null })
        }
        onConfirm={handleConfirmDelete}
        title="Confirmar exclusão"
        message="Deseja realmente remover este documento?"
        highlightText={confirmDialog.row?.name}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        loading={confirmDialog.loading}
        danger
      />
    </Container>
  );
};

export default ProjectDocument;
