import AppBreadcrumb from '../../components/Breadcrumb';
import ListView from '../../components/ListView';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Test Cases', href: '/test-cases' },
];

export default function TestHomePage() {
  return (
    <main className="jobs-list-page">
      <AppBreadcrumb items={breadcrumbItems} />
      <ListView moduleName={'test-flows'} rowKey="id" />
    </main>
  );
}
