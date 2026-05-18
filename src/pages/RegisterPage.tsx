import { Form, Input, Button, Typography, message, Divider } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleOutlined } from '@ant-design/icons'
import { useAuthStore } from '../entities/auth/store'
import { env } from '../shared/config/env'

const { Title } = Typography

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()

  const onFinish = async (values: { email: string; password: string; displayName?: string }) => {
    try {
      await register(values.email, values.password, values.displayName)
      navigate('/')
    } catch {
      message.error('Не удалось зарегистрироваться')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${env.API_URL}/auth/google`
  }

  return (
    <div style={{ maxWidth: 400, margin: '120px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center' }}>Регистрация</Title>

      <Button
        type="default"
        icon={<GoogleOutlined />}
        onClick={handleGoogleLogin}
        block
        size="large"
        style={{ marginBottom: 16 }}
      >
        Зарегистрироваться через Google
      </Button>

      <Divider>или</Divider>

      <Form onFinish={onFinish} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="displayName" label="Имя">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true, min: 8 }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Зарегистрироваться
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </Form>
    </div>
  )
}

export default RegisterPage
