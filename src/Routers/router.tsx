import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Layout/main-layout";
import QuanTriLuuTru from "../Pages/quan-lu-luu-tru";
import DanhMucPhongBan from "../Pages/quan-tri-danh-muc/danh-muc-phong-ban";
import DanhMucCapDo from "../Pages/quan-tri-danh-muc/danh-muc-cap-do";
import QuanLyNguoiDung from "../Pages/quan-tri-he-thong/quan-ly-nguoi-dung";
import { routesConfig } from "./routes";
import QuanLyNhomNguoiDung from "../Pages/quan-tri-he-thong/quan-ly-nhom-nguoi-dung";
import QuanLyNhatKyHeThong from "../Pages/quan-tri-he-thong/quan-ly-nhat-ky-he-thong";
import Login from "../Pages/dang-nhap";
import NotFoundPage from "../Pages/404ErrorPage";
import ErrorPage from "../Pages/500ErrorPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to={routesConfig.dangNhap} replace />,
    },
    //đăng nhập
    {
        path: routesConfig.dangNhap,
        element: <Login />,
    },
    // quản lý lưu trữ
    {
        path: '/',
        element: <MainLayout breadcrumb={['Trang chủ', 'Quản lý lưu trữ']}/>,
        children: [
            {
                path: routesConfig.quanLyLuuTru,
                element: <QuanTriLuuTru />,
            },
        ],
    },

    // quản lý danh mục
    {
        path: '/',
        element: <MainLayout breadcrumb={['Trang chủ', 'Quản trị danh mục', 'Danh mục phòng ban']}/>,
        children: [
            {
                path: `${routesConfig.quanLyDanhMuc}/${routesConfig.danhMucPhongBan}`,
                element: <DanhMucPhongBan />,
            },
        ],
    },
    {
        path: '/',
        element: <MainLayout breadcrumb={['Trang chủ', 'Quản trị danh mục', 'Danh mục cấp độ']}/>,
        children: [
            {
                path: `${routesConfig.quanLyDanhMuc}/${routesConfig.danhMucCapDo}`,
                element: <DanhMucCapDo />,
            },
        ],
    },
    // quản trị hệ thống
    {
        path: '/',
        element: <MainLayout breadcrumb={['Trang chủ', 'Quản trị hệ thống', 'Quản lý người dùng']}/>,
        children: [
            {
                path: `${routesConfig.quanLyHeThong}/${routesConfig.quanLyNguoiDung}`,
                element: <QuanLyNguoiDung />,
            },
        ],
    },
    {
        path: '/',
        element: <MainLayout breadcrumb={['Trang chủ', 'Quản trị hệ thống', 'Quản lý nhóm người dùng']}/>,
        children: [
            {
                path: `${routesConfig.quanLyHeThong}/${routesConfig.quanLyNhomNguoiDung}`,
                element: <QuanLyNhomNguoiDung />,
            },
        ],
    },
    {
        path: '/',
        element: <MainLayout breadcrumb={['Trang chủ', 'Quản trị hệ thống', 'Quản lý nhật ký hệ thống']}/>,
        children: [
            {
                path: `${routesConfig.quanLyHeThong}/${routesConfig.quanLyNhatKyHeThong}`,
                element: <QuanLyNhatKyHeThong />,
            },
        ],
    },
    {
        path: "/500",
        element: <ErrorPage />,
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
])