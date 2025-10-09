import React, { use, useEffect, useState } from "react";
import UploadFileCustom from "../../../Components/modal/FormUpload";
import {
  Button,
  Collapse,
  Dropdown,
  Form,
  Input,
  Modal,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  FolderOutlined,
  EllipsisOutlined,
  MoreOutlined,
  FileOutlined,
  FileWordOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import FormAreaCustom from "../../../Components/text-area/FormTextArea";
import ModalThemMoiThuMuc from "../components/ModalThemMoiThuMuc";
import FormSelect from "../../../Components/select/FormSelect";
import FormItemInput from "../../../Components/form-input/FormInput";
import ButtonCustom from "../../../Components/button/button";
import TableComponent from "../../../Components/table";
import { MenuProps } from "antd/lib";
import { formatDateTime, formatFileSize } from "../../../Utils/common";
import { DownloadFile, HandleShareFile } from "../../../services/tai-lieu";
import ShowToast from "../../../Components/show-toast/ShowToast";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { GetUserByDoc } from "../../../services/nguoi-dung";

type KetQuaTimKiemProps = {
  thu_muc_id?: any;
  userName: any;
  userId: any;
  queryParams: any;
  src: string;
  perms: string[];
  isRefreshData: boolean;
  formEdit: any;
  isOpenModalEdit: boolean;
  formView: any;
  isOpenModalView: boolean;
  setIsOpenModalView: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModalEdit: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: () => void;
  setSelectedRowKeys: (selectedRowKeys: React.Key[]) => void;
  handleOpenViewModal: (record: any) => void;
  handleOpenEditModal: (record: any) => void;
  handleDeleteConfirm: (record: any) => void;
};

const KetQuaTimKiem: React.FC<KetQuaTimKiemProps> = ({
  queryParams,
  thu_muc_id,
  userName,
  userId,
  perms,
  isRefreshData,
  formEdit,
  isOpenModalEdit,
  formView,
  isOpenModalView,
  src,

  setIsRefreshData,
  setIsOpenModalView,
  setIsOpenModalEdit,
  handleEdit,
  setSelectedRowKeys,
  handleOpenViewModal,
  handleOpenEditModal,
  handleDeleteConfirm,
}) => {
  //state
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsRefreshData((prev) => !prev);
  }, [queryParams]);

  // hàm download file
  const downloadFile = async (record: any) => {
    try {
      setLoading(true)      
      const response = await DownloadFile(record.thu_muc_id);
      if (!response) {
        alert("Không thể tải file");
        return;
      }

      // ✅ Lấy tên file (ưu tiên từ header nếu có)
      let fileName = record.ten || "tai-lieu.docx";

      // ✅ Tạo blob URL và tải xuống
      const blob = response.data as Blob; // đã là Blob
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // ✅ Dọn dẹp
      a.remove();
      window.URL.revokeObjectURL(url);
      setLoading(false)      

    } catch (error) {
      ShowToast("error", "Lỗi", "Đã xảy ra lỗi khi tải file!", 3);
    }
  };

  //hàm chia sẻ file
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareFile, setShareFile] = useState<any>(null);
  const [lstUserInFile, setLstUserInFile] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any[]>([]);
  const handleShareFile = (record: any) => {
    setLoading(true);
    setShareFile(record);
    setIsShareModalOpen(true);
    GetUserByDoc(record.id)
      .then((res: any) => {
        setLstUserInFile(res.data);
      })
      .catch((er: any) => {
        ShowToast("error", "Lỗi", "Có lỗi xảy ra", 3);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const hanldeOkShareDoc = () => {
    setLoading(true);
    var data = {
      ds_nguoi_dung: selectedUser,
      tai_lieu_id: shareFile.id,
    };
    HandleShareFile(data)
      .then((res: any) => {
        setSelectedUser([]);
        setIsShareModalOpen(false);
      })
      .catch((err: any) => {
        ShowToast("error", "Lỗi", "Có lỗi xảy ra", 3);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // hàm get icon
  const getIconByExtension = (extension: string) => {
    switch (extension.toLowerCase()) {
      case ".docx":
      case ".doc":
        return <FileWordOutlined />;
      case ".pdf":
        return <FilePdfOutlined />;
      case ".xlsx":
      case ".xls":
        return <FileExcelOutlined />;
      case ".jpg":
      case ".jpeg":
      case ".png":
        return <FileImageOutlined />;
      default:
        return <FileOutlined />;
    }
  };

  const column = [
    {
      title: "Tài liệu",
      dataIndex: "ten",
      key: "ten",
      width: "27%",
      render: (data: any, record: any, index: number) => {
        return (
          <span>
            {record.is_folder ? (
              <FolderOutlined />
            ) : (
              getIconByExtension(record.extension)
            )}{" "}
            {data}
          </span>
        );
      },
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "ten_chu_so_huu",
      key: "ten_chu_so_huu",
      render: (data: any, __: any, index: number) => {
        return (
          <span>
            <UserOutlined /> {data}
          </span>
        );
      },
      width: "15%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
      render: (data: any, __: any, index: number) => {
        return <span>{formatDateTime(data)}</span>;
      },
      width: "15%",
    },
    {
      title: "Sửa đổi lần cuối",
      dataIndex: "ngay_sua_doi",
      key: "ngay_sua_doi",
      render: (data: any, __: any, index: number) => {
        return <span>{formatDateTime(data)}</span>;
      },
      width: "15%",
    },
    {
      title: "Kích cỡ tệp",
      dataIndex: "kich_co_tep",
      key: "kich_co_tep",
      render: (data: any, record: any, index: number) => {
        return <span>{record.is_folder ? "-" : formatFileSize(data)}</span>;
      },
      width: "10%",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "15%",
      fixed: "right" as "right",
      render: (text: any, record: any) => {
        console.log("record:: ", record);
        
        const menuItems: MenuProps["items"] = [
          perms.includes("PERM_VIEW") && {
            key: "view",
            label: "Xem trước",
          },
          perms.includes("PERM_EDIT") &&
            record.ten_chu_so_huu === userName && {
              key: "edit",
              label: "Sửa tài liệu",
            },
          {
            key: "download",
            label: (
              <span onClick={() => downloadFile(record)}>
                Tải tài liệu xuống
              </span>
            ),
          },
          record.ten_chu_so_huu === userName && {
            key: "share",
            label: (
              <span onClick={() => handleShareFile(record)}>
                Chia sẻ tài liệu
              </span>
            ),
          },
          perms.includes("PERM_DELETE") &&
            record.ten_chu_so_huu === userName && {
              key: "delete",
              label: <span style={{ color: "red" }}>Xóa tài liệu</span>,
            },
        ].filter(Boolean) as MenuProps["items"];

        const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
          if (key === "view") handleOpenViewModal(record);
          if (key === "edit") handleOpenEditModal(record);
          if (key === "delete") {
            Modal.confirm({
              title: "Xóa tài liệu",
              content: "Bạn có chắc chắn muốn xóa tài liệu này không?",
              okText: "Có",
              cancelText: "Không",
              onOk: () => handleDeleteConfirm(record),
            });
          }
        };

        return (
          record.is_folder !== true && (
            <Dropdown
              menu={{ items: menuItems, onClick: handleMenuClick }}
              trigger={["click"]}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          )
        );
      },
    },
  ];

  return (
    <div>
      {/* table Tài liệu*/}
      <TableComponent
        refreshData={isRefreshData}
        columns={column}
        src={src}
        request={queryParams}
        rowSelection={{
          type: "checkbox",
          width: "5%",
          onChange: (selectedRowKeys: any) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
      />

      {/* model xem */}
      <Modal
        title="Xem chi tiết tài liệu"
        open={isOpenModalView}
        onCancel={() => setIsOpenModalView(false)}
        width={600}
        footer={
          <div style={{ textAlign: "center" }}>
            <Button
              style={{ fontSize: "16px", marginRight: "8px" }}
              onClick={() => setIsOpenModalView(false)}
            >
              Đóng
            </Button>
          </div>
        }
        centered
      >
        <Form layout="vertical" form={formView}>
          <Form.Item name={"ma"}>
            <FormItemInput
              disabled
              required
              label="Mã tài liệu"
              placeholder="Nhập mã tài liệu"
            />
          </Form.Item>
          <Form.Item name={"ten"}>
            <FormItemInput
              disabled
              required
              label="Tên tài liệu"
              placeholder="Nhập tên tài liệu"
            />
          </Form.Item>
          <Form.Item name={"trang_thai"}>
            <FormSelect
              disabled
              label="Trạng thái"
              selectType="normal"
              placeholder="Chọn trạng thái"
              allOptionLabel=""
              defaultFirstOption={true}
              options={[
                { label: "Đang hoạt động", value: true },
                { label: "Ngừng hoạt động", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item name={"mo_ta"}>
            <FormAreaCustom disabled label="Mô tả" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* model Sửa */}
      <Modal
        title="Sửa tài liệu"
        open={isOpenModalEdit}
        onCancel={() => setIsOpenModalEdit(false)}
        width={600}
        footer={
          <div style={{ textAlign: "center" }}>
            <Button
              style={{ fontSize: "16px", marginRight: "8px" }}
              onClick={() => setIsOpenModalEdit(false)}
            >
              Đóng
            </Button>
            <ButtonCustom text="Lưu" variant="solid" onClick={handleEdit} />
          </div>
        }
        centered
      >
        <Form layout="vertical" form={formEdit}>
          <Form.Item name={"ma"}>
            <FormItemInput
              required
              label="Mã tài liệu"
              placeholder="Nhập mã tài liệu"
            />
          </Form.Item>
          <Form.Item name={"ten"}>
            <FormItemInput
              required
              label="Tên tài liệu"
              placeholder="Nhập tên tài liệu"
            />
          </Form.Item>
          <Form.Item name={"trang_thai"}>
            <FormSelect
              label="Trạng thái"
              selectType="normal"
              placeholder="Chọn trạng thái"
              allOptionLabel=""
              defaultFirstOption={true}
              options={[
                { label: "Đang hoạt động", value: true },
                { label: "Ngừng hoạt động", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item name={"mo_ta"}>
            <FormAreaCustom label="Mô tả" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chia sẻ file */}
      <Modal
        open={isShareModalOpen}
        width={600}
        title={`Chia sẻ "${shareFile ? shareFile.ten : ""}"`}
        centered
        onCancel={() => setIsShareModalOpen(false)}
        okText="Chia sẻ"
        cancelText="Hủy"
        onOk={() => {
          hanldeOkShareDoc();
        }}
      >
        <FormSelect
          selectType="selectApi"
          src={`api/nguoi-dung/get-colleague?nguoi_dung_id=${userId}&tai_lieu_id=${
            shareFile ? shareFile.id : ""
          }`}
          labelField="ten"
          valueField={"id"}
          placeholder="Thêm người"
          style={{ width: "100%" }}
          mode="multiple"
          click_to_reload
          onChange={setSelectedUser}
        />
        <div>
          <Typography.Title level={5}>
            Những người có quyền truy cập
          </Typography.Title>
          {/* // danh sách người được chia sẻ */}
          {lstUserInFile.map((item: any) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "5px 0",
                  padding: "3px 0",
                  borderBottom: "1px solid #d9d9d999",
                }}
              >
                {item.ten}

                {/* <DeleteOutlined className="delete-outlined" /> */}
                <Tag color="geekblue">{item.ten_nhom_nguoi_dung}</Tag>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};
export default KetQuaTimKiem;
