import { FunctionComponent, useEffect, useState } from "react";
import ButtonCustom from "../button/button";
import "./Upload.scss";
import {
  Progress,
  Spin,
  Tooltip,
  Modal,
  Button,
  Row,
  Col,
  Divider,
  Space,
  Form,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  FileTextOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ShowToast from "../show-toast/ShowToast";
// import {
//   getFromURL,
//   postFromURL,
//   objectToQueryString,
//   serializeObjectReplaceString,
// } from "../../../services/render-config";
import { axiosConfig, BASE_URL } from "../../Utils/configApi";

import { FormInstance } from "antd/lib";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import FormSelect from "../select/FormSelect";
import FormItemInput from "../form-input/FormInput";
import TableData from "../table-data/TableData";
import Typography from "antd/es/typography/Typography";
import { UploadTaiLieu } from "../../services/tai-lieu";
import { set } from "lodash";
import { formatFileSize } from "../../Utils/common";
type PreChildrenProps = {
  name?: string;
  props?: any;
};

type UploadComponentProps = {
  title: string;
  type?: string;
  value?: any | null | undefined;
  tenTepFieldName?: string;
  duongDanFieldName?: string;
  handleClose: (isLoadTable?: boolean) => void;
  refreshData?: boolean;
  setRefreshData?: React.Dispatch<React.SetStateAction<boolean>>;
  form?: FormInstance;
  checkEdit?: boolean;
  isEditForm?: boolean;
  dataEdit?: any;
  onFinishEdit?: Function;
  url?: string;
  itemRecord?: any;
  rowPreChildren?: number;
  api_tham_dinh?: string;
  type_tham_dinh?: "chu-de" | "cau-hoi" | "ma-tran-de";
  //preview
  isPreview?: boolean;
  preview_modal?: string;
  previewTitle?: string;
  widthPreviewModal?: number;
  id_chu_de?: string;
  danh_sach_id_duyet_nhieu?: any;
  // thêm ngày kết thúc để kiểm tra
  ngay_ket_thuc?: Dayjs;

  acceptedFileTypes: string[];
  maxFileSize?: number;
  note?: string[];
  totalFile?: number;
  template?: any;
  folder?: string;
  errorMessage?: string;
  preChildren?: PreChildrenProps[];

  //detail
  detail_titleModal?: string;
  detail_handleOk?: () => void;
  detail_filterYeuTo?: boolean;
  detail_filterDoCao?: boolean;
  detail_widthModal?: number;
  mapper_columns?: any[];
  entityName?: string;
  filterPath?: any[];
  pattern?: string | string[];
  dataNhanXet?: string;
  setLoadingParent?: (load: boolean) => void;
  // ma trận
  isDowloadFileThamDinhMaTran?: boolean;
  thu_muc_id?: string;

  isRefreshData: boolean;
  setIsRefreshData: (val: boolean) => void;
};

const UploadFileCustom: FunctionComponent<UploadComponentProps> = ({
  title,
  thu_muc_id,
  setLoadingParent,
  rowPreChildren = 3,
  type,
  value,
  tenTepFieldName,
  duongDanFieldName,
  refreshData,
  setRefreshData,
  form,
  checkEdit,
  isEditForm,
  dataEdit,
  onFinishEdit,
  handleClose,
  url,
  id_chu_de,
  danh_sach_id_duyet_nhieu,
  ngay_ket_thuc,
  //file,
  //setFile,
  acceptedFileTypes, // Include multiple types
  maxFileSize,
  note,
  totalFile = 5,
  api_tham_dinh,
  type_tham_dinh,
  template,
  folder,
  itemRecord,
  errorMessage,
  preChildren,
  //preview
  isPreview = false,
  preview_modal,
  previewTitle,
  widthPreviewModal,

  detail_titleModal = "Chi tiết",
  detail_handleOk,
  detail_filterYeuTo,
  detail_filterDoCao,
  detail_widthModal,
  mapper_columns,
  entityName,
  filterPath,
  pattern,
  dataNhanXet,
  isDowloadFileThamDinhMaTran,
  isRefreshData,
  setIsRefreshData,
  ...rest
}) => {
  // fix refresh data sau khi thẩm định
  const closeModalAndRefresh = () => {
    // Refresh bảng dữ liệu
    if (setRefreshData) {
      setRefreshData(true);
    }
    // Đóng modal với tham số true để báo hiệu cần load lại bảng
    handleClose(true);
  };
  const restProps: any = { ...rest };

  const [mucDo, SetMucDo] = useState<any>();
  const [phongBan, SetPhongBan] = useState<any>();
  const [dragging, setDragging] = useState(false); // Track dragging state
  const [maxSizeConfig, setMaxSizeConfig] = useState<number>(10); // Track dragging state
  const [excelFileForDetail, setExcelFileForDetail] = useState<any>();
  const [files, setFiles] = useState<any[]>([]);
  const folderProp = type_tham_dinh;
  const [newPattern, setNewPattern] = useState<string[]>(
    Array.isArray(pattern) ? pattern ?? [] : [pattern ?? ""]
  );
  let [selectedPattern, setSelectedPattern] = useState<string>("");
  let [isEditFormNew, setIsEditFormNew] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [filterPathProp, setFilterPathProp] = useState<any[any]>([
    ...(filterPath?.map((x) => ({ ...x })) ?? []),
  ]); // clone array not working
  if (typeof acceptedFileTypes === "string")
    acceptedFileTypes = [acceptedFileTypes];

  //Excel va cap nhat sua 1 file
  if (
    acceptedFileTypes?.includes(".xlsx") ||
    acceptedFileTypes?.includes(".xls") ||
    isEditFormNew === true
  ) {
    // totalFile = 1;
  } else note = [...(note ?? [])];

  const preProcessFile = async (browseFiles: File[]) => {
    setLoading?.(true);
    const selectedFiles: any[] = Array.from(browseFiles);
    if (files?.length == totalFile) {
      setLoading?.(false);
      ShowToast(
        "error",
        "Thông báo",
        `Chỉ được phép tải lên tối đa ${totalFile} file`
      );
      return;
    }
    selectedFiles.forEach((x: any) => {
      validateFileType(x, acceptedFileTypes);
    });

    //check tên file
    const validExtensions = acceptedFileTypes?.map((ext) =>
      ext.trim().replace(".", "")
    );
    let filteredFiles: any[] = selectedFiles.filter((file: any) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const fileName = file.name.split(".").slice(0, -1).join("."); // Get the name without extension
      console.log(validExtensions, fileExtension);
      
      const retFileNameValid: any = validateFileName(fileName);

      const isValid =
        validExtensions.includes(fileExtension ?? "") &&
        (maxSizeConfig === 0 ||
          (maxFileSize || maxSizeConfig
            ? file.size <= (maxSizeConfig ?? maxFileSize) * 1024 * 1024
            : true)) &&
        retFileNameValid.ret;
      let msgValid = validExtensions.includes(fileExtension ?? "")
        ? ""
        : "- File không đúng định dạng 0<br/>";
      msgValid +=
        (msgValid === "" ? "" : "") +
        (maxSizeConfig === 0 ||
        (maxFileSize || maxSizeConfig
          ? file.size <= (maxSizeConfig ?? maxFileSize) * 1024 * 1024
          : true)
          ? ""
          : "- File quá kích thước cho phép<br/>");
      if (retFileNameValid.ret === false) msgValid += retFileNameValid.msg;

      //if(isValid !== true) ShowToast('error', 'Thông báo', `File ${msgValid} sẽ không được tải lên: ${file.name} ${retFileNameValid.msg ?? ''}`);

      file.isValid = isValid;
      file.msgValid = msgValid;
      file.filenamesize = file.name + " " + formatFileSize(file.size);
        
      return true;
    });
    filteredFiles = [...filteredFiles];

    // Check for duplicates
    const duplicates: any[] = checkDuplicates(filteredFiles, files);
    if (duplicates.length > 0) {
      ShowToast(
        "error",
        "Thông báo",
        `Các file sau đã tồn tại và sẽ không được tải lên: ${duplicates
          .map((f) => f.name)
          .join(", ")}`
      );
    }

    // Remove duplicates from the list to add
    const uniqueFiles: any[] = filteredFiles.filter(
      (f) => !duplicates.some((d) => d.name === f.name)
    );

    const isExcel = uniqueFiles.some(
      (file: any) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
    );

    if (isExcel) {
      setFiles([uniqueFiles[0]]); // Only allow one Excel file
      setExcelFileForDetail(uniqueFiles[0]);
    } else {
      const totalFiles = [...files, ...uniqueFiles];
      if (totalFiles.length > totalFile) {
        ShowToast(
          "error",
          "Thông báo",
          `Chỉ được phép tải lên tối đa ${totalFile} file`
        );
        setFiles(totalFiles.slice(0, totalFile));
      } else {
        setFiles(totalFiles);
      }
    }
    setLoading?.(false);
  };

  const handleChoosefile = () => {
    setLoading?.(true);
    (document.getElementById("file-upload-input") as any).value = "";
    document.getElementById("file-upload-input")?.click();
    setTimeout(() => {
      setLoading?.(false);
    }, 3000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading?.(true);
    if (event.target.files && event.target.files.length > 0) {
      preProcessFile(Array.from(event.target.files));
    } else setLoading?.(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setLoading?.(true);
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      preProcessFile(droppedFiles);
    }
  };

  const _formatString = (str: string) => {
    str = str + "";
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  };

  const validateFileName = (fileName: string) => {
    let folder = "";
    let ret = true;
    let msg = "";
    //tach pattern _, neu co [] thi tim trong filterPath, lay ra ma, id => file
    //tach filename _ theo thu tu pattern => ma vao folder, thu tu theo filterPath
    if (!pattern) {
      return { ret, msg };
    }
    const subFilename = fileName?.replaceAll("_", "_").split("_");
    const foundPattern = newPattern.filter(
      (patt: string) => (patt?.split("_")?.length ?? 0) === subFilename.length
    );
    if (foundPattern.length === 0) {
      ret = false;
      msg = `- File không đúng định dạng 1 ${newPattern.join(" hoặc ")}<br/>`;
      return { ret, msg };
    }
    selectedPattern = foundPattern[0];
    setSelectedPattern(foundPattern[0]);
    const subPattern = selectedPattern?.split("_");
    // console.log(`pattern::::`, pattern, '-',subPattern);
    // console.log(`subFilename::::`, subFilename);
    if ((subPattern?.length ?? 0) !== subFilename.length) {
      ret = false;
      msg = `- File không đúng định dạng 2 ${pattern}<br/>`;
      return { ret, msg };
    }
    if (fileName.toLowerCase() !== _formatString(fileName)) {
      ret = false;
      msg = "- File không được có tiếng Việt, Unicode<br/>";
      return { ret, msg };
    }
    if (
      isEditFormNew === true &&
      itemRecord[tenTepFieldName ?? "ten_tep"].split(".")[0].toLowerCase() !==
        _formatString(fileName)
    ) {
      ret = false;
      msg = "- File mới phải cùng tên file cũ cần sửa<br/>";
      return { ret, msg };
    }
    //File sai quy tắc đặt tên
    filterPathProp
      ?.filter((filter: any) => (filter.is_check ?? true) === true)
      .forEach((filter: any) => {
        subPattern?.forEach((pat, idx) => {
          if (pat === `[${filter.title}]`) {
            const itemFilter = filter.lstData?.filter(
              (x: any) =>
                _formatString(x.ma) === _formatString(subFilename[idx]) ||
                _formatString(x.ten) === _formatString(subFilename[idx])
            );
            if (filter.lstData?.length > 0 && itemFilter?.length == 0) {
              msg += `- Định dạng [${filter.title}] không đúng với [${
                subFilename[idx]
              } | ${_formatString(subFilename[idx])}]<br/>`;
              ret = false;
              return;
            }
            if (itemFilter?.length > 0) {
              if (
                filter.validate_in?.length > 0 &&
                !filter.validate_in
                  ?.map((x: string) => _formatString(x))
                  .includes(_formatString(subFilename[idx]))
              ) {
                msg += `- Định dạng [${filter.title}] phải thuộc [${filter.validate_in}]<br/>`;
                ret = false;
                return;
              }
              if (
                filter.validate_not_in?.length > 0 &&
                filter.validate_not_in
                  ?.map((x: string) => _formatString(x))
                  .includes(_formatString(subFilename[idx]))
              ) {
                msg += `- Định dạng [${filter.title}] không thuộc [${filter.validate_not_in}]<br/>`;
                ret = false;
                return;
              }
            } else {
              if (pat.includes("[") && pat.includes("YYYY")) {
                try {
                  if (
                    pat === "[YYYY]" &&
                    (subFilename[idx].length !== 4 ||
                      parseInt(subFilename[idx]) <= 0)
                  ) {
                    msg += `- Định dạng [${filter.title}] không đúng với [${subFilename[idx]}]<br/>`;
                    ret = false;
                  }

                  if (pat.includes("[YYYYMMDD")) {
                    let ngayQt = dayjs(
                      subFilename[idx],
                      pat.replace("[", "").replace("]", "")
                    ).add(7, "hour");
                    if (filter.add) ngayQt = ngayQt.add(filter.add, "hour");
                    if (
                      !ngayQt ||
                      subFilename[idx].length !==
                        pat.replace("[", "").replace("]", "").length
                    ) {
                      msg += `- Định dạng [${filter.title}] không đúng với [${subFilename[idx]}]<br/>`;
                      ret = false;
                    }
                  }
                  if (filter.title.length < 4) {
                    let ngayQt = dayjs(
                      subFilename[idx],
                      pat.replace("[", "").replace("]", "")
                    ).add(7, "hour");
                    if (filter.add) ngayQt.add(filter.add, "hour");
                    if (filter.is_folder ?? true === true)
                      folder += ngayQt.format(filter.title) + "\\";
                    return;
                  }
                  return;
                } catch {
                  ret = false;
                }
              } else {
                msg += `- Định dạng [${filter.title}] không đúng với [${subFilename[idx]}]<br/>`;
                ret = false;
                return;
              }
            }
          }
        });
      });

    if (msg !== "")
      msg =
        "<br/>" +
        msg
          .split("<br/>")
          .filter((item, pos, self) => self.indexOf(item) == pos)
          .join("<br/>");
    //if(ret === false && msg !== '') ShowToast('error', 'Thông báo', msg);

    return { ret, msg };
  };

  const analyzeFileNameToFolder = (fileName: string) => {
    let folder = folderProp + "\\";
    //tach pattern _, neu co [] thi tim trong filterPath, lay ra ma, id => file
    //tach filename _ theo thu tu pattern => ma vao folder, thu tu theo filterPath
    const subPattern = selectedPattern?.split("_");
    const subFilename = fileName?.replaceAll("_", "_").split("_");
    filterPathProp?.forEach((filter: any) => {
      subPattern?.forEach((pat, idx) => {
        if (pat === `[${filter.title}]` || pat.includes(filter.title)) {
          const itemFilter = filter.lstData?.filter(
            (x: any) =>
              x.ma === subFilename[idx] ||
              x.ten === subFilename[idx] ||
              _formatString(x.ma) === _formatString(subFilename[idx]) ||
              _formatString(x.ten) === _formatString(subFilename[idx])
          );
          if (itemFilter?.length > 0) {
            if (filter.is_folder ?? true === true)
              folder += itemFilter[0].ma + "\\";
            setFiles([
              ...files.map((f: any) => {
                if (f.name?.includes(fileName)) {
                  f[filter.name] = itemFilter[0].id;
                  f[filter.name + "-ma"] = itemFilter[0].ma;
                }
                return f;
              }),
            ]);
            return;
          } else {
            if (pat.includes("[") && pat.includes("YYYY")) {
              if (filter.title === "[YYYY]" || filter.title === "YYYY") {
                setFiles([
                  ...files.map((f: any) => {
                    if (f.name?.includes(fileName))
                      f[filter.name] = subFilename[idx].replace(".nc", "");
                    //folder += subFilename[idx] + '\\'; // khong can tach nam vi qua it file trong 1 folder
                    return f;
                  }),
                ]);
                return;
              }

              if (filter.title.includes("YYYYMMDD")) {
                // thời điểm quan trắc thì cần +7h còn đường dẫn file thì không cần
                let ngayQtKhongCong7h = dayjs(
                  subFilename[idx],
                  pat.replace("[", "").replace("]", "")
                );
                if (filter.is_folder ?? true === true)
                  folder += ngayQtKhongCong7h.format("YYYYMM") + "\\";
                if (filter.is_folder ?? true === true)
                  folder += ngayQtKhongCong7h.format("YYYYMMDD") + "\\";
                let ngayQt = dayjs(
                  subFilename[idx],
                  pat.replace("[", "").replace("]", "")
                ).add(7, "hour");
                if (filter.add) ngayQt = ngayQt.add(filter.add, "hour");
                setFiles([
                  ...files.map((f: any) => {
                    if (f.name?.includes(fileName)) {
                      // console.log(ngayQt);
                      f[filter.name] = ngayQt;
                    }
                    // khong can tach gio vi qua it file trong 1 folder
                    return f;
                  }),
                ]);
                return;
              }
              if (filter.title.length < 4) {
                let ngayQt = dayjs(
                  subFilename[idx],
                  pat.replace("[", "").replace("]", "")
                ).add(7, "hour");
                if (filter.add) ngayQt = ngayQt.add(filter.add, "hour");
                if (filter.is_folder ?? true === true)
                  folder += ngayQt.format(filter.title) + "\\";
                setFiles([
                  ...files.map((f: any) => {
                    if (f.name?.includes(fileName)) {
                      f[filter.name] = ngayQt.format(filter.title);
                    }
                    return f;
                  }),
                ]);
                return;
              }
            } else {
              //ShowToast('error', 'Thông báo', `Định dạng file không đúng ${filter.title}. File sẽ được lưu vào folder cấp trên`);
              if (filter.is_folder ?? true === true)
                folder += subFilename[idx] + "\\";
              setFiles([
                ...files.map((f: any) => {
                  if (f.name?.includes(fileName)) {
                    f[filter.name] = subFilename[idx];
                  }
                  return f;
                }),
              ]);
              return;
            }
          }
        }
      });
    });
    return folder + "\\" + fileName;
  };

  const checkDuplicates = (newFiles: File[], existingFiles: File[]) => {
    if (existingFiles) {
      const existingFileNames = existingFiles.map((f) => f.name);
      const duplicates = newFiles.filter((f) =>
        existingFileNames.includes(f.name)
      );
      return duplicates;
    } else return [];
  };

  const validateFileType = (
    file: File,
    acceptedFileTypes: string[]
  ): boolean => {
    const validExtensions = acceptedFileTypes?.map((ext) =>
      ext.trim().replace(".", "").toLowerCase()
    );
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      //ShowToast('error', 'Định dạng file không hợp lệ', `File ${file.name} không thuộc định dạng được chấp nhận: ${acceptedFileTypes}`);
      return false;
    }
    return true;
  };

  const overwriteFile = (index: number) => {
    if (
      acceptedFileTypes?.includes(".xlsx") ||
      acceptedFileTypes?.includes(".xls")
    ) {
    } else {
      const file = files[index];
      if (file.exist === true) {
        file.exist = false;
        file.isValid = true;
        file.msgValid = "";
        setFiles([...files]);
        return;
        Modal.confirm({
          title: "Xác nhận ghi đè file",
          content: <p>Chắc chắn muốn ghi đè file</p>,
          okButtonProps: {
            className: "btn btn-primary",
          },
          cancelButtonProps: {
            className: "btn btn-outlined",
          },
          okText: "Xác nhận",
          cancelText: "Huỷ",
          centered: true,
          className: "confirm-modal-class", // Custom class for styling
          onOk: () => {
            file.exist = false;
            file.isValid = true;
            file.msgValid = "";
            setFiles([...files]);
          },
          onCancel: () => {},
        });
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    if (
      acceptedFileTypes?.includes(".xlsx") ||
      acceptedFileTypes?.includes(".xls")
    ) {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setExcelFileForDetail(updatedFiles);
      setFiles(updatedFiles);
    } else {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
    }
  };

  // Handle drag-and-drop events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const [excelProgress, setExcelProgress] = useState<any>({});
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10000);
  const columns: any[] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "90px",
      align: "center",
      render: (_: any, record: any, index: number) => {
        return <div>{record?.numericalOrder}</div>;
      },
    },
    {
      title: "File",
      dataIndex: "filenamesize",
      key: "filenamesize",
      width: "auto",
      render: (_: any, f: any, index: number) => {
        return (
          <>
            {f?.filenamesize}
            {parseInt("" + (100 * (f.trunkno + 1)) / f.trunktotal) > 0 && (
              <div style={{ width: "100%", position: "relative" }}>
                <Progress
                  percent={parseInt(
                    "" + (100 * (f.trunkno + 1)) / f.trunktotal
                  )}
                />
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Trạng thái upload",
      dataIndex: "isValid",
      key: "isValid",
      align: "center",
      width: "200px",
      render: (_: any, record: any, index: number) => {
        return (
          <span
            //onClick={() => overwriteFile(index)}
            onDoubleClick={() => overwriteFile(index)}
            className="html-box-preview"
            dangerouslySetInnerHTML={{
              __html:
                record?.isValid === true
                  ? "<span style='display: inline-block; color: green; border: 1px solid lightgreen; padding: 2px 10px; background-color: #f6ffed; border-radius: 6px; font-size: 14px; white-space: nowrap;'>Thành công</span>"
                  : "<span style='display: inline-block; color: red; border: 1px solid pink; padding: 2px 10px; background-color: #fff0f6; border-radius: 6px; font-size: 14px; white-space: nowrap;'>Thất bại</span>",
            }}
          ></span>
        );
      },
    },
    {
      title: "Nguyên nhân lỗi",
      dataIndex: "msgValid",
      key: "msgValid",
      width: "auto",
      render: (_: any, record: any, index: number) => {
        return (
          <span
            className="html-box-preview"
            dangerouslySetInnerHTML={{ __html: record?.msgValid }}
          ></span>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "vaiTros",
      key: "vaiTros",
      width: "120px",
      align: "center",
      render: (_: any, record: any, index: number) => {
        return (
          <div hidden={loading}>
            {/* {isEditFormNew === false && ( */}
            <span
              onClick={() => {
                handleRemoveFile(index);
              }}
            >
              <Tooltip
                className="tool-tip"
                placement="bottom"
                title="Xóa"
                color={"var(--color-tooltip-bg)"}
                key="tt-header-1"
              >
                <DeleteOutlined className="delete-outlined" />
              </Tooltip>
            </span>
            {/* )} */}
          </div>
        );
      },
    },
  ];

  //handle OK
  const handleOk = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("cap_do_id", mucDo);
    formData.append("phong_ban_id", phongBan);
    if(thu_muc_id){
      formData.append("thu_muc_id", thu_muc_id);
    }
    files.forEach((file: any) => {
      formData.append("files", file);
    });
    
    UploadTaiLieu(formData)
    .then((res) => {
      if (res.status === 200) {
        ShowToast("success", "Thành công", "Tải file thành công");
        setFiles([]);
        setExcelFileForDetail(undefined);
        setIsRefreshData(!isRefreshData);
        closeModalAndRefresh();
      } else {
        ShowToast("error", "Thất bại", res?.data?.message ?? "Lỗi hệ thống");
      }
    })
    .catch((error) => {
      console.log("error", error);
      if(error?.response?.data?.includes("đã tồn tại trên hệ thống")){
        ShowToast("warning", "Cảnh báo", "Tài liệu đã tồn tại trên hệ thống, vui lòng kiểm tra lại");
      }
      else{
        ShowToast("error", "Thất bại", "Lỗi hệ thống");
      }
    })
    .finally(() => {
      setLoading(false);
      setLoadingParent?.(false);
    });
  };

  return (
    <Spin spinning={false}>
      <Row gutter={24}>
        <Col span={24}>
          <Typography style={{ fontSize: "18px", fontWeight: "600", color: "var(--color-primary-9)" }}>
            Thông tin tài liệu
          </Typography>
        </Col>
      </Row>
      <Row gutter={22}>
        <Col span={12}>
          <FormSelect
            selectType="selectApi"
            label={"Mức độ bảo mật"}
            src="api/danh-muc-cap-do/get-all?pageSize=50"
            labelField="ten"
            valueField="id"
            defaultFirstOption
            allOptionLabel=""
            required
            placeholder="Chọn mức độ bảo mật tài liệu"
            value={mucDo}
            onChange={(val: any) => SetMucDo(val)}
          />
        </Col>
        <Col span={12}>
          <FormSelect
            selectType="selectApi"
            label={"Phòng ban"}
            src="api/danh-muc-phong-ban"
            labelField="ten"
            valueField="id"
            defaultFirstOption
            allOptionLabel=""
            required
            placeholder="Chọn phòng ban lưu trữ tài liệu"
            value={phongBan}
            onChange={(val: any) => SetPhongBan(val)}
          />
        </Col>
      </Row>
      <div className="modal-content">
        <div className="modal-body">
          <div style={{ textAlign: "center" }}>
            <div
              id="upload-dragger-rg"
              className={`upload-dragger-container ${
                dragging ? "dragging" : ""
              }`}
              style={{
                marginTop: "0px",
                borderRadius: "12px",
                padding: "10px 10px",
                border: dragging
                  ? "2px dashed var(--color-primary-8)"
                  : "2px dashed #d1d1d1",
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <center>
                <div
                  className="ant-upload-zone"
                  style={{
                    width: "40%",
                    borderRadius: "10px",
                    backgroundColor: dragging
                      ? "var(--color-primary-8) !important"
                      : "white",
                    color: dragging ? "white" : "black",
                  }}
                >
                  {/* <p className="ant-upload-drag-icon">
                                        <img src="/assets/icons/common/upload-cloud-fill.svg" alt="cloud" style={{ fontSize: 48, color: 'var(--color-primary-5)', textAlign: "center" }} />
                                    </p> */}

                  <p className="ant-upload-drag-icon">
                    <UploadOutlined
                      size={48} // Tùy chỉnh kích thước icon
                      color="var(--color-btn-primary-bg-normal)" // Tùy chỉnh màu sắc
                      // Tùy chỉnh thêm
                    />
                  </p>
                  <p className="title-dragger-upload">Thả file để tải lên</p>
                </div>
              </center>
              <p style={{ color: "gray" }}>Hoặc</p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "55px",
                }}
              >
                {template && template !== "" && isEditFormNew === false ? (
                  <ButtonCustom
                    text="Tải file mẫu"
                    variant="outlined"
                    disabled={loading}
                    style={{ border: "0px" }}
                    icon={<DownloadOutlined />}
                    // onClick={handleDownloadTemplate}
                  />
                ) : (
                  ""
                )}
                <div style={{ marginLeft: "10px" }}></div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={(acceptedFileTypes ?? []).join(",")}
                  multiple
                  style={{ display: "none" }}
                  id="file-upload-input"
                />
                <label htmlFor="file-upload-input">
                  <ButtonCustom
                    text={
                      isEditFormNew === true
                        ? "Chọn file thay thế"
                        : "Chọn file"
                    }
                    variant="solid"
                    style={{
                      marginRight: "15px",
                    }}
                    onClick={handleChoosefile}
                    disabled={loading}
                  />
                </label>
              </div>
              {/* <Row justify="center">
                <Col style={{ width: "100%", textAlign: "left" }}>
                  {maxSizeConfig === 0 && (
                    <p style={{ marginTop: "10px" }}>
                      File đính kèm là dạng file {acceptedFileTypes}. Không giới
                      hạn dung lượng
                    </p>
                  )}
                  {maxSizeConfig !== 0 && (
                    <p style={{ marginTop: "10px" }}>
                      File đính kèm là dạng file {acceptedFileTypes}. Dung lượng
                      không quá {maxSizeConfig ?? 10}MB
                    </p>
                  )}
                  {pattern && (
                    <p style={{ marginTop: "10px" }}>
                      Quy tắc đặt tên file: {newPattern.join(" hoặc ")}
                      {acceptedFileTypes?.join("/")}
                    </p>
                  )}
                  {itemRecord && restProps.isSameName === true && (
                    <p style={{ marginTop: "10px" }}>
                      File upload phải trùng tên với file đã có{" "}
                      {itemRecord[tenTepFieldName ?? "ten_tep"]}
                    </p>
                  )}
                  {itemRecord && restProps.isSameName !== true && (
                    <p style={{ marginTop: "10px" }}>
                      File {itemRecord[tenTepFieldName ?? "ten_tep"]} sẽ được
                      thay mới. File mới phải cùng tên file cũ.
                    </p>
                  )}
                  {note?.map((text, index) => (
                    <p style={{ marginTop: "10px" }} key={index}>
                      {text}
                    </p>
                  ))}
                </Col>
              </Row> */}
            </div>
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "24px 0px 0",
                }}
              >
                <LoadingOutlined />
                <span
                  style={{
                    margin: "0 6px",
                    color: "var(--color-btn-primary-bg-normal)",
                    fontWeight: "600",
                    lineHeight: "22px",
                  }}
                >
                  {" "}
                  {excelProgress?.current > 0
                    ? "Đang xử lý file"
                    : "Đang tải file"}
                </span>
              </div>
            )}
            {loading && excelProgress?.current > 0 && (
              <div style={{ width: "99%" }}>
                <Progress
                  percent={parseInt(
                    "" +
                      (100 * (excelProgress?.current + 1)) /
                        excelProgress?.total
                  )}
                />
              </div>
            )}
            <p
              style={{ textAlign: "left", fontSize: "16px", color: "red" }}
              id="err-message"
            ></p>
            <div className="uploaded-file-info1" style={{ marginTop: "16px" }}>
              {files?.length >= 0 && (
                <TableData
                  dataColumns={columns}
                  dataTable={files}
                  pageSize={pageSize}
                  pageNumber={pageNumber}
                  setPageNumber={(page: number) => {
                    setPageNumber(page);
                  }}
                  setPageSize={setPageSize}
                  totalRecords={totalRecords}
                  pagination={!true}
                  hideSelection={false}
                  handleTableChangeProps={() => {}}
                />
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            gap: "8px",
          }}
        >
          <Button
            variant="outlined"
            disabled={loading}
            onClick={() => handleClose(true)}
          >
            Đóng
          </Button>

          <ButtonCustom text="Tải lên" onClick={handleOk} />
        </div>
      </div>
    </Spin>
  );
};

export default UploadFileCustom;
