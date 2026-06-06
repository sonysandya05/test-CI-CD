import { Button, Card, Row, Col, Space, Tag, Typography, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const defaultNotes = [
  {
    type: 'purple',
    pill: 'Tagged',
    heading: 'Resume mismatch on Kiran Erravalla',
    body: 'Manager mentioned the submitted resume has an outdated client project. Review and resend before EOD.',
    footerLeft: 'Tagged by Anusha',
    footerRight: '10:15 AM',
    dot: null,
    date: null,
  },
  {
    type: 'peach',
    pill: 'Note',
    heading: 'Follow up with Deloitte panel',
    body: 'Submitted resume has an outdated client project. Review and resend.',
    footerLeft: 'Created by you',
    footerRight: 'Yesterday',
    dot: '#f97316',
    date: '04 April, 2026',
  },
  {
    type: 'green',
    pill: 'Note',
    heading: 'Follow up with Deloitte panel',
    body: 'Manager mentioned the submitted resume has an outdated client project. Review and resend before EOD.',
    footerLeft: 'Created by you',
    footerRight: 'Yesterday',
    dot: null,
    date: null,
  },
  {
    type: 'purple',
    pill: 'Tagged',
    heading: 'Resume mismatch on Kiran Erravalla',
    body: 'Manager mentioned the submitted resume has an outdated client project. Review and resend before EOD.',
    footerLeft: 'Tagged by Anusha',
    footerRight: '10:15 AM',
    dot: null,
    date: null,
  },
];

export default function StickyNotesCard({ notes = defaultNotes }) {
  return (
    <Card
      className="sticky-card"
      title={<Title level={5}>Sticky Notes</Title>}
      extra={
        <div className="sticky-card-actions">
          <Tooltip title="Add note">
            <Button type="text" icon={<PlusOutlined />} size="small" />
          </Tooltip>
          <Button type="link" size="small">View all</Button>
        </div>
      }
    >
      <Row gutter={[12, 12]}>
        {notes.map((n, i) => (
          <Col key={i} xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className={`sticky-note ${n.type}`}>

              <Space size={8} align="center" className="sticky-note-pill-row">
                <Tag>
                  {n.dot && <span className="sticky-note-dot" style={{ background: n.dot }} />}
                  {n.pill}
                </Tag>
                {n.date && <Text className="sticky-note-date">{n.date}</Text>}
              </Space>

              <Text strong className="sticky-note-heading">{n.heading}</Text>
              <Text className="sticky-note-body">{n.body}</Text>

              <Row justify="space-between" align="middle" className="sticky-note-footer">
                <Col><Text>{n.footerLeft}</Text></Col>
                <Col><Text>{n.footerRight}</Text></Col>
              </Row>

            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
