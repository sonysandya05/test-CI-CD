import DynamicFieldFilter from './DynamicFieldFilter';

export function JobFilters({ open = false, onClose, onApply }) {
  return (
    <DynamicFieldFilter
      moduleName="jobs"
      open={open}
      onClose={onClose}
      onApply={onApply}
    />
  );
}

export default JobFilters;
