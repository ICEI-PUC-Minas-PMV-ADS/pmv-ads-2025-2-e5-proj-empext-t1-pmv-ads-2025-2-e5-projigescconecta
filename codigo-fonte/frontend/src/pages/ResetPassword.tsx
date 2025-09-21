import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthApi, Configuration } from './../api';
import { toast } from 'react-toastify';

// Validação de senha detalhada
const getPasswordValidation = (password) => {
  return {
    length: password.length >= 6,
    hasNumber: /[0-9]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    isValid:
      password.length >= 6 &&
      /[0-9]/.test(password) &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password),
  };
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

  const passwordValidation = useMemo(() => getPasswordValidation(novaSenha), [novaSenha]);
  const passwordsMatch = novaSenha && confirmacao && novaSenha === confirmacao;
  const showPasswordError = confirmacao.length > 0 && !passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!novaSenha || !confirmacao) {
      toast.error('Preencha todos os campos.');
      return;
    }

    if (!passwordValidation.isValid) {
      toast.warning('Senha não atende aos critérios de segurança.');
      return;
    }

    if (!passwordsMatch) {
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

      const request = {
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
      toast.error('Token inválido ou expirado. Solicite um novo link de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <ListItem dense sx={{ py: 0.25 }}>
      <ListItemIcon sx={{ minWidth: 28 }}>
        {isValid ? (
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
        ) : (
          <CancelIcon sx={{ color: 'error.main', fontSize: 18 }} />
        )}
      </ListItemIcon>
      <ListItemText
        primary={text}
        sx={{
          '& .MuiTypography-root': {
            fontSize: '0.875rem',
            color: isValid ? 'success.main' : 'error.main',
          },
        }}
      />
    </ListItem>
  );

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
            color: '#656D77',
            fontWeight: 600,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} /> Voltar ao Login
        </Link>

        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          sx={{
            color: '#264197',
            fontWeight: 700,
            fontSize: { xs: '1.8rem', sm: '2rem' },
            mb: 1,
          }}
        >
          Nova senha
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Nova senha */}
          <TextField
            fullWidth
            label="Digite sua nova senha"
            type={showPassword ? 'text' : 'password'}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            margin="normal"
            required
            error={novaSenha.length > 0 && !passwordValidation.isValid}
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
          />

          {/* Critérios de validação da senha */}
          {novaSenha.length > 0 && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                Critérios da senha:
              </Typography>
              <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1 }}>
                <ValidationItem isValid={passwordValidation.length} text="Mínimo 6 caracteres" />
                <ValidationItem isValid={passwordValidation.hasNumber} text="Pelo menos 1 número" />
                <ValidationItem
                  isValid={passwordValidation.hasLowercase}
                  text="Pelo menos 1 letra minúscula"
                />
                <ValidationItem
                  isValid={passwordValidation.hasUppercase}
                  text="Pelo menos 1 letra maiúscula"
                />
              </List>
            </Box>
          )}

          {/* Confirmação */}
          <TextField
            fullWidth
            label="Confirme sua senha"
            type={showConfirm ? 'text' : 'password'}
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            margin="normal"
            required
            error={showPasswordError}
            helperText={showPasswordError ? 'As senhas não coincidem' : ''}
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

          {/* Feedback de sucesso */}
          {passwordValidation.isValid && passwordsMatch && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              Senha válida e confirmada!
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading || !passwordValidation.isValid || !passwordsMatch}
            sx={{
              mt: 4,
              py: 1.25,
              px: 5,
            }}
          >
            {loading ? 'Alterando...' : 'Alterar'}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
