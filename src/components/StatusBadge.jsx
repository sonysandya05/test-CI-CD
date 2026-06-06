import { Tag } from 'antd';
import { STATUS_TAG } from '../data/jobs';

export default function StatusBadge({ status }) {
  const meta = STATUS_TAG[status] || { color: 'default' };
  return (
    <Tag color={meta.color} style={{ borderRadius: 6, fontWeight: 500, fontSize: 12 }}>
      {status}
    </Tag>
  );
}
