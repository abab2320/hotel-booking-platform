/**
 * 房型表格列配置
 */
import { ColumnsType } from 'antd/es/table';
import { Image, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { RoomType, BreakfastType } from '@/types';

/** 早餐类型配置 */
const BREAKFAST_CONFIG: Record<BreakfastType, { label: string; color: string }> = {
  none: { label: '不含早餐', color: 'default' },
  single: { label: '单人早餐', color: 'blue' },
  double: { label: '双人早餐', color: 'green' },
};

interface ColumnParams {
  onEdit?: (record: RoomType) => void;
  onDelete?: (record: RoomType) => void;
  readonly?: boolean;
}

/**
 * 获取房型表格列配置
 */
export const getRoomColumns = (params?: ColumnParams): ColumnsType<RoomType> => {
  const { onEdit, onDelete, readonly = false } = params || {};

  const columns: ColumnsType<RoomType> = [
    {
      title: '房型名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '房型图片',
      dataIndex: 'images',
      key: 'images',
      width: 120,
      render: (images: string[]) => {
        if (!images || images.length === 0) return '-';
        return (
          <Image
            src={images[0]}
            alt="房型图片"
            width={80}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={{
              src: images[0],
            }}
          />
        );
      },
    },
    {
      title: '床型',
      dataIndex: 'bedType',
      key: 'bedType',
      width: 120,
    },
    {
      title: '可住人数',
      dataIndex: 'maxGuests',
      key: 'maxGuests',
      width: 100,
      render: (num: number) => `${num}人`,
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      width: 100,
      render: (area?: number) => (area ? `${area}㎡` : '-'),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number, record) => (
        <div>
          <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
            ¥{price}
          </div>
          {record.originalPrice && record.originalPrice > price && (
            <div style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>
              ¥{record.originalPrice}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '早餐',
      dataIndex: 'breakfast',
      key: 'breakfast',
      width: 100,
      render: (breakfast: BreakfastType) => {
        const config = BREAKFAST_CONFIG[breakfast];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '房间数',
      dataIndex: 'totalRooms',
      key: 'totalRooms',
      width: 100,
      render: (num: number) => `${num}间`,
    },
    {
      title: '优惠信息',
      dataIndex: 'discountDesc',
      key: 'discountDesc',
      width: 150,
      render: (desc?: string, record?) => {
        if (!desc && !record?.discountType) return '-';
        return (
          <div>
            {desc && <div>{desc}</div>}
            {record?.discountType && record?.discountValue && (
              <Tag color="red">
                {record.discountType === 'percentage'
                  ? `${record.discountValue}折`
                  : `-¥${record.discountValue}`}
              </Tag>
            )}
          </div>
        );
      },
    },
  ];

  // 如果不是只读模式，添加操作列
  if (!readonly && (onEdit || onDelete)) {
    columns.push({
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {onEdit && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title="确认删除"
              description="确定要删除这个房型吗？"
              onConfirm={() => onDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    });
  }

  return columns;
};
