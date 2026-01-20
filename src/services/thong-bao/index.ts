import { axiosConfig } from "../../Utils/configApi";

interface NotificationRequest {
  tai_lieu_id: string;
  tieu_de: string;
  noi_dung: string;
  nguoi_gui: string;
  nguoi_nhan: string;
  ngay_gui: Date;
  da_xem: boolean;
}

interface respone_thong_bao_dto {
  thong_bao_id: string;
}

export const GetAll = async (userId?: any) => {
    return await axiosConfig.get(`api/thong-bao/get-all?userId=${userId}`);
}; 

export const GuiThongBao = async (request: NotificationRequest) => {
    return await axiosConfig.post(`api/thong-bao/gui-thong-bao`, request);
}; 

export const ChapNhanThongBao = async (request: respone_thong_bao_dto) => {
    return await axiosConfig.put(`api/thong-bao/chap-nhan-thong-bao`, request);
}; 

export const TuChoiThongBao = async (request: respone_thong_bao_dto) => {
    return await axiosConfig.put(`api/thong-bao/tu-choi-thong-bao`, request);
}; 