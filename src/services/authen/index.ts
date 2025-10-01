import ShowToast from "../../Components/show-toast/ShowToast";
import { axiosConfig, axiosCustom } from "../../Utils/configApi";

export const authService = {
  login: async (taiKhoan: string, password: string) => {
    // Logic for user login
    return axiosConfig.post("/api/authen/dang-nhap", { tai_khoan: taiKhoan, mat_khau:password });
  },
  logout: async () => {
    // Logic for user logout
  },
  register: async (userData: any) => {
    // Logic for user registration
  },
};

export const refreshToken: (body: any) => Promise<any> = (body: any) => {
  return axiosCustom.post("/api/authen/refresh-token", body);
};