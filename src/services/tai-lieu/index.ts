import { jwtDecode, JwtPayload } from "jwt-decode";
import { axiosConfig, axiosConfigUpload, createAxios } from "../../Utils/configApi";
import ShowToast from "../../Components/show-toast/ShowToast";
interface AuthInterface extends JwtPayload {
    id: string,
}

export const UploadTaiLieu = async (FormData: any) => {
    if (true) {
        return await axiosConfigUpload.post(`api/quan-ly-tai-lieu/upload`, FormData);
    }
};

export const GetAllTaiLieu = async (query?: any) => {
    return await axiosConfigUpload.get(`api/quan-ly-tai-lieu/get-all`, { params: query });
};

export const GetNguoiDung = async (query?: any) => {
    const token = localStorage.getItem("auth");
    if(token){
        const decodeToken: AuthInterface = jwtDecode(token);
        return await axiosConfigUpload.get(`api/quan-ly-tai-lieu/get-nguoi-dung`, { params: {nguoi_dung_id: decodeToken.id} });
    }
    else {
        ShowToast("warning", "Thông báo", "Vui lòng đăng nhập lại hệ thống", 3)
    }
};

export const AdvancedSearch = async (query?: any) => {
    if(true){
        return await axiosConfigUpload.get(`api/quan-ly-tai-lieu/advanced-search`, { params: query });
    }
};

export const DownloadFile = async (id_file: string) => {
    if(true){
        return await createAxios("multipart/form-data", "blob").get(`api/quan-ly-tai-lieu/download?tai_lieu_id=${id_file}`);
    }
};