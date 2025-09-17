import { useState } from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { AuthApi, Configuration, ForgotPasswordRequest } from './../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const configuration = new Configuration();
  const apiInstance = new AuthApi(configuration);

  // Função para validar formato do email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!email) {
      setErrorMessage('Por favor, insira um endereço de e-mail.');
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    // Validação de formato
    if (!validateEmail(email)) {
      setErrorMessage('Por favor, insira um endereço de e-mail válido.');
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    console.log('Enviando e-mail para:', email);

    try {
      setButtonLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const emailRequest: ForgotPasswordRequest = { email: email };
      const { status, data } = await apiInstance.forgotPassword(emailRequest);

      if (status === 200) {
        setSuccessMessage(data?.message || 'E-mail enviado com sucesso!');
        toast.success('Verifique sua caixa de entrada para mais instruções.');
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      setErrorMessage('Erro ao enviar o e-mail. Tente novamente mais tarde.');
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#F6F6F7"
    >
      <Box width="100%" maxWidth={400} bgcolor="#FFFFFF" boxShadow={3} borderRadius={2} p={4}>
        <Link
          component="button"
          onClick={() => (window.location.href = '/login')}
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
          Esqueci minha senha
        </Typography>

        <Typography variant="body2" textAlign="center" mb={3} sx={{ color: '#656D77' }}>
          Insira o seu endereço de e-mail ou o seu login de acesso associado à sua conta na
          plataforma.
        </Typography>

        <form onSubmit={handleSendEmail}>
          <TextField
            fullWidth
            label="Digite seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errorMessage}
            helperText={errorMessage}
            margin="normal"
            required
          />

          {successMessage && (
            <Typography
              variant="body2"
              sx={{
                color: '#21AD53',
                mt: 1,
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              {successMessage}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={buttonLoading}
            sx={{
              mt: 2,
              bgcolor: '#21AD53',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#1a9446',
              },
            }}
          >
            {buttonLoading ? 'Enviando...' : 'Continuar'}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
