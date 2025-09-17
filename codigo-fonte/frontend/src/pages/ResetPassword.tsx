import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthApi, Configuration, ResetPasswordRequest } from './../api';
import { toast } from 'react-toastify';

// Validação de senha
const isValidPassword = (password: string) => {
  if (password.length < 6) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  return true;
};

export default function ResetPassword() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const senhaValida = useMemo(() => isValidPassword(novaSenha), [novaSenha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaSenha || !confirmacao) {
      toast.error('Preencha todos os campos.');
      return;
    }

    if (!senhaValida) {
      toast.warning('Senha inválida. Mín. 6 caracteres, 1 dígito, 1 minúscula e 1 maiúscula.');
      return;
    }

    if (novaSenha !== confirmacao) {
      toast.error('As senhas não coincidem.');
      return;
    }

    if (!uid || !token) {
      toast.error('Parâmetros inválidos. Tente acessar pelo link correto.');
      return;
    }

    setLoading(true);

    try {
      const configuration = new Configuration();
      const api = new AuthApi(configuration);

      const request: ResetPasswordRequest = {
        userId: Number(uid),
        token,
        newPassword: novaSenha,
      };

      await api.resetPassword(request);

      toast.success('Senha alterada com sucesso! Redirecionando para login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao resetar senha:', err);
      toast.error(err?.message || 'Ocorreu um erro ao alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#F6F6F7"
      p={2}
    >
      <Box width="100%" maxWidth={400} bgcolor="#FFFFFF" boxShadow={3} borderRadius={2} p={4}>
        <Link
          component="button"
          onClick={() => navigate('/login')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            color: '#1E4EC4',
            fontWeight: 500,
          }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} /> Voltar
        </Link>

        <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: '#264197' }}>
          Nova senha
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Nova senha */}
          <TextField
            fullWidth
            label="Digite sua nova senha"
            type={showPassword ? 'text' : 'password'}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((s) => !s)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Mín. 6 caracteres, 1 dígito, 1 minúscula e 1 maiúscula."
            error={novaSenha.length > 0 && !senhaValida}
          />

          {/* Confirmação */}
          <TextField
            fullWidth
            label="Confirme sua senha"
            type={showConfirm ? 'text' : 'password'}
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((s) => !s)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              mt: 2,
              bgcolor: '#21AD53',
              color: '#FFFFFF',
              '&:hover': { bgcolor: '#1a9446' },
            }}
          >
            {loading ? 'Alterando...' : 'Alterar'}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
