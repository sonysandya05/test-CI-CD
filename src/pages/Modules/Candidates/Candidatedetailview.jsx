import AppBreadcrumb from '../../../components/Breadcrumb';
import ZinnextDetailedView from '../../common-detailedView';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Candidates', href: '/candidates' },
  { label: 'Detail View', href: '/candidates/:id' },
];

export default function CandidateDetailView() {
  return (
    <main>
      <AppBreadcrumb items={breadcrumbItems} />
      <ZinnextDetailedView initialActiveTab="candidates" />
    </main>
  );
}
