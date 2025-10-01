import React from "react";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { authService } from "../../services/authen";
import ShowToast from "../../Components/show-toast/ShowToast";
import { useNavigate } from "react-router-dom";
import { routesConfig } from "../../Routers/routes";

const Login: React.FC = () => {

  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (values.username && values.password) {
      await authService.login(values.username, values.password)
      .then((res:any)=> {
        //set token vào localstorage
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(`/${routesConfig.quanLyLuuTru}`);
        localStorage.setItem('selectedMenuKey', routesConfig.quanLyLuuTru);
        ShowToast("success","thông báo", "Đăng nhập thành công!", 3);
      })
      .catch((error) => {
        if(error && error.response.data.includes("Mật khẩu không đúng")){
          ShowToast("error","thông báo", "Mật khẩu không đúng!", 3);
        }
        else{
          ShowToast("error","thông báo", `Không tìm thấy tài khoản ${values.username}!`, 3);
        }
      });
    }
    else{
      ShowToast("error","thông báo", "Vui lòng nhập đầy đủ thông tin!", 3);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/background.jpg')",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        fontFamily: "Inter, sans-serif", // Thêm dòng này
      }}
    >
      {/* Tiêu đề */}
      <div style={{ color: "#fff", textAlign: "left", marginBottom: 20, width: 550, lineHeight:"1.5", display: "flex", alignItems: "center" }}>
        <img
          src="/images/QuocHuy.png"
          alt="Quốc hiệu"
          style={{ height: 70, marginRight: 12 }}
        />
        <div>
          <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "29px" }}>CỤC QUẢN LÝ CHẤT LƯỢNG</h2>
          <h3 style={{ margin: 0 }}>PHẦN MỀM QUẢN LÝ LƯU TRỮ</h3>
        </div>
      </div>

      {/* Form đăng nhập */}
      <Card
        style={{
          width: 450,
          paddingBottom: "20px",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
          <h3 style={{ margin: 0, fontWeight: "bold", color: "#002766", fontSize: "20px" }}>
            ĐĂNG NHẬP
          </h3>

          <img
            src="/images/quoc_ky.png"
            alt="Login"
            style={{ height: 15 }}
          />
        </div>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ background: "#002766" }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          textAlign: "center",
          fontSize: 12,
          color: "#fff",
          lineHeight: 1.5,
        }}
      >
        © Bản quyền thuộc Lâm Vũ <br />
        Địa chỉ: Số 15 ngõ 24/2/85 Đại Mỗ, Nam Từ Liêm, Hà Nội <br />
        Điện thoại: 0961388896 - Email: vuvuonglam0203@gmail.com
      </div>
    </div>
  );
};

export default Login;
