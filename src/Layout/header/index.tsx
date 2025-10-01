import { Layout, Input, Avatar, Space, Menu, Dropdown } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import "./headerLayout.scss";
import "../../styles/_themes.scss";
import { useNavigate } from "react-router-dom";
import { routesConfig } from "../../Routers/routes";

const { Header } = Layout;


const HeaderLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây
    navigate(routesConfig.dangNhap);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Thông tin người dùng</Menu.Item>
      <Menu.Item key="changeRole">Thay đổi quyền truy cập</Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "var(--color-primary-9)",
        padding: "0 16px",
        height: 64,
      }}
      className="header-layout"
    >
      {/* Logo và tiêu đề */}
      <div style={{ display: "flex", alignItems: "center", color: "#fff" }}>
        <img
          src="/images/QuocHuy.png" // thay bằng link logo của bạn
          alt="Logo"
          style={{ height: 50, marginRight: 12, marginLeft: 12 }}
        />
        <div
          style={{ display: "flex", flexDirection: "column", lineHeight: 1.6 }}
        >
          <span style={{ fontWeight: "bold", fontSize: 16 }}>
            Cục quản lý chất lượng
          </span>
          <span style={{ fontSize: 15 }}>PHẦN MỀM QUẢN LÝ LƯU TRỮ</span>
        </div>
      </div>

      {/* Thanh tìm kiếm + icon + user */}
      <Space size="large" align="center" style={{ marginRight: 12 }}>
        {/* Thanh tìm kiếm */}
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined style={{ color: "#999" }} />}
          style={{ width: 250, borderRadius: 20 }}
        />

        {/* Icon thông báo */}
        {/* <Badge count={11} offset={[-2, 2]}>
          <BellOutlined style={{ fontSize: 20, color: "#fff" }} />
        </Badge> */}

        {/* Avatar + tên người dùng */}
        <Dropdown overlay={userMenu} trigger={['click']} className="dropdown-infor">
          <Space style={{ color: "#fff" }}>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: "bold" }}>Nguyễn Văn A</span>
            <span style={{ fontSize: 12 }}>CỤC TRƯỞNG</span>
          </div>
        </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderLayout;
