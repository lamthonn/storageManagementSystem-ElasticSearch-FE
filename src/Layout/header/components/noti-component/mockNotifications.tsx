import { Tabs, List, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./mockNotification.scss";
import { ChapNhanThongBao, GetAll } from "../../../../services/thong-bao";
import { jwtDecode, JwtPayload } from "jwt-decode";
import ShowToast from "../../../../Components/show-toast/ShowToast";

const { TabPane } = Tabs;

interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationRequest {
  id: string;
  tai_lieu_id: string;
  tieu_de: string;
  noi_dung: string;
  nguoi_gui: string;
  nguoi_nhan: string;
  ngay_gui: Date;
  da_xem: boolean;
}

interface AuthInterface extends JwtPayload {
  id:string,
}

const NotificationDropdown = () => {
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [mockNotifications, setMockNotifications] = useState<Notification[]>([]);
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  const data =
    tab === "unread"
      ? mockNotifications.filter((n) => !n.isRead)
      : mockNotifications;

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("auth");
    if(token){
        const decodeToken:AuthInterface = jwtDecode(token);
        GetAll(decodeToken.id)
          .then((res: any) => {
            setMockNotifications(res.data);
          })
          .catch((err) => {
            ShowToast("error", "Thông báo", "Lấy thông báo thất bại", 3);
          })
          .finally(() => {
            setLoading(false);
          });
    }
  }, []);

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <b>Thông báo</b> ({unreadCount} chưa đọc)
      </div>

      <Tabs activeKey={tab} onChange={setTab}>
        <TabPane tab="Tất cả" key="all" />
        <TabPane tab="Chưa đọc" key="unread" />
      </Tabs>

      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => (
          <List.Item className={!item.isRead ? "unread" : ""}>
            <div className="item-header">
              <span className="title">{item.title}</span>
              <span className="time">{item.createdAt}</span>
            </div>

            <div className="content">{item.content}</div>

            <div className="detail">
              <span className="share" onClick={() => {
                var request = {
                    thong_bao_id: item.id,
                };

                ChapNhanThongBao(request)
                  .then((res: any) => {
                    ShowToast("success", "Thông báo", "Chia sẻ tài liệu thành công", 3);
                  })
                  .catch((err) => {
                    ShowToast("error", "Thông báo", "Chia sẻ tài liệu thất bại", 3);
                  });
                
              }}>Chia sẻ tài liệu &gt;</span>
              <span className="cancel" onClick={() => {}}>Từ chối &gt;</span>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotificationDropdown;
