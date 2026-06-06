import { Col, Row } from 'antd';

import AppBreadcrumb from '../../components/Breadcrumb';
import CalendarCard from '../../components/cards/CalendarCard';
import StatsCards from '../../components/cards/StatsCards';
import OnboardingCard from '../../components/cards/OnboardingCard';
import ClientSubmissionCard from '../../components/cards/ClientSubmissionCard';
import StickyNotesCard from '../../components/cards/StickyNotesCard';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
];

export default function DashboardPage() {
  return (
    <main className="jobs-list-page">
      <AppBreadcrumb items={breadcrumbItems} />

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>

        {/* Left Column */}
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <StatsCards />
            </Col>

            <Col xs={24}>
              <ClientSubmissionCard />
            </Col>

            <Col xs={24}>
              <StickyNotesCard />
            </Col>
          </Row>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <CalendarCard />
            </Col>

            <Col xs={24}>
              <OnboardingCard />
            </Col>
          </Row>
        </Col>

      </Row>
    </main>
  );
}