import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material'
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import GoogleColoredIcon from '../shared/ui/GoogleColoredIcon'
import { useAuthStore } from '../entities/auth/store'
import { env } from '../shared/config/env'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = () => {
    window.location.href = `${env.API_URL}/auth/google`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный email или пароль')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
          }}
        >
          <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700 }}>
            AI Wine Cellar
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Войдите в свой аккаунт
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleColoredIcon />}
            onClick={handleGoogleLogin}
            sx={{ mb: 3 }}
          >
            Войти через Google
          </Button>

          <Divider sx={{ mb: 3 }}>или</Divider>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mb: 2 }} disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color: '#BE0212', textDecoration: 'none', fontWeight: 500 }}>
              Зарегистрироваться
            </Link>
          </Typography>
        </Paper>
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default LoginPage
