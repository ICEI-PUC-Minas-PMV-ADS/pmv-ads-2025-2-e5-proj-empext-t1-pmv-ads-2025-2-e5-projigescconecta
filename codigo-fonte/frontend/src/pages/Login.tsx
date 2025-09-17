import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Link as MUILink,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { AuthApi, Configuration, LoginResponse, UserLogin } from './../api';

import logoGest from '../assets/logo-gesc.png';
import { scheduleTokenRefresh } from '@/services/auth';

/* ===== Validações ===== */
const isValidEmail = (rawEmail: string) => {
  const email = rawEmail.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

const isValidPassword = (password: string) => {
  if (password.length < 6) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  return true;
};

export default function Login() {
  const [email, setEmail] = useState('');
  /*   const [touchedEmail, setTouchedEmail] = useState(false);
   */
  const [password, setPassword] = useState('');
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const passwordValid = useMemo(() => isValidPassword(password), [password]);
  /* const formValid = emailValid && passwordValid; */
  const formValid = true;
  const configuration = new Configuration();
  const apiInstance = new AuthApi(configuration);
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    /* Validações */
    e.preventDefault();
    /*     if (!touchedEmail) setTouchedEmail(true);
    if (!touchedPassword) setTouchedPassword(true); */

    if (!formValid) {
      if (!emailValid && !passwordValid) toast.info('Preencha os campos obrigatórios.');
      else if (!emailValid) toast.warning('E-mail inválido ou ausente.');
      else toast.warning('Senha inválida. Verifique os requisitos.');
      return;
    }

    const userLogin: UserLogin = {
      email: email,
      password: password,
    };

    try {
      const { status, data } = await apiInstance.login(userLogin);
      if (status === 200) {
        toast.success('Login realizado com sucesso!');
        console.log('Dados do login:', data);
        const loginResponse: LoginResponse = {
          accessToken: data.accessToken,
          refreshToken: data.refresfToken,
          expiresIn: data.expiresIn,
        };
        localStorage.setItem('loginResponse', JSON.stringify(loginResponse));
        scheduleTokenRefresh(parseInt(loginResponse.expiresIn));
        navigate('/home');
      }
    } catch (error) {
      toast.error('Erro ao realizar login. Verifique suas credenciais.');
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#FCFCFC" position="relative">
      {/* Logo + traço no topo (posição absoluta) */}
      <Box
        position="absolute"
        top={{ xs: 24, sm: 32 }}
        left="50%"
        sx={{ transform: 'translateX(-50%)' }}
        zIndex={1}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            component="img"
            src={logoGest}
            alt="Instituto GESC"
            sx={{ width: { xs: 96, sm: 120 }, mb: 2 }}
          />
          <Box
            sx={{
              width: { xs: 160, sm: 220 },
              height: 2,
              bgcolor: '#264197',
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>

      {/* Conteúdo principal centralizado 100% */}
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" px={2}>
        <Box width="100%" maxWidth={420} display="flex" flexDirection="column" alignItems="center">
          {/* Título */}
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{
              color: '#264197',
              fontWeight: 700,
              fontSize: { xs: '1.875rem', sm: '2.125rem' },
              mb: 3,
            }}
          >
            Login
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            width="100%"
            px={{ xs: 1, sm: 0 }}
          >
            {/* E-mail */}
            <TextField
              fullWidth
              label="Digite seu e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />

            {/* Senha */}
            <TextField
              fullWidth
              label="Digite sua senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouchedPassword(true)}
              margin="normal"
              required
              autoComplete="current-password"
              /* error={touchedPassword && !passwordValid}
              helperText={
                touchedPassword && !passwordValid
                  ? 'Mín. 6 caracteres, com 1 dígito, 1 minúscula e 1 maiúscula.'
                  : ' '
              } */
              slotProps={{
                input: {
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
                },
              }}
            />

            {/* Botão Entrar */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                disabled={!formValid}
                onClick={() => handleSubmit}
                sx={{
                  minWidth: { xs: '100%', sm: 220 },
                  borderRadius: '12px',
                  bgcolor: '#21AD53',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.1,
                  '&:hover': { bgcolor: '#1a9446' },
                  '&:disabled': { bgcolor: '#BEEBD0', color: '#FFFFFF' },
                }}
              >
                Entrar
              </Button>
            </Box>

            {/* Link de recuperação */}
            <Box display="flex" justifyContent="center" mt={2}>
              <MUILink
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  color: '#656D77',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Esqueceu a Senha?
              </MUILink>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
