import dayjs from "dayjs";
import { axiosConfig } from "./configApi";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AuthInterface extends JwtPayload {
  id:string,
}
export const formatDateTime = (dateString: string): string => {
  return dayjs(dateString).format("DD/MM/YYYY HH:mm:ss");
};

export const getPerms = (ma:string) => {
  const token = localStorage.getItem("auth");
    if (token){
      const decodeToken:AuthInterface = jwtDecode(token);
      return axiosConfig.get(`api/nguoi-dung/get-pers?id_nguoi_dung=${decodeToken.id}&ma=${ma}`);
    }
};