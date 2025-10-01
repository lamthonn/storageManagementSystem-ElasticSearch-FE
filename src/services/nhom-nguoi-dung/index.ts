import { axiosConfig } from "../../Utils/configApi";

export const addNhomNguoiDung = async (data: any) => {
  return await axiosConfig.post(`api/nhom-nguoi-dung/them-nhom-nguoi-dung`, data);
};

export const getNhomNguoiDungById = async (id: any) => {
  return await axiosConfig.get(`api/nhom-nguoi-dung/get-by-id?id=${id}`);
};

export const handleDeleteNND = async (id: any) => {
  return await axiosConfig.delete(`api/nhom-nguoi-dung?id=${id}`);
};

export const handleDeleteManyNND = async (ids: any) => {
  return await axiosConfig.delete(`api/nhom-nguoi-dung/xoa-nhieu`, {
    data: ids,
  });
};

export const handleEditNND = async (id: any, data:any) => {
  return await axiosConfig.put(`api/nhom-nguoi-dung?id=${id}`, data);
};