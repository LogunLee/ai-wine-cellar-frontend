import { Form, Input, Button, Typography, message, Divider } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleOutlined } from '@ant-design/icons'
import { useAuthStore } from '../entities/auth/store'
import { env } from '../shared/config/env'

const { Title } = Typography

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password)
      navigate('/')
    } catch {
      message.error('Неверный email или пароль')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${env.API_URL}/auth/google`
  }

  return (
    <div style={{ maxWidth: 400, margin: '120px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center' }}>Вход</Title>

      <Button
        type="default"
        icon={<GoogleOutlined />}
        onClick={handleGoogleLogin}
        block
        size="large"
        style={{ marginBottom: 16 }}
      >
        Войти через Google
      </Button>

      <Divider>или</Divider>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Войти
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </Form>
    </div>
  )
}

export default LoginPage
