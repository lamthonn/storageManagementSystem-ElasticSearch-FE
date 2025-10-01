import React, { useEffect, useState } from 'react';
import {  ContainerOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, TableOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import HeaderLayout from '../header';
import { menu } from '../../Utils/menu';
import FooterLayout from '../footer';
import "./mainLayout.scss"
import { Outlet, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../../Routers/PrivateRoute';
import { getMenuByNguoiDung } from '../../services/dieu-huong';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import ShowToast from '../../Components/show-toast/ShowToast';
import { routesConfig } from '../../Routers/routes';

const { Content, Sider } = Layout;

interface MainLayoutProps {
  breadcrumb?: string[];
}

interface AuthInterface extends JwtPayload {
  id:string,
}

const MainLayout: React.FC<MainLayoutProps> = ({
  breadcrumb
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>(['quan-ly-luu-tru']);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(()=> {
    handleGetMenuByND()
  },[])

  const handleGetMenuByND = () => {
    const token = localStorage.getItem("auth");
    if (token) {
      setLoading(true);
      const decodeToken:AuthInterface = jwtDecode(token);
      getMenuByNguoiDung(decodeToken.id)
      .then((res:any)=> {
        var newMenu = res.data.map((item:any)=> {
          return {
            key: item.key,
            icon: item.ma_dinh_danh === routesConfig.quanLyLuuTru ? React.createElement(ContainerOutlined) : (item.ma_dinh_danh === routesConfig.quanLyDanhMuc ? React.createElement(TableOutlined) : React.createElement(SettingOutlined)), 
            label: item.label,
            ma_dinh_danh: item.ma_dinh_danh,
            Permissions: item.Permissions,
            children: item.children.length > 0 ? item.children : null 
          }
        })
        setMenuItems(newMenu);
      })
      .catch(err => {
        ShowToast('error',"Thông báo", "Có lỗi xảy ra", 3);
      })
      .finally(()=> {
        setLoading(false);
      })
    }
  }

  const navigate = useNavigate();

  const handleChangeMenu = ({ key }: { key: string }) => {
    navigate(`/${key}`);
    setSelectedKeys([key]);
    localStorage.setItem('selectedMenuKey', key); // lưu key
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('selectedMenuKey');
    if (savedKey) {
      setSelectedKeys([savedKey]);
    }
  }, []);

  return (
    <ProtectedRoute>
      <Layout style={{ minHeight: '100vh' }} className='main-layout'>
        <HeaderLayout />
        <Layout>
          <Sider width={250} style={{ background: colorBgContainer }} collapsed={isCollapsed}>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              defaultOpenKeys={selectedKeys}
              style={{ height: '94%', borderInlineEnd: 0 }}
              items={menuItems}
              onSelect={handleChangeMenu}
            />
            <div style={{ height: '6%' }} className='footerSide'>
              {
                isCollapsed ? <MenuUnfoldOutlined className='collapsed-icon' onClick={() => setIsCollapsed(false)} /> : <MenuFoldOutlined className='collapsed-icon' onClick={() => setIsCollapsed(true)} />
              }
            </div>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb
              items={breadcrumb?.map((item:string) => ({ title: item })) || []}
              style={{ margin: '16px 0' }}
            />
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
                <Outlet />
            </Content>
          </Layout>
        </Layout>

        <FooterLayout />
      </Layout>
    </ProtectedRoute>
  );
};

export default MainLayout;