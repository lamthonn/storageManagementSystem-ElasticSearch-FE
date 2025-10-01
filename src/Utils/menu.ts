import React from "react";
import { UserOutlined } from '@ant-design/icons';
import { routesConfig } from "../Routers/routes";

export const menu = () => {
  const items1 = [
    {
        key: routesConfig.quanLyLuuTru,
        icon: React.createElement(UserOutlined),
        label: `Quản lý lưu trữ`,
        ma_dinh_danh: routesConfig.quanLyLuuTru,
        Permissions:["PERM_VIEW", "PERM_ADD", "PERM_EDIT", "PERM_DELETE"],
    },
    {
        key: routesConfig.quanLyDanhMuc,
        icon: React.createElement(UserOutlined),
        label: `Quản lý danh mục`,
        ma_dinh_danh: routesConfig.quanLyDanhMuc,
        Permissions:[],
        children: [
            {
                key: `${routesConfig.quanLyDanhMuc}/${routesConfig.danhMucPhongBan}`,
                label: `Danh mục phòng ban`,
                ma_dinh_danh: routesConfig.danhMucPhongBan,
                Permissions:["PERM_VIEW", "PERM_ADD", "PERM_EDIT", "PERM_DELETE"],
            },
            {
                key: `${routesConfig.quanLyDanhMuc}/${routesConfig.danhMucCapDo}`,
                label: `Danh mục cấp độ`,
                ma_dinh_danh: routesConfig.danhMucCapDo,
                Permissions:["PERM_VIEW", "PERM_ADD", "PERM_EDIT", "PERM_DELETE"],
            }
        ]    
    },
    {
        key: routesConfig.quanLyHeThong,
        icon: React.createElement(UserOutlined),
        label: `Quản trị hệ thống`,
        ma_dinh_danh: routesConfig.quanLyHeThong,
        children: [
            {
                key: `${routesConfig.quanLyHeThong}/${routesConfig.quanLyNguoiDung}`,
                label: `Quản lý người dùng`,
                ma_dinh_danh: routesConfig.quanLyNguoiDung,
                Permissions:["PERM_VIEW", "PERM_ADD", "PERM_EDIT", "PERM_DELETE"],
            },
            {
                key: `${routesConfig.quanLyHeThong}/${routesConfig.quanLyNhomNguoiDung}`,
                label: `Quản lý nhóm người dùng`,
                ma_dinh_danh: routesConfig.quanLyNhomNguoiDung,
                Permissions:["PERM_VIEW", "PERM_ADD", "PERM_EDIT", "PERM_DELETE"],
            },
            {
                key: `${routesConfig.quanLyHeThong}/${routesConfig.quanLyNhatKyHeThong}`,
                label: `Quản lý nhật ký hệ thống`,
                ma_dinh_danh: routesConfig.quanLyNhatKyHeThong,
                Permissions:["PERM_VIEW", "PERM_ADD", "PERM_EDIT", "PERM_DELETE"],
            }
        ]    
    },
  ];

  return items1;
    
} 