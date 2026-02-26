/**
 * 房型编辑弹窗组件
 * 支持新增和编辑房型
 */
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { RoomType, RoomFormData, BreakfastType } from '@/types';
import ImageUpload from '@/components/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

interface RoomModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: RoomType;
  onCancel: () => void;
  onSubmit: (values: RoomFormData) => Promise<void>;
}

const RoomModal: React.FC<RoomModalProps> = ({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<RoomFormData>();

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, mode, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      open={open}
      title={mode === 'add' ? '新增房型' : '编辑房型'}
      okText="保存"
      cancelText="取消"
      onCancel={onCancel}
      onOk={handleSubmit}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          maxGuests: 2,
          totalRooms: 10,
          breakfast: 'none' as BreakfastType,
        }}
      >
        <Form.Item
          label="房型名称"
          name="name"
          rules={[
            { required: true, message: '请输入房型名称' },
            { max: 50, message: '房型名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="例如：豪华大床房" />
        </Form.Item>

        <Form.Item
          label="房型图片"
          name="images"
          rules={[{ required: true, message: '请至少上传1张房型图片' }]}
        >
          <ImageUpload maxCount={5} />
        </Form.Item>

        <Form.Item
          label="床型"
          name="bedType"
          rules={[{ required: true, message: '请输入床型' }]}
        >
          <Input placeholder="例如：1.8m大床、两张1.2m单床" />
        </Form.Item>

        <Form.Item
          label="可住人数"
          name="maxGuests"
          rules={[
            { required: true, message: '请输入可住人数' },
            { type: 'number', min: 1, max: 10, message: '人数范围为1-10人' },
          ]}
        >
          <InputNumber
            min={1}
            max={10}
            style={{ width: '100%' }}
            placeholder="请输入可住人数"
          />
        </Form.Item>

        <Form.Item
          label="房间面积（㎡）"
          name="area"
          rules={[
            { type: 'number', min: 10, max: 500, message: '面积范围为10-500㎡' },
          ]}
        >
          <InputNumber
            min={10}
            max={500}
            style={{ width: '100%' }}
            placeholder="请输入房间面积（选填）"
          />
        </Form.Item>

        <Form.Item
          label="现价（元/晚）"
          name="price"
          rules={[
            { required: true, message: '请输入房间价格' },
            { type: 'number', min: 1, message: '价格必须大于0' },
          ]}
        >
          <InputNumber
            min={1}
            precision={0}
            style={{ width: '100%' }}
            placeholder="请输入房间价格"
            prefix="¥"
          />
        </Form.Item>

        <Form.Item
          label="原价（元/晚）"
          name="originalPrice"
          rules={[
            { type: 'number', min: 1, message: '原价必须大于0' },
          ]}
        >
          <InputNumber
            min={1}
            precision={0}
            style={{ width: '100%' }}
            placeholder="请输入原价（选填，用于显示折扣）"
            prefix="¥"
          />
        </Form.Item>

        <Form.Item
          label="早餐类型"
          name="breakfast"
          rules={[{ required: true, message: '请选择早餐类型' }]}
        >
          <Select placeholder="请选择早餐类型">
            <Option value="none">不含早餐</Option>
            <Option value="single">单人早餐</Option>
            <Option value="double">双人早餐</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="房间总数"
          name="totalRooms"
          rules={[
            { required: true, message: '请输入房间总数' },
            { type: 'number', min: 1, max: 1000, message: '房间总数范围为1-1000' },
          ]}
        >
          <InputNumber
            min={1}
            max={1000}
            style={{ width: '100%' }}
            placeholder="请输入该房型的房间总数"
          />
        </Form.Item>

        <Form.Item
          label="优惠类型"
          name="discountType"
        >
          <Select placeholder="请选择优惠类型（选填）" allowClear>
            <Option value="percentage">折扣</Option>
            <Option value="fixed">立减</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="优惠值"
          name="discountValue"
          tooltip="折扣：输入折扣数（例如8表示8折）；立减：输入减免金额"
        >
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            placeholder="请输入优惠值（选填）"
          />
        </Form.Item>

        <Form.Item
          label="优惠说明"
          name="discountDesc"
        >
          <TextArea
            rows={2}
            maxLength={100}
            showCount
            placeholder="例如：新春特惠8折（选填）"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomModal;
