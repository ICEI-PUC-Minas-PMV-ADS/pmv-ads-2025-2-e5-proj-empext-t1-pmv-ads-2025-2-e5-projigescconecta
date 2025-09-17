import React from 'react';
import { Button } from '@mui/material';

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bem-vindo ao Igesc Conecta!</h1>
      <p>Esta é a página inicial do seu projeto.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }} >
        <Button
          type="submit"
          variant="contained"
          onClick={()=> { window.location.href = '/login'} }
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
          onClick={()=> { window.location.href = '/forgot-password'} }
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
          onClick={()=> { window.location.href = '/new-password'} }
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
    </div>
  );
};

export default Home;
