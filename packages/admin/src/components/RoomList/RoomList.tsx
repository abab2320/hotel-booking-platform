/**
 * 房型列表展示组件（管理员端）
 * 功能：
 * - 展示房型列表（只读）
 * - 按价格从低到高排序
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, message, Empty } from 'antd';
import { RoomType } from '@/types';
import { getRoomTypes, getAdminRoomTypes } from '@/services/room';
import { getRoomColumns } from '@/components/RoomEditor/columns';
import './RoomList.css';

interface RoomListProps {
  hotelId: number;
  /** 外部房型数据（用于传入已有数据） */
  rooms?: RoomType[];
  /** 是否从接口加载数据 */
  loadFromApi?: boolean;
  /** 是否使用管理员接口 */
  useAdminApi?: boolean;
}

const RoomList: React.FC<RoomListProps> = ({
  hotelId,
  rooms: externalRooms,
  loadFromApi = false,
  useAdminApi = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    if (loadFromApi) {
      loadRooms();
    } else if (externalRooms) {
      // 按价格从低到高排序
      const sortedRooms = [...externalRooms].sort((a, b) => a.price - b.price);
      setRooms(sortedRooms);
    }
  }, [hotelId, externalRooms, loadFromApi, useAdminApi]);

  /** 加载房型列表 */
  const loadRooms = async () => {
    try {
      setLoading(true);
      // 根据角色选择不同的接口
      const data = useAdminApi 
        ? await getAdminRoomTypes(hotelId) 
        : await getRoomTypes(hotelId);
      // 按价格从低到高排序
      const sortedRooms = [...data].sort((a, b) => a.price - b.price);
      setRooms(sortedRooms);
    } catch (error: any) {
      console.error('Load rooms error:', error);
      message.error(error?.message || '加载房型列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = getRoomColumns({ readonly: true });

  if (!loading && rooms.length === 0) {
    return (
      <Card title="房型信息" className="room-list-card">
        <Empty description="该酒店暂无房型数据" />
      </Card>
    );
  }

  return (
    <Card title="房型信息" className="room-list-card">
      <div className="room-list-tip">
        房型按价格从低到高排序
      </div>
      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default RoomList;
