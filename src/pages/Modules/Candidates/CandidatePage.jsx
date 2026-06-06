import { BellOutlined, HomeOutlined, MailOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import AppBreadcrumb from '../../../components/Breadcrumb';
import AppAlert from '../../../components/AppAlert';
import Button from '../../../components/AppButton';
import ListView from '../../../components/ListView';
import AppCard from '../../../components/cards/AppCard';
import Form from '../../../components/AddFormV1';
import previewIcon from '../../../components/images/common/eyeoutlined.svg';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Candidates', href: '/candidates' },
];

export default function CandidatePage() {
  return (
    <main >
      <AppBreadcrumb items={breadcrumbItems} />
      <ListView moduleName={'candidate'} />
    </main>
  );
}
