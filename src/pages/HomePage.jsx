import { BellOutlined, HomeOutlined, MailOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import AppBreadcrumb from '../components/Breadcrumb';
import AppAlert from '../components/AppAlert';
import Button from '../components/AppButton';
import ListView from '../components/ListView';
import AppCard from '../components/cards/AppCard';
import Form from '../components/AddFormV1';
import previewIcon from '../components/images/common/eyeoutlined.svg';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
];

export default function HomePage() {
  return (
    <main className="jobs-list-page">
      <AppCard
        title="My page"
        variant="soft"
        extra={(
          <span className="jobs-list-page__actions">
            <Tooltip title="Preview">
              <button type="button" className="jobs-list-page__icon-button" aria-label="Preview">
                <img src={previewIcon} alt="" className="jobs-list-page__preview-icon" />
              </button>
            </Tooltip>
            <Tooltip title="Notifications">
              <button type="button" className="jobs-list-page__icon-button" aria-label="Notifications">
                <BellOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Mail">
              <button type="button" className="jobs-list-page__icon-button" aria-label="Mail">
                <MailOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Help">
              <button type="button" className="jobs-list-page__icon-button" aria-label="Help">
                <QuestionCircleOutlined />
              </button>
            </Tooltip>
            <Button variant="primary" to="/add">Add</Button>
          </span>
        )}
      >
      </AppCard>
      <ListView moduleName={'jobs'}/>
    </main>
  );
}
