
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import { createAxios } from "../../../Utils/configApi";
import ShowToast from "../../../Components/show-toast/ShowToast";

const ImagePreview = ({ taiLieu }: { taiLieu: any }) => {
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    
    if(taiLieu){
        createAxios("application/json", "blob").get<Blob>(`api/quan-ly-tai-lieu/get-image?id=${taiLieu.id}`, {
            responseType: "blob",
          })
            .then((res) => {
                // res.data là Blob
                const url = URL.createObjectURL(res.data);
                setImageUrl(url);
            })
            .catch((err) => {
              ShowToast("error", "Lỗi tải ảnh", err?.response?.data?.message || err.message, 3);
            });
    }
  }, [taiLieu]);

  return (
     <div style={{textAlign:"center",}}>
      {imageUrl ? (
        <img src={imageUrl} alt="Loaded" />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default ImagePreview;
