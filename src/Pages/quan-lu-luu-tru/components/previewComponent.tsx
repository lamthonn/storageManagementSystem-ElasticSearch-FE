
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import axios from "axios";
import { createAxios } from "../../../Utils/configApi";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PdfPreview = ({ taiLieu }: { taiLieu: any }) => {
  const [file, setFile] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    if(taiLieu){
        createAxios("application/json", "blob").get(`api/quan-ly-tai-lieu/preview?id=${taiLieu.id}`, {
            responseType: "blob",
          })
          .then((res:any) => setFile(res.data));
    }
  }, [taiLieu]);

  return (
    <div style={{ width: "100%", textAlign: "center", display:"flex", justifyContent:"center", maxHeight:"80vh", overflowY:"scroll" }}>
      {file ? (
        <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={index} pageNumber={index + 1} width={800} />
          ))}
        </Document>
      ) : (
        <p>Đang tải PDF...</p>
      )}
    </div>
  );
};

export default PdfPreview;
