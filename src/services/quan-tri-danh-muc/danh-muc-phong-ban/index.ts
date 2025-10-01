import { axiosConfig } from "../../../Utils/configApi";

// Lấy toàn bộ
export const getAllPhongBan = async (request: any) => {
  return await axiosConfig.get("api/danh-muc-phong-ban/get-all", {
    params: {
      keySearch: request.keySearch,
      ngay_tao: request.ngay_tao,
      trang_thai: request.trang_thai
    }
  });
};

// Lấy theo id
export const getPhongBanById = async (id: string | number) => {
  return await axiosConfig.get(`api/danh-muc-phong-ban/get-by-id/${id}`);
};

// Tạo mới
export const createPhongBan = async (data: any) => {
  return await axiosConfig.post("api/danh-muc-phong-ban/create", data);
};

// Cập nhật
export const updatePhongBan = async (id: string | number, data: any) => {
  return await axiosConfig.put(`api/danh-muc-phong-ban/update/${id}`, data);
};

// Xoá
export const deletePhongBan = async (id: string | number) => {
  return await axiosConfig.delete(`api/danh-muc-phong-ban/delete/${id}`);
};

// Xoá nhiều
export const deleteAnyPhongBan = async (ids: (string | number)[]) => {
  return await axiosConfig.delete(`api/danh-muc-phong-ban/delete-any`, {
    data: ids, // phải để data
    headers: { "Content-Type": "application/json" }
  });
};