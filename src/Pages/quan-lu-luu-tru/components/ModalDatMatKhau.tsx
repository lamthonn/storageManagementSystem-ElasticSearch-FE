import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Space, message, Progress } from "antd";
import { SetPasswordForDoc } from "../../../services/tai-lieu";
import ShowToast from "../../../Components/show-toast/ShowToast";

/**
 * Modal đặt mật khẩu – sử dụng Ant Design
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - recordId: string | number
 *  - onSaved: (result) => void
 *  - isBatBuoc?: boolean  // nếu true thì bắt buộc nhập mật khẩu và không được đóng modal
 */

const generateRandomPassword = (length = 12) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let pw = "";
  for (let i = 0; i < length; i++) {
    pw += charset[Math.floor(Math.random() * Math.random() * charset.length)];
  }
  return pw;
};

const passwordStrengthScore = (pw: any) => {
  let s = 0;
  if (!pw) return 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (/[a-z]/.test(pw)) s += 1;
  if (/[A-Z]/.test(pw)) s += 1;
  if (/[0-9]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  return s; // 0..6
};

const SetPasswordModal: React.FC<{
  open: boolean;
  onClose: () => void;
  record: any;
  onSaved?: (result: any) => void;
  isBatBuoc?: boolean;
  isRefreshData?: boolean;
  setIsRefreshData?: (val: boolean) => void;
  setIsBatBuoc?: (val: boolean) => void;
  setIsOpenModalImport?: (val: boolean) => void;
}> = ({ open, onClose, record, onSaved, isBatBuoc = false, setIsBatBuoc, setIsOpenModalImport, setIsRefreshData }) => {
  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const password = Form.useWatch("password", form);
  const score = passwordStrengthScore(password);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.password !== values.confirm) {
        message.error("Mật khẩu xác nhận không khớp.");
        return;
      }
      setLoading(true);

      var taiLieuId = record[0]?.id;
      var password = values.password;

      if(taiLieuId && password){
        // Gọi API lưu mật khẩu
        await SetPasswordForDoc(taiLieuId, password)
        .then((res:any)=> {
          message.success("Đã lưu mật khẩu cho bản ghi.");
          setIsBatBuoc?.(false);
          onSaved?.({ record, password: values.password });
          onClose();
        })
        .catch(()=> {
          ShowToast("error", "Lỗi", "Đặt mật khẩu không thành công", 3)
        })
      }
      
    } catch (_) {
      // validation failed
        ShowToast("error", "Lỗi", "Đặt mật khẩu không thành công", 3)
    } finally {
      setLoading(false);
      setIsOpenModalImport?.(false);
      setIsRefreshData?.(true);
    }
  };

  const handleGenerate = () => {
    const pw = generateRandomPassword(12);
    form.setFieldsValue({ password: pw, confirm: pw });
  };

  // khi modal mở và bắt buộc, clear form nếu cần
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  // custom footer: khi isBatBuoc true thì chỉ hiện nút Lưu (không có Hủy)
  const footer = isBatBuoc
    ? [
        <Button key="ok" type="primary" loading={loading} onClick={handleSubmit}>
          Lưu mật khẩu
        </Button>,
      ]
    : undefined; // undefined => Antd mặc định footer (Ok + Cancel)

  return (
    <Modal
      title={`Đặt mật khẩu cho tài liệu #${record?.ten ?? ""}`}
      open={open}
      onCancel={() => {
        if (loading) return;
        if (!isBatBuoc) onClose();
        // nếu isBatBuoc === true => không đóng modal khi nhấn X hoặc click nền
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Lưu mật khẩu"
      cancelText="Hủy"
      centered
      closable={!isBatBuoc}
      maskClosable={!isBatBuoc}
      keyboard={!isBatBuoc}
      footer={footer}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 8, message: "Tối thiểu 8 ký tự" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            visibilityToggle={{ visible: show, onVisibleChange: setShow }}
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Nhập lại mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp."));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            visibilityToggle={{ visible: show, onVisibleChange: setShow }}
          />
        </Form.Item>

        <Space style={{ marginBottom: 10 }}>
          <Button type="link" onClick={handleGenerate}>
            Tạo mật khẩu ngẫu nhiên
          </Button>
        </Space>

        <div style={{ marginBottom: 6 }}>Độ mạnh mật khẩu:</div>
        <Progress
          percent={(score / 6) * 100}
          showInfo={false}
          status={score <= 2 ? "exception" : score <= 4 ? "active" : "success"}
        />
      </Form>
    </Modal>
  );
};

export default SetPasswordModal;
