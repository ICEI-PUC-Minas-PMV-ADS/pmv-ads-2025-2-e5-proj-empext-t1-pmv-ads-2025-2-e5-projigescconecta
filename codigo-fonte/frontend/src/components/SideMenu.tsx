import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import BusinessIcon from '@mui/icons-material/Business';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
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
  { path: '/course', label: 'Programas', icon: <SchoolIcon /> },
  { path: '/team', label: 'Turmas', icon: <GroupIcon /> },
  { path: '/osc', label: 'OSC', icon: <PublicIcon /> },
  { path: '/beneficiary', label: 'Público', icon: <GroupsIcon /> },
  { path: '/business-case', label: 'Grupo de Causas', icon: <Diversity2Icon /> },
  { path: '/empresa', label: 'Empresa', icon: <BusinessIcon /> },
  { path: '/donation', label: 'Doações', icon: <VolunteerActivismIcon /> },
  { path: '/user', label: 'Usuários', icon: <PeopleAltIcon /> },
];

export default function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const loginRaw = localStorage.getItem('loginResponse');
  const login = loginRaw ? JSON.parse(loginRaw) : {};
  const firstName =
    typeof login?.name === 'string' && login.name.trim()
      ? login.name.trim().split(/\s+/)[0]
      : '';

  const handleLogout = () => {
    localStorage.removeItem('loginResponse');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const listRef = useRef<HTMLUListElement | null>(null);
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(false);
  const scrollState = useRef<{ timer: any | null }>({ timer: null });

  const updateArrows = () => {
    const el = listRef.current;
    if (!el) return;
    const up = el.scrollTop > 0;
    const down = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    setCanUp(up);
    setCanDown(down);
  };

  const startScroll = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    stopScroll();
    scrollState.current.timer = setInterval(() => {
      el.scrollBy({ top: dir * 8, behavior: 'auto' });
      updateArrows();
    }, 16);
  };

  const stopScroll = () => {
    if (scrollState.current.timer) {
      clearInterval(scrollState.current.timer);
      scrollState.current.timer = null;
    }
  };

  const nudge = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ top: dir * 140, behavior: 'smooth' });
    setTimeout(updateArrows, 220);
  };

  useEffect(() => {
    updateArrows();
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener('scroll', onScroll);
    const onResize = () => updateArrows();
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      stopScroll();
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: { xs: 196, md: 232 },
        overflow: 'hidden',
        flexShrink: 0,
        p: { xs: 1.25, md: 1.75 },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: IGESC_COLORS.AZUL_CLARO,
          p: { xs: 1.75, md: 2.5 },
          borderRadius: 2,
          boxShadow: 3,
          gap: { xs: 0.25, md: 0.5 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: { xs: 1, md: 1.25 },
            color: IGESC_COLORS.BRANCO,
            fontWeight: 'bold',
            textAlign: 'left',
            fontSize: { xs: '0.98rem', md: '1.06rem' },
            lineHeight: 1.1,
          }}
        >
          IGESC Conecta
        </Typography>

        <Divider sx={{ mb: { xs: 1, md: 1.25 }, borderColor: IGESC_COLORS.BRANCO, opacity: 0.3 }} />

        <List
          ref={listRef}
          sx={{
            display: 'grid',
            gridAutoRows: 'min-content',
            rowGap: { xs: 0.5, md: 0.6 },
            overflowY: 'auto',
            pr: 0.5,
            mr: -0.5,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            flex: 1,
            minHeight: 0,
          }}
        >
          {menuItems.map((item) => {
            const isSelected =
              location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isSelected}
                  sx={{
                    borderRadius: 1,
                    color: IGESC_COLORS.BRANCO,
                    py: { xs: 0.55, md: 0.7 },
                    px: { xs: 1.1, md: 1.3 },
                    minHeight: { xs: 36, md: 42 },
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.10)' },
                    '&.Mui-selected': {
                      backgroundColor: IGESC_COLORS.VERDE_ACAO,
                      color: IGESC_COLORS.BRANCO,
                      fontWeight: 700,
                      '&:hover': { backgroundColor: IGESC_COLORS.AZUL_ESCURO },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: { xs: 26, md: 30 },
                      color: IGESC_COLORS.BRANCO,
                      '& svg': { fontSize: { xs: 19, md: 21 } },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: { xs: '0.92rem', md: '0.98rem' },
                      fontWeight: 600,
                      lineHeight: 1.15,
                    }}
                    primary={item.label}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ mt: 'auto', mb: { xs: 0.5, md: 0.9 }, borderColor: IGESC_COLORS.BRANCO, opacity: 0.25 }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: IGESC_COLORS.BRANCO,
            px: { xs: 0.25, md: 0.75 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '0.88rem', md: '0.94rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '70%',
            }}
            title={firstName}
          >
            {firstName}
          </Typography>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              minWidth: 34,
              maxWidth: 40,
              p: 0.5,
              color: IGESC_COLORS.BRANCO,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            <LogoutIcon sx={{ fontSize: { xs: 20, md: 22 } }} />
          </ListItemButton>
        </Box>

        {canUp && (
          <IconButton
            onMouseDown={() => startScroll(-1)}
            onMouseUp={stopScroll}
            onMouseLeave={stopScroll}
            onClick={() => nudge(-1)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: 2,
              backdropFilter: 'blur(6px)',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              color: '#fff',
              '&:hover': { background: 'rgba(255,255,255,0.28)' },
            }}
          >
            <ArrowDropUpIcon />
          </IconButton>
        )}

        {canDown && (
          <IconButton
            onMouseDown={() => startScroll(1)}
            onMouseUp={stopScroll}
            onMouseLeave={stopScroll}
            onClick={() => nudge(1)}
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: 2,
              backdropFilter: 'blur(6px)',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              color: '#fff',
              '&:hover': { background: 'rgba(255,255,255,0.28)' },
            }}
          >
            <ArrowDropDownIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
