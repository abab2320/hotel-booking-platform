/**
 * 酒店编辑/新增页面
 * 支持新增酒店和编辑现有酒店
 * 使用分步表单优化用户体验
 */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Space,
  message,
  Spin,
  Checkbox,
  Steps,
} from 'antd';
import { SaveOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useHotelDetail } from '@/hooks';
import type { HotelFormData } from '@/types';
import {
  HOTEL_STAR_OPTIONS,
  HOTEL_FACILITY_CONFIG,
  HOTEL_TAG_CONFIG,
  ROUTES,
} from '@/types/constants';
import {
  createHotel,
  updateHotel,
} from '@/services/hotel';
import ImageUpload from '@/components/ImageUpload';
import './HotelEdit.css';

const { TextArea } = Input;
const { Option } = Select;

// 步骤定义
const steps = [
  { title: '基本信息', description: '酒店基础资料' },
  { title: '酒店图片', description: '上传酒店图片' },
  { title: '设施与标签', description: '选择设施和标签' },
  { title: '详细信息', description: '周边与介绍' },
];

const HotelEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = !!id;

  // 使用自定义Hook加载酒店详情（编辑模式）
  const { loading } = useHotelDetail({
    id,
    autoLoad: isEditMode,
    onSuccess: (hotel) => {
      // 加载成功后填充表单
      form.setFieldsValue({
        ...hotel,
        openDate: dayjs(hotel.openDate),
      });
    },
  });

  /** 提交表单 */
  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      
      console.log('提交的表单数据:', values);

      // 验证必填字段
      if (!values.nameZh || !values.nameEn || !values.address || !values.city || !values.star || !values.openDate) {
        message.error('请填写所有必填信息');
        setSubmitting(false);
        // 跳转到第一步
        setCurrentStep(0);
        return;
      }

      if (!values.images || values.images.length === 0) {
        message.error('请上传至少一张酒店图片');
        setSubmitting(false);
        // 跳转到第二步
        setCurrentStep(1);
        return;
      }

      // 转换日期格式
      const formData: HotelFormData = {
        ...values,
        openDate: values.openDate.format ? values.openDate.format('YYYY-MM-DD') : values.openDate,
      };

      if (isEditMode) {
        // 更新酒店
        await updateHotel(Number(id), formData);
        message.success('酒店信息更新成功');
      } else {
        // 创建酒店
        await createHotel(formData);
        message.success('酒店创建成功');
      }

      // 返回列表页
      navigate(ROUTES.MERCHANT.HOTELS);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || '操作失败';
      message.error(errorMsg);
      console.error('Submit hotel error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  /** 返回列表 */
  const handleCancel = () => {
    navigate(ROUTES.MERCHANT.HOTELS);
  };

  /** 验证当前步骤的字段 */
  const validateCurrentStep = async () => {
    const stepFields: Record<number, string[]> = {
      0: ['nameZh', 'nameEn', 'address', 'city', 'star', 'openDate'],
      1: ['images'],
      2: [], // 设施和标签为可选
      3: [], // 周边信息和描述为可选
    };

    const fieldsToValidate = stepFields[currentStep];
    if (fieldsToValidate.length === 0) return true;

    try {
      await form.validateFields(fieldsToValidate);
      return true;
    } catch (error) {
      return false;
    }
  };

  /** 下一步 */
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  /** 上一步 */
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  /** 渲染第一步：基本信息 */
  const renderBasicInfo = () => (
    <div className="form-section" style={{ display: currentStep === 0 ? 'block' : 'none' }}>
      <h3 className="section-title">基本信息</h3>
      
      <Form.Item
        label="酒店中文名称"
        name="nameZh"
        rules={[
          { required: true, message: '请输入酒店中文名称' },
          { max: 100, message: '名称不能超过100个字符' },
        ]}
      >
        <Input placeholder="请输入酒店中文名称" size="large" />
      </Form.Item>

      <Form.Item
        label="酒店英文名称"
        name="nameEn"
        rules={[
          { required: true, message: '请输入酒店英文名称' },
          { max: 100, message: '名称不能超过100个字符' },
        ]}
      >
        <Input placeholder="请输入酒店英文名称" size="large" />
      </Form.Item>

      <Form.Item
        label="酒店地址"
        name="address"
        rules={[
          { required: true, message: '请输入酒店地址' },
          { max: 200, message: '地址不能超过200个字符' },
        ]}
      >
        <Input placeholder="请输入详细地址" size="large" />
      </Form.Item>

      <Form.Item
        label="所在城市"
        name="city"
        rules={[
          { required: true, message: '请输入所在城市' },
          { max: 50, message: '城市名称不能超过50个字符' },
        ]}
      >
        <Input placeholder="例如：上海" size="large" />
      </Form.Item>

      <Form.Item
        label="酒店星级"
        name="star"
        rules={[{ required: true, message: '请选择酒店星级' }]}
      >
        <Select placeholder="请选择星级" size="large">
          {HOTEL_STAR_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="开业日期"
        name="openDate"
        rules={[{ required: true, message: '请选择开业日期' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          placeholder="请选择开业日期"
          size="large"
          format="YYYY-MM-DD"
        />
      </Form.Item>
    </div>
  );

  /** 渲染第二步：酒店图片 */
  const renderImages = () => (
    <div className="form-section" style={{ display: currentStep === 1 ? 'block' : 'none' }}>
      <h3 className="section-title">酒店图片</h3>
      
      <Form.Item
        label="上传酒店图片（最多8张）"
        name="images"
        rules={[
          { required: true, message: '请至少上传一张酒店图片' },
          {
            validator: (_, value) => {
              if (!value || value.length === 0) {
                return Promise.reject('请至少上传一张酒店图片');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <ImageUpload maxCount={8} />
      </Form.Item>
      
      <div className="step-hint">
        <p>💡 提示：请上传清晰的酒店外观、大堂、客房等照片，有助于提高预订率</p>
      </div>
    </div>
  );

  /** 渲染第三步：设施与标签 */
  const renderFacilitiesAndTags = () => (
    <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
      <div className="form-section">
        <h3 className="section-title">酒店设施</h3>
        
        <Form.Item name="facilities">
          <Checkbox.Group>
            <div className="facility-grid">
              {Object.entries(HOTEL_FACILITY_CONFIG).map(([key, config]) => (
                <Checkbox key={key} value={key}>
                  <span className="facility-item">
                    <span className="facility-icon">{config.icon}</span>
                    <span>{config.label}</span>
                  </span>
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>
      </div>

      <div className="form-section">
        <h3 className="section-title">酒店标签</h3>
        
        <Form.Item name="tags">
          <Checkbox.Group>
            <div className="tag-grid">
              {Object.entries(HOTEL_TAG_CONFIG).map(([key, config]) => (
                <Checkbox key={key} value={key}>
                  {config.label}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>
      </div>
    </div>
  );

  /** 渲染第四步：详细信息 */
  const renderDetailInfo = () => (
    <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
      <div className="form-section">
        <h3 className="section-title">周边信息</h3>
        
        <Form.Item
          label="周边景点"
          name="nearbyAttractions"
          rules={[{ max: 500, message: '不能超过500个字符' }]}
        >
          <TextArea
            rows={3}
            placeholder="请描述酒店周边的景点和娱乐设施"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="交通信息"
          name="nearbyTransport"
          rules={[{ max: 500, message: '不能超过500个字符' }]}
        >
          <TextArea
            rows={3}
            placeholder="请描述酒店周边的交通情况（地铁、公交、机场等）"
            maxLength={500}
            showCount
          />
        </Form.Item>
      </div>

      <div className="form-section">
        <h3 className="section-title">酒店介绍</h3>
        
        <Form.Item
          label="详细描述"
          name="description"
          rules={[{ max: 1000, message: '不能超过1000个字符' }]}
        >
          <TextArea
            rows={6}
            placeholder="请详细介绍酒店的特色、服务和优势"
            maxLength={1000}
            showCount
          />
        </Form.Item>
      </div>
    </div>
  );

  /** 根据当前步骤渲染内容 */
  const renderStepContent = () => {
    // 同时渲染所有步骤，用 CSS 控制显示隐藏，确保表单数据不丢失
    return (
      <>
        {renderBasicInfo()}
        {renderImages()}
        {renderFacilitiesAndTags()}
        {renderDetailInfo()}
      </>
    );
  };

  return (
    <div className="hotel-edit-container">
      <Card>
        <div className="hotel-edit-header">
          <h2 className="page-title">
            {isEditMode ? '编辑酒店信息' : '新增酒店'}
          </h2>
        </div>

        {/* 步骤指示器 */}
        <Steps current={currentStep} items={steps} className="steps-container" />

        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="hotel-edit-form"
            initialValues={{
              star: 4,
              facilities: [],
              tags: [],
              images: [],
            }}
          >
            {/* 当前步骤内容 */}
            <div className="step-content">
              {renderStepContent()}
            </div>

            {/* 步骤操作按钮 */}
            <div className="step-actions">
              <Space size="large">
                {currentStep > 0 && (
                  <Button
                    icon={<LeftOutlined />}
                    size="large"
                    onClick={handlePrev}
                    disabled={submitting}
                  >
                    上一步
                  </Button>
                )}
                
                <Button
                  onClick={handleCancel}
                  size="large"
                  disabled={submitting}
                >
                  取消
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    icon={<RightOutlined />}
                    size="large"
                    onClick={handleNext}
                  >
                    下一步
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    size="large"
                    loading={submitting}
                  >
                    {isEditMode ? '保存修改' : '创建酒店'}
                  </Button>
                )}
              </Space>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default HotelEdit;
