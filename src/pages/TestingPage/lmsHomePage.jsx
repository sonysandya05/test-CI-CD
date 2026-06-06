import AppBreadcrumb from '../../components/Breadcrumb';
import ListView from '../../components/ListView';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'LMS Cases', href: '/lms-cases' },
];

export default function LmsHomePage() {
  return (
    <main className="jobs-list-page">
      <AppBreadcrumb items={breadcrumbItems} />
      <ListView moduleName={'lms-flows'} rowKey="id" />
    </main>
  );
}
