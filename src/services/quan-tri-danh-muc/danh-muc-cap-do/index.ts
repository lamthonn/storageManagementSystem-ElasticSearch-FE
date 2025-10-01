import { axiosConfig } from "../../../Utils/configApi";

// Lấy toàn bộ
export const getAllCapDo = async (request: any) => {
  return await axiosConfig.get("api/danh-muc-cap-do/get-all", {
    params: {
      keySearch: request.keySearch,
      ngay_tao: request.ngay_tao,
      trang_thai: request.trang_thai
    }
  });
};

// Lấy theo id
export const getCapDoById = async (id: string | number) => {
  return await axiosConfig.get(`api/danh-muc-cap-do/get-by-id/${id}`);
};

// Tạo mới
export const createCapDo = async (data: any) => {
  return await axiosConfig.post("api/danh-muc-cap-do/create", data);
};

// Cập nhật
export const updateCapDo = async (id: string | number, data: any) => {
  return await axiosConfig.put(`api/danh-muc-cap-do/update/${id}`, data);
};

// Xoá
export const deleteCapDo = async (id: string | number) => {
  return await axiosConfig.delete(`api/danh-muc-cap-do/delete/${id}`);
};

// Xoá nhiều
export const deleteAnyCapDo = async (ids: (string | number)[]) => {
  return await axiosConfig.delete(`api/danh-muc-cap-do/delete-any`, {
    data: ids, // phải để data
    headers: { "Content-Type": "application/json" }
  });
};