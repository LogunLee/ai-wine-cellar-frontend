import { Outlet } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { WineOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuthStore } from '../entities/auth/store'

const { Header, Content, Sider } = Layout

export const MainLayout = () => {
  const { user, logout } = useAuthStore()

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Дашборд' },
    { key: '/cellar', icon: <WineOutlined />, label: 'Погреб' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={{ padding: '16px', color: '#fff', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          AI Wine Cellar
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0 24px' }}>
          <span>{user?.displayName || user?.email}</span>
          <LogoutOutlined onClick={logout} style={{ cursor: 'pointer', fontSize: '18px' }} />
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
