import React from 'react';
import { Button, Box } from '@mui/material';
import logoGest from '../assets/logo-gesc.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home: React.FC = () => {
  const exibirBotoes: boolean = false; // Alterar para false para esconder os botões

  const changeDisplay = exibirBotoes ? 'flex' : 'none';
  const navigate = useNavigate();

  const deslogar = () => {
    localStorage.removeItem('loginResponse');
    console.log('Usuário deslogado');
    toast.success('Usuário deslogado com sucesso!');
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* Logo IGESC */}
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
      <h1>Bem-vindo ao Igesc Conecta!</h1>
      <p>Esta é a página inicial do seu projeto.</p>
      <div style={{ display: changeDisplay, justifyContent: 'center', gap: '16px' }}>
        <Button
          type="submit"
          variant="contained"
          onClick={() => {
            window.location.href = '/login';
          }}
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
          Login
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={() => {
            window.location.href = '/forgot-password';
          }}
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
          Esqueci senha
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={() => {
            window.location.href = '/reset-password';
          }}
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
          Nova Senha
        </Button>
      </div>
      <Box sx={{ mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          onClick={deslogar}
          sx={{
            bgcolor: '#FF4C4C',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#e04343' },
          }}
        >
          Deslogar
        </Button>
      </Box>
    </div>
  );
};

export default Home;
