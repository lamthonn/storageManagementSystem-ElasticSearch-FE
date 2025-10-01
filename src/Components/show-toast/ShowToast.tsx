import { notification } from "antd";
import "./ShowToast.scss"
type NotificationType = 'success' | 'error' | 'warning' | 'info';

const ShowToast = async (
  type: NotificationType,
  title: string,
  description: string,
  duration:number = 4,
) => {
  return notification[type]({
    message: title ?? "Thông báo",
    description: (
      <div>
        <span dangerouslySetInnerHTML={{ __html: description }}></span>
      </div>
    ),
    duration,
  });
};

export default ShowToast;
