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
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { Dayjs } from "dayjs";
import {
  getPerms,
} from "../../../Utils/common";
import { routesConfig } from "../../../Routers/routes";
import ShowToast from "../../../Components/show-toast/ShowToast";
import FormSelect from "../../../Components/select/FormSelect";
import ButtonCustom from "../../../Components/button/button";
import DatePickerCustom from "../../../Components/datepicker/DatePickerCustomOld";
import FormItemInput from "../../../Components/form-input/FormInput";
import UploadFileCustom from "../../../Components/modal/FormUpload";
import "./QuanLyLuuTru.scss";
import { MenuProps } from "antd/lib";
import ModalThemMoiThuMuc from "../components/ModalThemMoiThuMuc";
import {
  getManyFolder,
} from "../../../services/thu-muc";
import { jwtDecode, JwtPayload } from "jwt-decode";
import KetQuaTimKiem from "../ket-qua-tim-kiem/ket-qua-tim-kiem";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../../Layout/main-layout";

interface AuthInterface extends JwtPayload {
  id: string;
  tai_khoan: string;
}

const TaiLieuTrongThuMuc = () => {
  const navigate = useNavigate();

  //state
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isOpenModalImport, setIsOpenModalImport] = useState<boolean>(false);
  const [isOpenModalView, setIsOpenModalView] = useState<boolean>(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  //thông tin thư mục
  const [thu_muc_id, set_thu_muc_id] = useState<string>("");
  const location = useLocation();
  const ids = useMemo(() => {
    return location.pathname
      .replace(`${routesConfig.quanLyLuuTru}/`, "")
      .split("/");
  }, [location.pathname]);

  const [thuMucInfo, setThuMucInfo] = useState<any[]>([]);
  useEffect(() => {
    set_thu_muc_id(ids[ids.length - 1]);
    getManyFolder(ids.filter((item) => item !== ""))
      .then((res: any) => {
        setThuMucInfo(res.data);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
      });
  }, [ids]);
  //thông tin người dùng
  const [useId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      const decodeToken: AuthInterface = jwtDecode(token);
      setUserId(decodeToken.id);
      setUserName(decodeToken.tai_khoan);
    }
  }, []);
  //data tìm kiếm nâng cao
  const [dataAdvancedSearch, setDataAdvancedSearch] = useState<any>();
  //search state
  const [keySearch, setKeySearch] = useState<string>("");
  const [loaiTaiLieu, setLoaiTaiLieu] = useState<number | null>(null);
  const [trangThai, setTrangThai] = useState<number | null>(null);
  const [owner, setOwner] = useState<any | null>(null);
  const [keyWord, setKeyWord] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [ngayTao, setNgayTao] = useState<[Dayjs, Dayjs] | null>(null);
  const [ngayChinhSua, setNgayChinhSua] = useState<[Dayjs, Dayjs] | null>(null);
  const [isOpenModalAddFolder, setIsOpenModalAddFolder] =
    useState<boolean>(false);

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

  //các hàm khác
  const handleOpenViewModal = (record: any) => {};

  const handleOpenEditModal = (record: any) => {};

  const handleDeleteConfirm = async (record: any) => {};

  const handleEdit = async () => {};

  const handleDeleteAny = () => {};

  const handleSearchBasic = () => {
    if (keySearch.trim() !== "") {
      var dataQuery = {
        thu_muc_id: thu_muc_id ? thu_muc_id : null,
        current_user_id: useId,
        keySearch: keySearch.trim(),
      };

      setLoading(false);
      setDataAdvancedSearch(dataQuery);
    } else {
      setIsRefreshData(!isRefreshData);
    }
  };

  //Tìm kiếm nâng cao
  const handleSearchAdvanced = async () => {
    setLoading(true);
    var dataQuery = {
        thu_muc_id: thu_muc_id ? thu_muc_id : null,
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
  };

  useEffect(() => {
    //handleSearchAdvanced();
  }, [isRefreshData]);

  return (
    <MainLayout
      breadcrumb={[
        "Trang chủ",
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate(`/${routesConfig.quanLyLuuTru}`);
          }}
        >
          Quản lý lưu trữ
        </div>,
        thuMucInfo.map((item, index) => <div key={index} style={{ cursor: "pointer" }}>{item.ten}</div>),
      ]}
    >
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
                          onChange={(value) => {
                            setLoaiTaiLieu(value)
                          }}
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
            <div
              style={{ display: "flex", alignItems: "center", width: "45%" }}
            >
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
                  <Button onClick={() => setIsOpenModalDelete(false)}>
                    Hủy
                  </Button>
                  <Button type="primary" danger onClick={handleDeleteAny}>
                    Xóa
                  </Button>
                </Space>
              </Modal>
            </div>
          </div>

          {/* table */}
          {thu_muc_id && useId ? (
            <KetQuaTimKiem
              perms={perms}
              userId={useId}
              userName={userName}
              src={
                thu_muc_id &&
                useId &&
                `api/quan-ly-tai-lieu/get-docs-by-folder?thu_muc_id=${thu_muc_id}&current_user_id=${useId}`
              }
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
          ) : (
            "Loading..."
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
              thu_muc_id={thu_muc_id}
              acceptedFileTypes={[".docx", ".pdf", ".doc"]}
              handleClose={() => setIsOpenModalImport(false)}
              title="Upload tài liệu"
              isRefreshData={isRefreshData}
              setIsRefreshData={setIsRefreshData}
            />
          </Modal>

          {/* Modal thêm mới thưu mục */}
          <ModalThemMoiThuMuc
            thu_muc_id={thu_muc_id}
            isOpenModal={isOpenModalAddFolder}
            isRefreshData={isRefreshData}
            setIsOpenModal={setIsOpenModalAddFolder}
            setIsRefreshData={setIsRefreshData}
          />
        </Spin>
      </div>
    </MainLayout>
  );
};

export default TaiLieuTrongThuMuc;
