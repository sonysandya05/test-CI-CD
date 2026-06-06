import AppBreadcrumb from '../../components/Breadcrumb';
import ListView from '../../components/ListView';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Submissions', href: '/submissions' },
];

export default function SubmissionsPage() {
  return (
    <main className="module-list-page">
      <AppBreadcrumb items={breadcrumbItems} />
      <ListView moduleName="submissions" />
    </main>
  );
}