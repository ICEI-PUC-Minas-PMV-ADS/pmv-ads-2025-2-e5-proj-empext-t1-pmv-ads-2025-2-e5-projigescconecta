import React from 'react';
import { Button, Box } from '@mui/material';
import logoGest from '../assets/logo-gesc.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home: React.FC = () => {
  const exibirBotoes: boolean = false; // Alterar para true se quiser mostrar os botões

  const changeDisplay = exibirBotoes ? 'flex' : 'none';
  const navigate = useNavigate();

  const deslogar = () => {
    localStorage.removeItem('loginResponse');
    console.log('Usuário deslogado');
    toast.success('Usuário deslogado com sucesso!');
    navigate('/login');
  };

  return (
    // Container que ocupa a altura total e centraliza o conteúdo na área disponível (ao lado do menu)
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        textAlign: 'center',
      }}
    >
      <Box>
        {/* Logo IGESC */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            component="img"
            src={logoGest}
            alt="Instituto IGESC"
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

        <h1>Bem-vindo ao IGESC Conecta!</h1>
        <p>Esta é a página inicial do seu projeto.</p>

        <Box sx={{ display: changeDisplay as any, justifyContent: 'center', gap: '16px' }}>
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
        </Box>

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
      </Box>
    </Box>
  );
};

export default Home;
