import AddFormV1 from '../../../components/AddFormV1';
import AppBreadcrumb from '../../../components/Breadcrumb';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Candidates', href: '/candidates' },
  { label: 'Add Candidate', href: '/candidate-create' },
];

export default function CandidateAddForm() {
  return (
    <main >
      <AppBreadcrumb items={breadcrumbItems} />
      <AddFormV1
        moduleName="candidate"
        submitText="Create"
        cancelPath="/candidates"
      />
    </main>

  );
}
