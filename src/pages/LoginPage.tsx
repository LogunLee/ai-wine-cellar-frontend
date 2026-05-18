import { Form, Input, Button, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../entities/auth/store'

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

  return (
    <div style={{ maxWidth: 400, margin: '120px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center' }}>Вход</Title>
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
