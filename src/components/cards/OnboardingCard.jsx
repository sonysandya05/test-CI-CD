import { Button, Card, Row, Col, Statistic, Typography } from 'antd';

const { Title, Text } = Typography;

const defaultItems = [
  { label: 'In Progress',       value: 107, sub: 'Under review',        color: 'blue'   },
  { label: 'Hired',             value: 2,   sub: 'Onboarded',           color: 'green'  },
  { label: 'Project Completed', value: 2,   sub: 'Project cycle closed', color: 'purple' },
  { label: 'Archive',           value: 2,   sub: 'No longer active',    color: 'peach'  },
];

export default function OnboardingCard({ items = defaultItems }) {
  return (
    <Card
      className="onboarding-card"
      title={<Title level={5}>Onboarding</Title>}
      extra={<Button type="link">View all</Button>}
    >
      <Row gutter={[12, 12]}>
        {items.map(it => (
          <Col key={it.label} xs={12} sm={6} md={6} lg={12} xl={12}>
            <div className={`onboarding-item ${it.color}`}>
              <Text className="onboarding-item-label">{it.label}</Text>
              <Statistic value={it.value} className="onboarding-stat" />
              <div className="onboarding-item-footer">
                <Text className="onboarding-item-sub">{it.sub}</Text>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
