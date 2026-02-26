/**
 * 房型管理组件（商户端）
 * 功能：
 * - 展示房型列表
 * - 新增房型
 * - 编辑房型
 * - 删除房型
 */
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RoomType, RoomFormData } from '@/types';
import { getRoomTypes, createRoom, updateRoom, deleteRoom } from '@/services/room';
import RoomModal from './RoomModal';
import { getRoomColumns } from './columns';
import './RoomEditor.css';

interface RoomEditorProps {
  hotelId: number;
  /** 是否只读模式 */
  readonly?: boolean;
  /** 外部房型数据（用于本地管理，不调用接口） */
  rooms?: RoomType[];
  /** 房型变更回调（用于本地管理） */
  onChange?: (rooms: RoomType[]) => void;
}

const RoomEditor: React.FC<RoomEditorProps> = ({
  hotelId,
  readonly = false,
  rooms: externalRooms,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingRoom, setEditingRoom] = useState<RoomType | undefined>();

  // 是否使用外部数据（本地管理模式）
  const isLocalMode = !!onChange;

  useEffect(() => {
    if (isLocalMode && externalRooms) {
      // 本地管理模式：使用外部传入的数据
      setRooms(externalRooms);
    } else if (!isLocalMode) {
      // 接口模式：从后端加载数据
      loadRooms();
    }
  }, [hotelId, isLocalMode, externalRooms]);

  /** 加载房型列表 */
  const loadRooms = async () => {
    if (isLocalMode) return;

    try {
      setLoading(true);
      const data = await getRoomTypes(hotelId);
      setRooms(data);
    } catch (error: any) {
      console.error('Load rooms error:', error);
      message.error(error?.message || '加载房型列表失败');
    } finally {
      setLoading(false);
    }
  };

  /** 打开新增弹窗 */
  const handleAdd = () => {
    setModalMode('add');
    setEditingRoom(undefined);
    setModalOpen(true);
  };

  /** 打开编辑弹窗 */
  const handleEdit = (room: RoomType) => {
    setModalMode('edit');
    setEditingRoom(room);
    setModalOpen(true);
  };

  /** 删除房型 */
  const handleDelete = async (room: RoomType) => {
    if (isLocalMode) {
      // 本地模式：直接从列表删除
      const newRooms = rooms.filter((r) => r.id !== room.id);
      setRooms(newRooms);
      onChange?.(newRooms);
      message.success('删除成功');
      return;
    }

    // 接口模式：调用删除接口
    try {
      await deleteRoom(hotelId, room.id);
      message.success('删除成功');
      loadRooms();
    } catch (error: any) {
      console.error('Delete room error:', error);
      message.error(error?.message || '删除失败');
    }
  };

  /** 提交房型表单 */
  const handleSubmit = async (values: RoomFormData) => {
    if (isLocalMode) {
      // 本地模式：直接更新列表
      if (modalMode === 'add') {
        const newRoom: RoomType = {
          ...values,
          images: values.images || [],
          id: Date.now(), // 临时ID
          hotelId,
          availableRooms: values.totalRooms,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const newRooms = [...rooms, newRoom];
        setRooms(newRooms);
        onChange?.(newRooms);
        message.success('添加成功');
      } else if (editingRoom) {
        const newRooms = rooms.map((r) =>
          r.id === editingRoom.id
            ? { ...r, ...values, updatedAt: new Date().toISOString() }
            : r
        );
        setRooms(newRooms);
        onChange?.(newRooms);
        message.success('更新成功');
      }
      setModalOpen(false);
      return;
    }

    // 接口模式：调用接口
    try {
      if (modalMode === 'add') {
        await createRoom(hotelId, values);
        message.success('添加成功');
      } else if (editingRoom) {
        await updateRoom(hotelId, editingRoom.id, values);
        message.success('更新成功');
      }
      setModalOpen(false);
      loadRooms();
    } catch (error: any) {
      console.error('Submit room error:', error);
      message.error(error?.message || '操作失败');
    }
  };

  const columns = getRoomColumns({
    onEdit: readonly ? undefined : handleEdit,
    onDelete: readonly ? undefined : handleDelete,
    readonly,
  });

  return (
    <Card
      title="房型管理"
      className="room-editor-card"
      extra={
        !readonly && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增房型
          </Button>
        )
      }
    >
      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1200 }}
        locale={{ emptyText: '暂无房型数据' }}
      />

      {!readonly && (
        <RoomModal
          open={modalOpen}
          mode={modalMode}
          initialValues={editingRoom}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </Card>
  );
};

export default RoomEditor;
