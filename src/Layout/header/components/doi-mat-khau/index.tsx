import { Modal, Form, Input, Button, message } from "antd";
import { jwtDecode, JwtPayload } from "jwt-decode";
import React from "react";
import { changePassword } from "../../../../services/authen";
import ShowToast from "../../../../Components/show-toast/ShowToast";

type DoiMatKhauModalProps = {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
};

type DoiMatKhauForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

interface AuthInterface extends JwtPayload {
  id:string,
}

const DoiMatKhauModal: React.FC<DoiMatKhauModalProps> = ({
  isOpenModal,
  setIsOpenModal,
}) => {
  const [form] = Form.useForm<DoiMatKhauForm>();

  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };

  const handleSubmit = async (values: DoiMatKhauForm) => {
    const token = localStorage.getItem("auth");
    if (token) {
      const decodeToken:AuthInterface = jwtDecode(token);
      var body = {
        nguoi_dung_id: decodeToken.id,
        old_password: values.oldPassword,
        new_password: values.newPassword,
      };
      changePassword(body)
      .then((res:any) => {
        ShowToast("success", "Thông báo", "Đổi mật khẩu thành công", 3);
        handleCancel();
      })
      .catch((err:any) => {
        ShowToast("error", "Thông báo", "Đổi mật khẩu thất bại", 3);
      });
      handleCancel();
    }

  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={isOpenModal}
      onCancel={handleCancel}
      width={700}
      centered
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu cũ" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value !== getFieldValue("oldPassword")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu mới không được trùng mật khẩu cũ")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>

        <Form.Item >
          <Button onClick={handleCancel} style={{ marginRight: 8, marginBottom: 5 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DoiMatKhauModal;
