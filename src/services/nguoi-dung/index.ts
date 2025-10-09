import { axiosConfig } from "../../Utils/configApi";

export const getPaginationNguoiDung = async (data:any) => {
  return await axiosConfig.get(`api/nguoi-dung/get-pagination?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}${data.keySearch ? `&keySearch=${data.keySearch}` :""}`);
};

export const addNguoiDung = async (data:any) => {
  return await axiosConfig.post(`api/nguoi-dung`, data);
};

export const updateNguoiDung = async (id:any, data:any) => {
  return await axiosConfig.put(`api/nguoi-dung?id=${id}`, data);
};

export const deleteNguoiDung = async (id:any) => {
  return await axiosConfig.delete(`api/nguoi-dung?id=${id}`, id);
};

export const getNguoiDungById = async (id:any) => {
  return await axiosConfig.get(`api/nguoi-dung/get-by-id?id=${id}`);
};
export const GetColleague = async (id:any, tai_lieu_id:any) => {
  return await axiosConfig.get(`api/nguoi-dung/get-colleague?nguoi_dung_id=${id}&tai_lieu_id=${tai_lieu_id}`);
};
export const GetUserByDoc = async (tai_lieu_id:any) => {
  return await axiosConfig.get(`api/nguoi-dung/get-user-by-doc?tai_lieu_id=${tai_lieu_id}`);
};
