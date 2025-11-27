import { axiosConfig } from "../../Utils/configApi";

export const getAll = async () => {
  return await axiosConfig.get(`api/cau-hinh-file/get-all-config`);
};

export const updateConfig = async (data:any) => {
  return await axiosConfig.put(`api/cau-hinh-file/edit-config`, data);
}