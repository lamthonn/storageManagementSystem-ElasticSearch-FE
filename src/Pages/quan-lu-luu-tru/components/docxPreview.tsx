import { useEffect, useState } from "react";
import { HandleGiaiMa } from "../../../services/tai-lieu";
import ShowToast from "../../../Components/show-toast/ShowToast";
import { Spin } from "antd";

type DocxPreview = {
    data: any;
} 

const DocxPreview: React.FC<DocxPreview> = ({
    data
}) => {
    const [docData, setDocData] = useState<any | null>(null);
    const [loading, setloading] = useState<boolean>(false);
    useEffect(()=> {
        if(data){
            setloading(true);
            HandleGiaiMa(data)
            .then((res)=> {
                setDocData(res.data);
            })
            .catch((err)=> {
                ShowToast("error", "Thông báo", "Giải mã tài liệu không thành công", 3)
            })
            .finally(()=> {
                setloading(false);
            })
        }
    },[data])
    return docData ?  <span dangerouslySetInnerHTML={{ __html: docData }} style={{ padding:"0 10px",  }}/> : <Spin spinning={loading}></Spin>;
}

export default DocxPreview;