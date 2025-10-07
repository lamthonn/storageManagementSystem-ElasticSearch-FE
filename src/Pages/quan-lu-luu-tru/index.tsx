import {
  Button,
  Col,
  Collapse,
  Dropdown,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
} from "antd";
import {
  ControlOutlined,
  SearchOutlined,
  FolderOutlined,
  PlusCircleOutlined,
  FileAddOutlined,
  EllipsisOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { formatDateTime, formatFileSize, getPerms } from "../../Utils/common";
import { routesConfig } from "../../Routers/routes";
import ShowToast from "../../Components/show-toast/ShowToast";
import FormSelect from "../../Components/select/FormSelect";
import ButtonCustom from "../../Components/button/button";
import DatePickerCustom from "../../Components/datepicker/DatePickerCustomOld";
import TableComponent from "../../Components/table";
import FormItemInput from "../../Components/form-input/FormInput";
import FormAreaCustom from "../../Components/text-area/FormTextArea";
import UploadFileCustom from "../../Components/modal/FormUpload";
import "./QuanLyLuuTru.scss";
import { MenuProps } from "antd/lib";
import ModalThemMoiThuMuc from "./components/ModalThemMoiThuMuc";
import {
  deleteThuMuc,
  getAllThuMuc,
  updateThuMuc,
} from "../../services/thu-muc";
import { AdvancedSearch, DownloadFile, GetAllTaiLieu } from "../../services/tai-lieu";
import { jwtDecode, JwtPayload } from "jwt-decode";
import ManHinhDefault from "./man-hinh-chinh";
import KetQuaTimKiem from "./ket-qua-tim-kiem/ket-qua-tim-kiem";

interface AuthInterface extends JwtPayload {
  id: string;
}

const QuanLyLuuTru = () => {
  //thông tin người dùng
  const [useId, setUserId] = useState<string>("");
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      const decodeToken: AuthInterface = jwtDecode(token);
      setUserId(decodeToken.id);
    }
  }, []);
  //state
  const [isSearchStatus, setIsSearchStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isOpenModalImport, setIsOpenModalImport] = useState<boolean>(false);
  const [isOpenModalView, setIsOpenModalView] = useState<boolean>(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);

  //thư mục
  const [dsThuMuc, setDsThuMuc] = useState<any[]>([]);
  const [dsTaiLieu, setDsTaiLieu] = useState<any[]>([]);

  const [isOpenModalAddFolder, setIsOpenModalAddFolder] =
    useState<boolean>(false);

  const getThuMuc = () => {
    getAllThuMuc()
      .then((res: any) => {
        setDsThuMuc(res.data);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Không lấy được danh sách thư mục", 3);
      });
  };

  const getTaiLieu = () => {
    setLoading(true);

    var query = {};

    GetAllTaiLieu(query)
      .then((res: any) => {
        setDsTaiLieu(res.data);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Không lấy được danh sách tài liệu", 3);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getThuMuc();
    getTaiLieu();
  }, [isRefreshData]);

  const [keySearch, setKeySearch] = useState<string>("");
  //search
  const [loaiTaiLieu, setLoaiTaiLieu] = useState<number | null>(null);
  const [trangThai, setTrangThai] = useState<number | null>(null);
  const [owner, setOwner] = useState<any | null>(null);
  const [keyWord, setKeyWord] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [ngayTao, setNgayTao] = useState<[Dayjs, Dayjs] | null>(null);
  const [ngayChinhSua, setNgayChinhSua] = useState<[Dayjs, Dayjs] | null>(null);

  //view
  const [formView] = Form.useForm();
  //edit
  const [formEdit] = Form.useForm();

  // Get perms
  const [perms, setPerms] = useState<any[]>([]);
  useEffect(() => {
    getPerms(routesConfig.quanLyLuuTru)
      .then((res: any) => {
        setPerms(res.data);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
      });
  }, []);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "add-folder") {
      setIsOpenModalAddFolder(true);
    }

    if (e.key === "upload-file") {
      setIsOpenModalImport(true);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Thư mục mới",
      key: "add-folder",
      icon: <FolderOutlined />,
    },
    {
      label: "Tải tệp lên",
      key: "upload-file",
      icon: <FileAddOutlined />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  //action folder
  const [currentFolderAction, setCurrentFolderAction] = useState<any>();
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [curentFolderName, setCurentFolderName] = useState<string>("");
  const itemsFolderAction: MenuProps["items"] = [
    {
      label: "Xóa thư mục",
      key: "delete-folder",
    },
  ];
  const handleMenuClickFolderAction: MenuProps["onClick"] = (e) => {
    if (e.key === "delete-folder") {
      setLoading(true);
      deleteThuMuc(currentFolderAction.id)
        .then((res: any) => {
          setIsRefreshData(!isRefreshData);
        })
        .catch((err) => {
          ShowToast("error", "Thông báo", "Xóa thư mục không thành công", 3);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const menuPropsFolder = {
    items: itemsFolderAction,
    onClick: handleMenuClickFolderAction,
  };

  const handleChooseFolder = (folder: any) => {
    // Logic to filter documents based on the selected folder
    console.log("Chọn thư mục:", folder);
    ShowToast("info", "Thông báo", `Chọn thư mục: ${folder.ten}`, 2);
  };

  //các hàm khác
  const handleOpenViewModal = (record: any) => {};

  const handleOpenEditModal = (record: any) => {};

  const handleDeleteConfirm = async (record: any) => {};

  const handleEdit = async () => {};

  const column = [
    {
      title: "Tài liệu",
      dataIndex: "ten",
      key: "ten",
      width: "27%",
      render: (data: any, __: any, index: number) => {
        return <span>{data}</span>;
      },
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "nguoi_tao",
      key: "nguoi_tao",
      render: (data: any, __: any, index: number) => {
        return <span>{data}</span>;
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
      dataIndex: "ngay_chinh_sua",
      key: "ngay_chinh_sua",
      render: (data: any, __: any, index: number) => {
        return <span>{formatDateTime(data)}</span>;
      },
      width: "15%",
    },
    {
      title: "Kích cỡ tệp",
      dataIndex: "fileSize",
      key: "fileSize",
      render: (data: any, __: any, index: number) => {
        return <span>{formatFileSize(data)}</span>;
      },
      width: "10%",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "15%",
      fixed: "right" as "right",
      render: (text: any, record: any) => {
        const menuItems: MenuProps["items"] = [
          perms.includes("PERM_VIEW") && {
            key: "view",
            label: "Xem trước",
          },
          perms.includes("PERM_EDIT") && {
            key: "edit",
            label: "Sửa tài liệu",
          },
          {
            key: "download",
            label: <span onClick={() => downloadFile(record)}>Tải tài liệu xuống</span>,
          },
          {
            key: "share",
            label: <span>Chia sẻ tài liệu</span>,
          },
          perms.includes("PERM_DELETE") && {
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
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  // hàm download file
  const downloadFile = async (record: any) => {
    try {
      const response = await DownloadFile(record.id);
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
    } catch (error) {
      ShowToast("error","Lỗi","Đã xảy ra lỗi khi tải file!", 3);
    }
  };


  //search đơn giản
  const handleSearchBasic = () => {
    console.log("search đơn giản:", keySearch);
    if (keySearch.trim() !== "") {
      setIsSearchStatus(true);
      var dataQuery = {
        current_user_id: useId,
        keySearch: keySearch.trim(),
      };

      setLoading(false);
      setDataAdvancedSearch(dataQuery);
    } else {
      setIsSearchStatus(false);
      setIsRefreshData(!isRefreshData);
    }
  };

  //Tìm kiếm nâng cao
  const [dataAdvancedSearch, setDataAdvancedSearch] = useState<any>();
  const handleSearchAdvanced = async () => {
    setLoading(true);
    if (
      loaiTaiLieu ||
      trangThai ||
      owner ||
      keyWord ||
      fileName ||
      ngayTao ||
      ngayChinhSua
    ) {
      setIsSearchStatus(true);
      var dataQuery = {
        current_user_id: useId,
        loai_tai_lieu: loaiTaiLieu,
        trang_thai: trangThai,
        nguoi_dung_id: owner,
        keyWord: keyWord,
        ten_muc: fileName,
        ngay_tao_from: ngayTao ? ngayTao[0].toISOString() : null,
        ngay_tao_to: ngayTao ? ngayTao[1].toISOString() : null,
        ngay_chinh_sua_from: ngayChinhSua
          ? ngayChinhSua[0].toISOString()
          : null,
        ngay_chinh_sua_to: ngayChinhSua ? ngayChinhSua[1].toISOString() : null,
      };

      setLoading(false);
      setDataAdvancedSearch(dataQuery);
    } else {
      setIsSearchStatus(false);
      setIsRefreshData(!isRefreshData);
      setLoading(false);
    }
  };

  const handleDeleteAny = () => {};

  return (
    <div className="quan-ly-luu-tru">
      <Spin spinning={loading}>
        {/* search */}
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <ControlOutlined />}
          items={[
            {
              key: "1",
              label: "Tìm kiếm nâng cao",
              children: (
                <p>
                  <Row gutter={22}>
                    <Col span={8}>
                      <FormSelect
                        value={loaiTaiLieu}
                        label="Loại"
                        selectType="normal"
                        placeholder="Bất kỳ"
                        defaultFirstOption
                        allOptionLabel=""
                        options={[
                          { label: "Tất cả", value: 0 },
                          { label: "Tài liệu (Word)", value: 1 },
                          { label: "Bảng tính (Excel)", value: 2 },
                          { label: "PDF", value: 3 },
                          { label: "Hình ảnh", value: 4 },
                          { label: "Thư mục", value: 5 },
                        ]}
                        onChange={(value) => setLoaiTaiLieu(value)}
                      />
                    </Col>
                    <Col span={8}>
                      <FormSelect
                        value={trangThai}
                        label="Trạng thái"
                        selectType="normal"
                        placeholder="Bất kỳ"
                        defaultFirstOption
                        allOptionLabel=""
                        options={[
                          { label: "Tất cả", value: 0 },
                          { label: "Tài liệu của tôi", value: 1 },
                          { label: "Tài liệu được chia sẻ", value: 2 },
                        ]}
                        onChange={(value) => setTrangThai(value)}
                      />
                    </Col>
                    <Col span={8}>
                      <FormSelect
                        value={owner}
                        label="Chủ sở hữu"
                        selectType="selectApi"
                        placeholder="Bất kỳ ai"
                        src={`api/quan-ly-tai-lieu/get-nguoi-dung?nguoi_dung_id=${useId}`}
                        labelField="ten"
                        valueField={"id"}
                        defaultFirstOption
                        allOptionLabel="Tất cả"
                        onChange={(value) => setOwner(value)}
                      />
                    </Col>
                  </Row>
                  {/* dòng 2 */}
                  <Row gutter={22}>
                    <Col span={12}>
                      <FormItemInput
                        value={keyWord}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setKeyWord(e.target.value)
                        }
                        label="Có các từ"
                        placeholder="Nhập các từ tìm thấy trong tệp"
                      />
                    </Col>
                    <Col span={12}>
                      <FormItemInput
                        value={fileName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFileName(e.target.value)
                        }
                        label="Tên mục"
                        placeholder="Nhập một cụm từ khớp với một phần của tên tệp"
                      />
                    </Col>
                  </Row>
                  {/* dòng 3 */}
                  <Row gutter={22}>
                    <Col span={12}>
                      <DatePickerCustom
                        mode="range"
                        value={ngayTao}
                        onChange={(
                          dates: any | null,
                          dateString: [string, string]
                        ) => setNgayTao(dates)}
                        label="Ngày tạo"
                        format="DD/MM/YYYY HH:mms"
                      />
                    </Col>
                    <Col span={12}>
                      <DatePickerCustom
                        mode="range"
                        value={ngayChinhSua}
                        onChange={(
                          dates: any | null,
                          dateString: [string, string]
                        ) => setNgayChinhSua(dates)}
                        label="Ngày sửa đổi"
                        format="DD/MM/YYYY HH:mms"
                      />
                    </Col>
                  </Row>
                  <Row justify="center" style={{ marginTop: 24 }}>
                    <ButtonCustom
                      text="Tìm kiếm"
                      variant="solid"
                      onClick={handleSearchAdvanced}
                    />
                  </Row>
                </p>
              ),
            },
          ]}
        />
        <br />
        {/* action */}
        <div className="action-buttons">
          <div style={{ display: "flex", alignItems: "center", width: "45%" }}>
            <Input
              value={keySearch}
              style={{ border: "1px solid #9ca3af" }}
              suffix={<SearchOutlined />}
              placeholder="Tìm trong danh sách tài liệu"
              onChange={(e) => setKeySearch(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  // handle search
                  handleSearchBasic();
                }
              }}
            />
          </div>
          <div>
            <Space size={"middle"}>
              {perms.find((x) => x === "PERM_ADD") ? (
                <Dropdown menu={menuProps}>
                  <Button variant="solid" type="primary">
                    <Space>
                      <PlusCircleOutlined /> Mới
                    </Space>
                  </Button>
                </Dropdown>
              ) : (
                ""
              )}

              {perms.find((x) => x === "PERM_DELETE") ? (
                <Button
                  onClick={() => {
                    if (selectedRowKeys.length > 0) {
                      setIsOpenModalDelete(true);
                    } else {
                      ShowToast(
                        "warning",
                        "Thông báo",
                        "Vui lòng chọn ít nhất một tài liệu để xóa.",
                        3
                      );
                    }
                  }}
                  danger
                >
                  Xóa
                </Button>
              ) : (
                ""
              )}
            </Space>
            <Modal
              title="Xác nhận xóa"
              open={isOpenModalDelete}
              onCancel={() => {
                setIsOpenModalDelete(false);
              }}
              width={400}
              centered
              footer={null}
            >
              <p>Bạn có chắc chắn muốn xóa các tài liệu đã chọn không?</p>
              <Space style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={() => setIsOpenModalDelete(false)}>Hủy</Button>
                <Button type="primary" danger onClick={handleDeleteAny}>
                  Xóa
                </Button>
              </Space>
            </Modal>
          </div>
        </div>

        {/* table */}
        {isSearchStatus !== true ? (
          <ManHinhDefault
            column={column}
            setSelectedRowKeys={setSelectedRowKeys}
            isRefreshData={isRefreshData}
            setIsRefreshData={setIsRefreshData}
            curentFolderName={curentFolderName}
            dsThuMuc={dsThuMuc}
            editingFolderId={editingFolderId}
            formEdit={formEdit}
            formView={formView}
            handleChooseFolder={handleChooseFolder}
            setCurrentFolderAction={setCurrentFolderAction}
            setCurentFolderName={setCurentFolderName}
            setEditingFolderId={setEditingFolderId}
            menuPropsFolder={menuPropsFolder}
            handleEdit={handleEdit}
            isOpenModalEdit={isOpenModalEdit}
            isOpenModalView={isOpenModalView}
            setIsOpenModalEdit={setIsOpenModalEdit}
            setIsOpenModalView={setIsOpenModalView}
            updateThuMuc={updateThuMuc}
          />
        ) : (
          <KetQuaTimKiem
            perms={perms}
            isRefreshData={isRefreshData}
            formEdit={formEdit}
            formView={formView}
            isOpenModalView={isOpenModalView}
            isOpenModalEdit={isOpenModalEdit}
            handleEdit={handleEdit}
            setIsRefreshData={setIsRefreshData}
            setSelectedRowKeys={setSelectedRowKeys}
            setIsOpenModalEdit={setIsOpenModalEdit}
            setIsOpenModalView={setIsOpenModalView}
            handleDeleteConfirm={handleDeleteConfirm}
            handleOpenEditModal={handleOpenEditModal}
            handleOpenViewModal={handleOpenViewModal}
            queryParams={dataAdvancedSearch}
          />
        )}

        {/* modal import */}
        <Modal
          open={isOpenModalImport}
          width={1000}
          footer={false}
          title="Upload tài liệu"
          centered
          onCancel={() => setIsOpenModalImport(false)}
        >
          <UploadFileCustom
            acceptedFileTypes={[".docx", ".pdf", ".doc"]}
            handleClose={() => setIsOpenModalImport(false)}
            title="Upload tài liệu"
            isRefreshData={isRefreshData}
            setIsRefreshData={setIsRefreshData}
          />
        </Modal>

        {/* Modal thêm mới thưu mục */}
        <ModalThemMoiThuMuc
          isOpenModal={isOpenModalAddFolder}
          isRefreshData={isRefreshData}
          setIsOpenModal={setIsOpenModalAddFolder}
          setIsRefreshData={setIsRefreshData}
        />
      </Spin>
    </div>
  );
};

export default QuanLyLuuTru;
