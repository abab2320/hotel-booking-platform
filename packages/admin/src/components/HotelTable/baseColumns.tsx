/**
 * 基础列配置
 * 包含酒店基本信息的展示列
 */
import { Button, Tag, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Hotel, HotelStatus } from '@/types';
import { HOTEL_STATUS_CONFIG } from '@/types/constants';
import type { ColumnCallbacks } from './types';

/** 星级转换为字符串 */
const getStarText = (star: number) => `${star}星级`;

/**
 * 创建基础列配置
 * 包含酒店基本信息的展示列
 */
export const createBaseHotelColumns = (
  callbacks?: ColumnCallbacks
): ColumnsType<Hotel> => [
  {
    title: '酒店图片',
    dataIndex: 'images',
    key: 'images',
    width: 120,
    render: (images: string[]) => (
      <Image
        src={images?.[0] || 'https://via.placeholder.com/80'}
        alt="酒店图片"
        width={80}
        height={60}
        style={{ objectFit: 'cover', borderRadius: 4 }}
        preview={{
          mask: '预览',
          src: images?.[0],
        }}
      />
    ),
  },
  {
    title: '酒店名称(中文)',
    dataIndex: 'nameZh',
    key: 'nameZh',
    width: 180,
    render: (text: string, record: Hotel) => (
      <div>
        <div style={{ fontWeight: 500 }}>{text}</div>
        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
          ID: {record.id}
        </div>
      </div>
    ),
  },
  {
    title: '酒店名称(英文)',
    dataIndex: 'nameEn',
    key: 'nameEn',
    width: 180,
  },
  {
    title: '酒店地址',
    dataIndex: 'address',
    key: 'address',
    width: 200,
    ellipsis: true,
  },
  {
    title: '城市',
    dataIndex: 'city',
    key: 'city',
    width: 100,
  },
  {
    title: '星级',
    dataIndex: 'star',
    key: 'star',
    width: 100,
    render: (star: number) => (
      <span>
        {'⭐'.repeat(star)} {getStarText(star)}
      </span>
    ),
  },
  {
    title: '所属商户',
    dataIndex: 'merchant',
    key: 'merchant',
    width: 120,
    render: (merchant: { id: number; username: string } | undefined, record: Hotel) => (
      <div>
        <div>{merchant?.username || '未知商户'}</div>
        <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>ID: {record.merchantId}</div>
      </div>
    ),
  },
  {
    title: '开业时间',
    dataIndex: 'openDate',
    key: 'openDate',
    width: 120,
    render: (date: string) => date?.split('T')[0] || '-',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (status: HotelStatus, record: Hotel) => (
      <div>
        <Tag color={HOTEL_STATUS_CONFIG[status].color}>
          {HOTEL_STATUS_CONFIG[status].text}
        </Tag>
        {status === 'rejected' && record.rejectReason && callbacks?.onViewRejectReason && (
          <Button
            type="link"
            size="small"
            onClick={() => callbacks.onViewRejectReason?.(record.rejectReason)}
            style={{ padding: 0, height: 'auto' }}
          >
            查看原因
          </Button>
        )}
      </div>
    ),
  },
];
