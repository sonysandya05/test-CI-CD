import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  Empty,
  Flex,
  Input,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import {
  BookFilled,
  DownOutlined,
  FilterOutlined,
  LinkedinFilled,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useFieldConfig } from '../hooks/useDropdownFields';
import { getModuleDataList } from '../services/dropdownApi';
import CustomPagination from './CustomPagination';
import DynamicTabs from './DynamicTabs';
import DynamicFieldFilter from './filters/DynamicFieldFilter';
import eyeOutlinedIcon from './images/common/eyeoutlined.svg';
import frameIcon from './images/common/frame.svg';
import unorderedListOutlinedIcon from './images/common/unorderedlistoutlined.svg';

const { Text } = Typography;

const actionsMenu = {
  items: [
    { key: 'export', label: 'Export selected' },
    { key: 'assign', label: 'Assign' },
    { key: 'delete', label: 'Delete', danger: true },
  ],
};

function getFieldLabel(field) {
  return field.label ?? field.fieldLabel ?? field.name ?? field.fieldName ?? field.value;
}

function getFieldValue(field) {
  return field.value ?? field.field ?? field.fieldName ?? field.name ?? field.label;
}

function getRecordValue(record, fieldKey) {
  const value = record?.[fieldKey];

  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return Object.values(value).join(' ');

  return value;
}

function getComparableValue(record, fieldKey) {
  const value = getRecordValue(record, fieldKey);
  return value === '-' ? '' : String(value);
}

function filterMatches(record, filterRow) {
  const value = getComparableValue(record, filterRow.field).trim();

  if (filterRow.operator === 'isEmpty') return value.length === 0;
  if (filterRow.operator === 'notEmpty') return value.length > 0;
  if (!filterRow.values?.length) return true;

  const normalizedValue = value.toLowerCase();

  return filterRow.values.some((selectedValue) => (
    normalizedValue.includes(String(selectedValue).toLowerCase())
  ));
}

function normalizeComparableText(value) {
  return String(value ?? '').trim().toLowerCase();
}

function getTabKey(tab, index) {
  return tab?.key ?? tab?.value ?? tab?.id ?? (index !== undefined ? String(index) : undefined);
}

function isAllTabKey(tabKey) {
  return ['all', ''].includes(normalizeComparableText(tabKey));
}

function recordMatchesTab(record, activeTab, activeTabConfig, fields, tabField) {
  if (isAllTabKey(activeTab)) return true;

  const tabValue = activeTabConfig?.filterValue
    ?? activeTabConfig?.status
    ?? activeTabConfig?.title
    ?? activeTabConfig?.tabTitle
    ?? activeTabConfig?.name
    ?? (typeof activeTabConfig?.label === 'string' ? activeTabConfig.label : undefined)
    ?? activeTabConfig?.value
    ?? activeTabConfig?.key
    ?? activeTab;
  const normalizedTabValue = normalizeComparableText(tabValue);
  const explicitField = activeTabConfig?.field
    ?? activeTabConfig?.fieldName
    ?? activeTabConfig?.filterField
    ?? activeTabConfig?.dataIndex
    ?? tabField;

  if (explicitField) {
    return normalizeComparableText(getRecordValue(record, explicitField)) === normalizedTabValue;
  }

  const statusFields = fields.filter((field) => {
    const key = normalizeComparableText(field.key);
    const label = normalizeComparableText(field.label);
    return key.includes('status') || label.includes('status');
  });
  const candidateFields = statusFields.length ? statusFields : fields;

  return candidateFields.some((field) => (
    normalizeComparableText(getRecordValue(record, field.key)) === normalizedTabValue
  ));
}

function getRowKey(record, index, rowKey) {
  if (typeof rowKey === 'function') return rowKey(record, index);
  if (typeof rowKey === 'string') return record?.[rowKey];

  return record.id ?? record.key ?? index;
}

function getSortDirection(order) {
  if (order === 'ascend') return 'asc';
  if (order === 'descend') return 'desc';
  return '';
}

function getActiveSorter(sorter) {
  if (Array.isArray(sorter)) {
    return sorter.find((item) => item?.order) ?? {};
  }

  return sorter ?? {};
}

function normalizeListResponse(response) {
  const payload = response?.data ?? response;
  const rows = Array.isArray(payload)
    ? payload
    : payload?.rows
      ?? payload?.records
      ?? payload?.items
      ?? payload?.list
      ?? payload?.data
      ?? [];

  const total = response?.total
    ?? response?.count
    ?? response?.totalCount
    ?? payload?.total
    ?? payload?.count
    ?? payload?.totalCount
    ?? rows.length;
  const tabs = response?.tabs
    ?? response?.tabList
    ?? payload?.tabs
    ?? payload?.tabList
    ?? [];
  const fields = response?.fields
    ?? response?.fieldConfig
    ?? payload?.fields
    ?? payload?.fieldConfig
    ?? [];
  const tabField = response?.tabField
    ?? payload?.tabField
    ?? '';

  return {
    rows: Array.isArray(rows) ? rows : [],
    total: Number(total) || 0,
    tabs: Array.isArray(tabs) ? tabs : [],
    fields: Array.isArray(fields) ? fields : [],
    tabField: typeof tabField === 'string' ? tabField : '',
  };
}

