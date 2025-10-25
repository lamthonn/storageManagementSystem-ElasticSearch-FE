import { Col, Modal, Row, Typography, Spin, Divider, Card } from "antd";
import React, { useEffect, useState } from "react";
import { getNguoiDungById } from "../../../../services/nguoi-dung";
import { jwtDecode, JwtPayload } from "jwt-decode";
import ShowToast from "../../../../Components/show-toast/ShowToast";
import { UserOutlined, MailOutlined, PhoneOutlined, ManOutlined, WomanOutlined, CalendarOutlined } from "@ant-design/icons";
import { formatDateTimeCustom } from "../../../../Utils/common";

const { Title, Text } = Typography;

type ModalThongTinNguoiDungProps = {
  isOpenModal: boolean;
  title: string;
  onClose?: () => void;
};

interface AuthInterface extends JwtPayload {
  id: string;
  tai_khoan: string;
}

const ModalThongTinNguoiDung: React.FC<ModalThongTinNguoiDungProps> = ({
  isOpenModal,
  title,
  onClose,
}) => {
  const [userInfor, setUserInfor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpenModal) return;
    setLoading(true);
    const token = localStorage.getItem("auth");
    if (token) {
      const decodeToken: AuthInterface = jwtDecode(token);
      getNguoiDungById(decodeToken.id)
        .then((res: any) => {
          setUserInfor(res.data);
        })
        .catch(() => {
          ShowToast("error", "Lỗi", "Không thể tải thông tin người dùng", 3);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpenModal]);

  return (
    <Modal
      open={isOpenModal}
      title={<Title level={4} style={{ margin: 0 }}>{title}</Title>}
      centered
      width={720}
      onCancel={onClose}
      footer={null}
    >
      <Spin spinning={loading}>
        {userInfor && (
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              border: "none",
            }}
            bodyStyle={{ padding: "30px 40px" }}
          >
            <Row gutter={32} align="middle">
              {/* Cột bên trái - Avatar và thông tin chính */}
              <Col
                span={8}
                style={{
                  textAlign: "center",
                  borderRight: "1px solid #f0f0f0",
                  paddingRight: 24,
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    borderRadius: "50%",
                    backgroundColor: "#f0f2f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 50,
                    color: "#1890ff",
                  }}
                >
                  <UserOutlined />
                </div>
                <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                  {userInfor.ten || "Không có tên"}
                </Title>
                <Text type="secondary">
                  {userInfor.ten_nhom_nguoi_dung || "Chưa có nhóm"}
                </Text>
              </Col>

              {/* Cột bên phải - Thông tin chi tiết */}
              <Col span={16}>
                <Divider orientation="left" plain>
                  Thông tin cá nhân
                </Divider>

                <Row gutter={[0, 12]}>
                  <Col span={24}>
                    <Text strong>
                      <CalendarOutlined /> Ngày sinh:
                    </Text>{" "}
                    <Text>
                      {userInfor.ngay_sinh
                        ? formatDateTimeCustom(userInfor.ngay_sinh, "DD/MM/YYYY")
                        : "Không có dữ liệu"}
                    </Text>
                  </Col>

                  <Col span={24}>
                    <Text strong>
                      {userInfor.gioi_tinh ? <ManOutlined /> : <WomanOutlined />} Giới tính:
                    </Text>{" "}
                    <Text>
                      {userInfor.gioi_tinh === null
                        ? "Không có dữ liệu"
                        : userInfor.gioi_tinh
                        ? "Nam"
                        : "Nữ"}
                    </Text>
                  </Col>

                  <Col span={24}>
                    <Text strong>
                      <MailOutlined /> Email:
                    </Text>{" "}
                    <Text>
                      {userInfor.email || "Không có dữ liệu"}
                    </Text>
                  </Col>

                  <Col span={24}>
                    <Text strong>
                      <PhoneOutlined /> Số điện thoại:
                    </Text>{" "}
                    <Text>
                      {userInfor.so_dien_thoai || "Không có dữ liệu"}
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        )}
      </Spin>
    </Modal>
  );
};

export default ModalThongTinNguoiDung;
