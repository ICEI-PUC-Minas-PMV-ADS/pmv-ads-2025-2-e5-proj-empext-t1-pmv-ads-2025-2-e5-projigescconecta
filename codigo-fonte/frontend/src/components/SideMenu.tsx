/* Provisório */
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate, useLocation } from 'react-router-dom';

const IGESC_COLORS = {
  AZUL_CLARO: '#1E4EC4',
  AZUL_ESCURO: '#264197',
  CINZA_MEDIO: '#666f77',
  CINZA_CLARO: '#e7e7e7',
  VERDE_ACAO: '#4CAF50',
  BRANCO: '#ffffff',
};

const menuItems = [
  { path: '/home', label: 'Início', icon: <HomeIcon /> },
  { path: '/course', label: 'Cursos', icon: <SchoolIcon /> },
  { path: '/team', label: 'Equipe', icon: <GroupIcon /> },
];

export default function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        p: 2,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: IGESC_COLORS.AZUL_CLARO,
          p: 4,
          borderRadius: 10,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: IGESC_COLORS.BRANCO,

            fontWeight: 'bold',
          }}
        >
          Meu App IGESC
        </Typography>
        <Divider sx={{ mb: 2, borderColor: IGESC_COLORS.BRANCO }} />
        <List>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isSelected}
                  sx={{
                    borderRadius: '4px',
                    color: IGESC_COLORS.BRANCO,
                    '&:hover': {
                      backgroundColor: 'rgba(30, 78, 196, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: IGESC_COLORS.VERDE_ACAO,
                      color: IGESC_COLORS.BRANCO,
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: IGESC_COLORS.AZUL_ESCURO,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 35,
                      color: IGESC_COLORS.BRANCO,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
