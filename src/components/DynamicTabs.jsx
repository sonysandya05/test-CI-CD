import { Space, Tabs, Badge } from 'antd';

function hasCount(count) {
  return count !== null && count !== undefined;
}

function capitalizeFirstLetter(value) {
  const label = String(value);

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function normalizeTab(tab, index) {
  if (!tab || typeof tab !== 'object') return null;

  const key = tab.key ?? tab.value ?? tab.id ?? String(index);
  const title = tab.title ?? tab.tabTitle ?? tab.label ?? tab.name;
  const count = tab.count ?? tab.countValue;

  if (!key || !title) return null;

  return {
    ...tab,
    key: String(key),
    label: (
      <Space size={6}>
        <span>{capitalizeFirstLetter(title)}</span>
        {hasCount(count) && (
          <Badge
            className="dynamic-tabs-count"
            count={count}
            overflowCount={Number.MAX_SAFE_INTEGER}
          />
        )}
      </Space>
    ),
  };
}

export default function DynamicTabs({
  tabs = [],
  activeKey,
  onChange,
  className,
}) {
  const items = tabs
    .map(normalizeTab)
    .filter(Boolean);

  if (!items.length) return null;

  const selectedKey = items.some((tab) => tab.key === activeKey)
    ? activeKey
    : items[0].key;

  return (
    <Tabs
      activeKey={selectedKey}
      className={className}
      items={items}
      onChange={onChange}
    />
  );
}