export default function ListView({
  moduleName,
  dataSource = [],
  className = '',
  initialPageSize = 10,
  rowKey,
  tabs,
  tableClassName = 'job-list-table',
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilterRows, setAppliedFilterRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: initialPageSize });
  const [sortConfig, setSortConfig] = useState({ sort: '', sortDir: '' });
  const [visibleColumnKeys, setVisibleColumnKeys] = useState([]);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [moduleRows, setModuleRows] = useState(dataSource);
  const [moduleTotal, setModuleTotal] = useState(dataSource.length);
  const [moduleTabs, setModuleTabs] = useState([]);
  const [moduleFields, setModuleFields] = useState([]);
  const [moduleTabField, setModuleTabField] = useState('');
  const [moduleLoading, setModuleLoading] = useState(false);
  const [moduleError, setModuleError] = useState(null);

  const hasModuleName = typeof moduleName === 'string'
    ? moduleName.trim().length > 0
    : Boolean(moduleName);
  const createRoute = hasModuleName ? `/${String(moduleName).trim()}-create` : '';

  const { config, loading, error } = useFieldConfig(hasModuleName ? moduleName : null);
  const activeTabConfig = useMemo(() => {
    const availableTabs = [
      ...(Array.isArray(tabs) ? tabs : []),
      ...moduleTabs,
    ];

    return availableTabs.find((tab, index) => String(getTabKey(tab, index)) === activeTab);
  }, [activeTab, moduleTabs, tabs]);
  const activeTabField = activeTabConfig?.field
    ?? activeTabConfig?.fieldName
    ?? activeTabConfig?.filterField
    ?? activeTabConfig?.dataIndex
    ?? moduleTabField;
  const activeTabScope = isAllTabKey(activeTab) ? '' : activeTab;
  const canFilterActiveTab = !activeTabScope
    && !isAllTabKey(activeTab)
    && normalizeComparableText(activeTabField).length > 0;
  const hasActiveClientFilter = search.trim().length >= 3
    || appliedFilterRows.some((row) => row.field);

  useEffect(() => {
    if (!hasModuleName) {
      setModuleRows([]);
      setModuleTotal(0);
      setModuleTabs([]);
      setModuleFields([]);
      setModuleTabField('');
      setModuleError(null);
      return undefined;
    }

    let cancelled = false;
    const shouldFetchAllRows = hasActiveClientFilter && moduleTotal > pagination.pageSize;
    const limit = shouldFetchAllRows ? moduleTotal : pagination.pageSize;
    const offset = shouldFetchAllRows ? 0 : (pagination.current - 1) * pagination.pageSize;

    setModuleLoading(true);
    setModuleError(null);

    getModuleDataList(moduleName, limit, offset, {
      scope: activeTabScope,
      sort: sortConfig.sort,
      sortDir: sortConfig.sortDir,
    })
      .then((response) => {
        if (cancelled) return;
        const {
          rows,
          total,
          tabs: responseTabs,
          fields: responseFields,
          tabField,
        } = normalizeListResponse(response);
        setModuleRows(rows);
        setModuleTotal(total);
        setModuleTabs(responseTabs);
        setModuleFields(responseFields);
        setModuleTabField(tabField);
      })
      .catch((err) => {
        if (cancelled) return;
        setModuleRows([]);
        setModuleTotal(0);
        setModuleTabs([]);
        setModuleFields([]);
        setModuleTabField('');
        setModuleError(err.message);
      })
      .finally(() => {
        if (!cancelled) setModuleLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTabScope, hasActiveClientFilter, hasModuleName, moduleName, moduleTotal, pagination.current, pagination.pageSize, sortConfig.sort, sortConfig.sortDir]);

  const normalizedFields = useMemo(() => {
    const usesConfigFields = !error && Array.isArray(config) && config.length;
    const fieldSource = usesConfigFields ? config : moduleFields;

    return fieldSource
      .map((field) => ({
        key: getFieldValue(field),
        label: getFieldLabel(field),
        isVisible: field.isVisible,
      }))
      .filter((field) => field.key && field.label);
  }, [config, error, moduleFields]);

  const tableFields = useMemo(() => (
    normalizedFields
      .filter((field) => {
        if (typeof field.isVisible === 'boolean') return field.isVisible;
        if (typeof field.isVisible === 'string') return field.isVisible.toLowerCase() === 'true';
        return true;
      })
      .map((field) => ({
        key: field.key,
        label: field.label,
      }))
  ), [normalizedFields]);

  const visibleKeys = visibleColumnKeys.length
    ? visibleColumnKeys
    : tableFields.slice(0, 6).map((field) => field.key);
  const minimumVisibleColumns = Math.min(6, tableFields.length);
  const hasHorizontalScroll = visibleKeys.length > 6;
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    const tabbedData = canFilterActiveTab
      ? moduleRows.filter((record) => (
        recordMatchesTab(record, activeTab, activeTabConfig, normalizedFields, activeTabField)
      ))
      : moduleRows;
    const searchedData = !q || q.length < 3
      ? tabbedData
      : tabbedData.filter((record) => (
        normalizedFields.some((field) => (
          String(getRecordValue(record, field.key)).toLowerCase().includes(q)
        ))
      ));

    const validFilterRows = appliedFilterRows.filter((row) => row.field);

    if (!validFilterRows.length) return searchedData;

    return searchedData.filter((record) => (
      validFilterRows.reduce((matches, row, index) => {
        const rowMatches = filterMatches(record, row);

        if (index === 0 || row.operator === 'and') return matches && rowMatches;
        if (row.operator === 'or') return matches || rowMatches;

        return matches && rowMatches;
      }, true)
    ));
  }, [activeTab, activeTabConfig, activeTabField, appliedFilterRows, canFilterActiveTab, moduleRows, normalizedFields, search]);

  const pagedFilteredData = useMemo(() => {
    if (!hasActiveClientFilter) return filteredData;

    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, hasActiveClientFilter, pagination.current, pagination.pageSize]);

  const tableTotal = hasActiveClientFilter ? filteredData.length : moduleTotal;
  const hasSourceRows = moduleTotal > 0 || moduleRows.length > 0;
  const emptyMessage = !hasModuleName
    ? 'Please provide a module name to view data.'
    : (error || moduleError)
      ? 'Invalid module name or data could not be loaded.'
      : 'No data';
  const listTabs = useMemo(() => {
    const providedTabs = Array.isArray(tabs) ? tabs : [];

    if (providedTabs.length) return providedTabs;
    if (moduleTabs.length) return moduleTabs;

    return [{ key: 'all', title: moduleName ?? 'List', count: tableTotal }];
  }, [moduleName, moduleTabs, tableTotal, tabs]);

  useEffect(() => {
    if (!listTabs.length) return;

    const activeTabExists = listTabs.some((tab) => String(tab?.key ?? tab?.value ?? tab?.id) === activeTab);

    if (!activeTabExists) {
      const firstTabKey = listTabs[0]?.key ?? listTabs[0]?.value ?? listTabs[0]?.id;
      if (firstTabKey) setActiveTab(String(firstTabKey));
    }
  }, [activeTab, listTabs]);

  const columns = useMemo(() => {
    const iconColumn = {
        dataIndex: 'icons',
        key: 'icons',
        visibilityKey: 'jobsGroup',
        width: 58,
        render: (_, record) => (
        <Space size={4} className="job-row-icons">
          <Tooltip title="Preview">
            <img src={eyeOutlinedIcon} alt="Preview" className="job-row-eye-icon" />
          </Tooltip>
          <Tooltip title="Bookmarked">
            <BookFilled className="job-row-bookmark-icon" />
          </Tooltip>
          {record.hasLinkedIn && (
            <Tooltip title="LinkedIn">
              <LinkedinFilled className="job-row-linkedin-icon" />
            </Tooltip>
          )}
        </Space>
      ),
    };

    return [
      iconColumn,
      ...normalizedFields
        .filter((field) => visibleKeys.includes(field.key))
        .map((field) => ({
        title: field.label,
        dataIndex: field.key,
        key: field.key,
        sorter: hasSourceRows,
        sortOrder: sortConfig.sort === field.key
          ? (sortConfig.sortDir === 'asc' ? 'ascend' : 'descend')
          : null,
        width: hasHorizontalScroll ? 180 : undefined,
        ellipsis: true,
        render: (_, record) => (
          <Text className="job-cell-primary">{getRecordValue(record, field.key)}</Text>
        ),
      })),
    ];
  }, [hasHorizontalScroll, hasSourceRows, normalizedFields, sortConfig.sort, sortConfig.sortDir, visibleKeys]);

  const handleTableChange = (_, __, sorter) => {
    const activeSorter = getActiveSorter(sorter);
    const sort = activeSorter.field ?? activeSorter.columnKey ?? '';
    const sortDir = getSortDirection(activeSorter.order);

    setSortConfig({
      sort: sortDir ? String(sort) : '',
      sortDir,
    });
    setPagination((current) => ({ ...current, current: 1 }));
  };

  const allColumnsVisible = visibleKeys.length === normalizedFields.length;
  const someColumnsVisible = visibleKeys.length > 0 && !allColumnsVisible;

  const toggleColumn = (key, checked) => {
    setVisibleColumnKeys((current) => {
      const defaultKeys = tableFields.slice(0, 6).map((field) => field.key);
      const currentKeys = current.length ? current : defaultKeys;

      if (checked) return currentKeys.includes(key) ? currentKeys : [...currentKeys, key];
      if (currentKeys.length <= minimumVisibleColumns) return currentKeys;

      return currentKeys.filter((columnKey) => columnKey !== key);
    });
  };

  const columnVisibilityContent = (
    <div className="column-visibility-menu" onClick={(event) => event.stopPropagation()}>
      <Checkbox
        checked={allColumnsVisible}
        indeterminate={someColumnsVisible}
        onChange={(event) => {
          setVisibleColumnKeys(
            event.target.checked
              ? normalizedFields.map((field) => field.key)
              : tableFields.slice(0, 6).map((field) => field.key)
          );
        }}
      >
        Select All
      </Checkbox>
      {normalizedFields.map((field) => (
        <Checkbox
          key={field.key}
          checked={visibleKeys.includes(field.key)}
          disabled={visibleKeys.includes(field.key) && visibleKeys.length <= minimumVisibleColumns}
          onChange={(event) => toggleColumn(field.key, event.target.checked)}
        >
          {field.label}
        </Checkbox>
      ))}
    </div>
  );

  return (
    <div className={`antd dynamic-list-view ${className}`.trim()}>
      <Card>
        <Flex align="center" justify="space-between">
          <DynamicTabs
            activeKey={activeTab}
            tabs={listTabs}
            onChange={(key) => {
              setActiveTab(key);
              setPagination((current) => ({ ...current, current: 1 }));
            }}
          />
          <Flex align="center" gap={8}>
            {hasSourceRows && (
            <>
            <Input
              prefix={<SearchOutlined className="job-search-icon" />}
              placeholder="Min 3 Chars to search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((current) => ({ ...current, current: 1 }));
              }}
              allowClear
              className="job-search-input"
            />
            <Tooltip title="Filter">
              <Button
                className="job-toolbar-icon-button"
                icon={<FilterOutlined />}
                onClick={() => setFiltersOpen(true)}
              />
            </Tooltip>
              </>)}
            <Tooltip title="Add">
              <Button
                aria-label="Add"
                className="job-toolbar-icon-button"
                icon={<PlusOutlined />}
                onClick={() => {
                  if (createRoute) navigate(createRoute);
                }}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Card>
      {hasSourceRows && (
        <>
        <Card>
          <Flex align="center" gap={3}>
            <Dropdown
              open={columnMenuOpen}
              onOpenChange={setColumnMenuOpen}
              trigger={['click']}
              dropdownRender={() => columnVisibilityContent}
              placement="bottomLeft"
              overlayClassName="column-visibility-dropdown"
            >
              <Button
                type="text"
                icon={<img src={unorderedListOutlinedIcon} alt="" className="job-action-list-icon" />}
                size="small"
                className="job-actions-button"
              />
            </Dropdown>
            <Dropdown menu={actionsMenu} trigger={['click']}>
              <Button
                type="text"
                size="small"
                className="job-actions-button job-actions-menu-button"
              >
                <img src={frameIcon} alt="" className="job-actions-frame-icon" />
                Actions <DownOutlined className="job-actions-caret" />
              </Button>
            </Dropdown>
            {selectedRowKeys.length > 0 && (
              <Text className="job-selected-count">
                Selected ({selectedRowKeys.length})
              </Text>
            )}
          </Flex>
        </Card>
      </>)}

      <Spin spinning={loading || moduleLoading}>
        <Table
          rowSelection={hasSourceRows ? {
            type: 'checkbox',
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          } : undefined}
          columns={columns}
          dataSource={pagedFilteredData}
          size="middle"
          showSorterTooltip={false}
          tableLayout="fixed"
          scroll={hasHorizontalScroll ? { x: 'max-content' } : undefined}
          pagination={false}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={emptyMessage}
              />
            ),
          }}
          className={tableClassName}
          rowKey={(record, index) => getRowKey(record, index, rowKey)}
        />
      </Spin>

      {hasSourceRows? <CustomPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={tableTotal}
        onChange={(page) => setPagination((current) => ({ ...current, current: page }))}
        onPageSizeChange={(size) => setPagination({ current: 1, pageSize: size })}
      /> : undefined}

      <DynamicFieldFilter
        moduleName={moduleName}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={({ filters }) => {
          setAppliedFilterRows(filters);
          setPagination((current) => ({ ...current, current: 1 }));
        }}
      />
    </div>
  );
}
