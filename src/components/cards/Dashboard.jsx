import { Col, Row } from 'antd';
import StatsCards from './StatsCards';
import ClientSubmissionCard from './ClientSubmissionCard';
import StickyNotesCard from './StickyNotesCard';
import CalendarCard from './CalendarCard';
import OnboardingCard from './OnboardingCard';
import ClientDetailsCard from './ClientDetailsCard';
import ListView from '../ListView';
import Breadcrumb from '../Breadcrumb';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard' },];

export default function DashboardCards() {
  return (
    <div className="dashboard-wrapper">
      <Breadcrumb items={breadcrumbItems} />
      <Row gutter={[16, 16]}>

        {/* Row 1: Stats - full width */}
        <Col span={12}>
          <StatsCards />
        </Col>

        {/* Row 2: Client Submission + Sticky Notes */}
        <Col xs={12} md={12}>
          <ClientSubmissionCard />
        </Col>
        <Col xs={12} md={12}>
          <StickyNotesCard />
        </Col>

        {/* Row 3: Calendar + Onboarding */}
        <Col xs={12} md={12}>
          <CalendarCard />
        </Col>
        <Col xs={8} md={8}>
          <OnboardingCard />
        </Col>

        {/* Row 4: Client Details - full width */}
        <Col span={16}>
          <ClientDetailsCard />
        </Col>

        {/* Row 5: List View - full width */}
        <Col span={24}>
          <ListView />
        </Col>

      </Row>
    </div>
  );
}
