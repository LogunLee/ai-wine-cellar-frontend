import { Typography, Empty } from 'antd'

const { Title } = Typography

const CellarPage = () => (
  <div>
    <Title level={2}>Погреб</Title>
    <Empty description="Погреб пуст. Добавьте первую бутылку!" />
  </div>
)

export default CellarPage
