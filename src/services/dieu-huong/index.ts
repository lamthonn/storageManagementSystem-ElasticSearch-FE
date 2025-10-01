import { axiosConfig } from "../../Utils/configApi";

export const getMenu = async () => {
  return await axiosConfig.get(`api/dieu-huong/GetMenu`);
};

export const getPhanQuyen = async (nhom_nguoi_dung_id:any) => {
  return await axiosConfig.get(`api/dieu-huong/get-phan-quyen?nhom_nguoi_dung_id=${nhom_nguoi_dung_id}`);
};

export const getMenuByNguoiDung = async (id_nguoi_dung:any) => {
  return await axiosConfig.get(`api/nguoi-dung/get-menu-by-nd?id_nguoi_dung=${id_nguoi_dung}`);
};
