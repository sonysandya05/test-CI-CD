import { Avatar, Tooltip } from 'antd';

export default function AssigneeAvatars({ assignees, extraAssignees }) {
  return (
    <Avatar.Group maxCount={3} size="small">
      {assignees.map((a, i) => (
        <Tooltip title={a.initials} key={i}>
          <Avatar
            size="small"
            style={{ backgroundColor: a.color, fontSize: 10, fontWeight: 600, cursor: 'default' }}
          >
            {a.initials}
          </Avatar>
        </Tooltip>
      ))}
      {extraAssignees > 0 && (
        <Avatar size="small" style={{ backgroundColor: '#d9d9d9', color: '#555', fontSize: 10 }}>
          +{extraAssignees}
        </Avatar>
      )}
    </Avatar.Group>
  );
}
