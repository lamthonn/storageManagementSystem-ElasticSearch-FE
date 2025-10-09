import { jwtDecode, JwtPayload } from "jwt-decode";
import ShowToast from "../../Components/show-toast/ShowToast";
import { axiosConfig } from "../../Utils/configApi";
interface AuthInterface extends JwtPayload {
    id: string,
}

export const addThuMuc = async (data: any) => {
    const token = localStorage.getItem("auth");
    if (token) {
        const decodeToken: AuthInterface = jwtDecode(token);
        return await axiosConfig.post(`api/thu-muc`, { ...data, nguoi_dung_id: decodeToken.id });
    }
    else {
        ShowToast("warning", "Thông báo", "Vui lòng đăng nhập lại hệ thống", 3)
    }
};

export const updateThuMuc = async (id:any, data: any) => {
    if (true) {
        return await axiosConfig.put(`api/thu-muc?id=${id}`, data);
    }
};

export const deleteThuMuc = async (id:any) => {
    if (true) {
        return await axiosConfig.delete(`api/thu-muc?id=${id}`);
    }
};

export const getManyFolder = async (ids:any) => {
    if (true) {
        return await axiosConfig.post(`api/thu-muc/get-many`, ids);
    }
};

export const getAllThuMuc = async (data?: any) => {
    const token = localStorage.getItem("auth");
    if (token) {
        const decodeToken: AuthInterface = jwtDecode(token);
        return await axiosConfig.get(`api/thu-muc`, {
            params: {
                nguoi_dung_id: decodeToken.id
            }
        });
    }
    else {
        ShowToast("warning", "Thông báo", "Vui lòng đăng nhập lại hệ thống", 3)
    }
};