import { Typography, Card, Row, Col, Statistic } from 'antd'
import { WineOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title } = Typography

const DashboardPage = () => (
  <div>
    <Title level={2}>Дашборд</Title>
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic title="Бутылок в погребе" value={0} prefix={<WineOutlined />} />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic title="Дегустаций" value={0} prefix={<TrophyOutlined />} />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic title="Последняя активность" value="—" prefix={<ClockCircleOutlined />} />
        </Card>
      </Col>
    </Row>
  </div>
)

export default DashboardPage
