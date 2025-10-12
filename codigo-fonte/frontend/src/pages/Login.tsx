// src/pages/Login.tsx
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Link as MUILink,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { AuthApi, Configuration, LoginResponse, UserLogin, UsersApi } from './../api'
import logoGest from '../assets/logo-gesc.png'
import { apiConfig, persistLoginResponse, scheduleTokenRefresh } from '@/services/auth'
import { jwtDecode } from 'jwt-decode'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touchedPassword, setTouchedPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isValidEmail = (rawEmail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(rawEmail.trim())
  const isValidPassword = (pwd: string) =>
    pwd.length >= 6 && /[0-9]/.test(pwd) && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd)

  const emailValid = useMemo(() => isValidEmail(email), [email])
  const passwordValid = useMemo(() => isValidPassword(password), [password])
  const formValid = emailValid && passwordValid

  const apiInstance = new AuthApi(new Configuration())
  const navigate = useNavigate()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!formValid) {
      if (!emailValid && !passwordValid) toast.info('Preencha os campos obrigatórios.')
      else if (!emailValid) toast.warning('E-mail inválido ou ausente.')
      else toast.warning('Senha inválida. Verifique os requisitos.')
      return
    }

    const userLogin: UserLogin = { email, password }

    try {
      const { status, data } = await apiInstance.login(userLogin)
      if (status === 200) {
        toast.success('Login realizado com sucesso!')

        const loginResponse: LoginResponse = {
          accessToken: data.accessToken,
          refreshToken: data.refresfToken,
          expiresIn: data.expiresIn,
        }

        persistLoginResponse(loginResponse)

        const expires = Number(loginResponse.expiresIn || 0)
        if (expires > 0) scheduleTokenRefresh(expires)

        try {
          const decoded: any = jwtDecode(loginResponse.accessToken || '')
          const userId = Number(
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
          )
          if (userId) {
            const usersApi = new UsersApi(apiConfig)
            const { data: user } = await usersApi.getUserById(userId)
            if (user?.name) {
              persistLoginResponse(loginResponse, user.name)
            }
          }
        } catch {}

        navigate('/home')
      }
    } catch {
      toast.error('Erro ao realizar login. Verifique suas credenciais.')
    }
  }

  return (
    <Box minHeight="100vh" bgcolor="#FCFCFC" display="flex" alignItems="center" justifyContent="center" px={2}>
      <Box width="100%" maxWidth={420} display="flex" flexDirection="column" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="center" mb={{ xs: 2, sm: 3 }}>
          <Box component="img" src={logoGest} alt="Instituto GESC" sx={{ width: { xs: 96, sm: 120 }, mb: 1.5 }} />
          <Box sx={{ width: { xs: 160, sm: 220 }, height: 2, bgcolor: '#264197', borderRadius: 1 }} />
        </Box>

        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          sx={{ color: '#264197', fontWeight: 700, fontSize: { xs: '2rem', sm: '2.5rem' }, mb: { xs: 2, sm: 3 } }}
        >
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} width="100%" px={{ xs: 1, sm: 0 }}>
          <TextField
            fullWidth
            label="Digite seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

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

          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={!formValid}
              sx={{ minWidth: { xs: '100%', sm: 220 }, py: 1.25 }}
            >
              Entrar
            </Button>
          </Box>

          <Box display="flex" justifyContent="center" mt={2}>
            <MUILink
              component={RouterLink}
              to="/forgot-password"
              sx={{ color: '#656D77', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Esqueceu a Senha?
            </MUILink>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
