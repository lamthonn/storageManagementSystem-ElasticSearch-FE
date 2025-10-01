import {
  Col,
  Collapse,
  DatePicker,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import ButtonCustom from "../../../Components/button/button";
import TableComponent from "../../../Components/table";
import FormSelect from "../../../Components/select/FormSelect";
import FormItemInput from "../../../Components/form-input/FormInput";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import DatePickerCustom from "../../../Components/datepicker/DatePickerCustomOld";
import {
  deleteAnyPhongBan,
  getPhongBanById,
} from "../../../services/quan-tri-danh-muc/danh-muc-phong-ban";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd/lib";
import ShowToast from "../../../Components/show-toast/ShowToast";
import { formatDateTime, getPerms } from "../../../Utils/common";
import ModalAddNhomNguoiDung from "./modal-add-nhom-nguoi-dung";
import {
  addNguoiDung,
  deleteNguoiDung,
  getNguoiDungById,
  updateNguoiDung,
} from "../../../services/nguoi-dung";
import { routesConfig } from "../../../Routers/routes";
const { RangePicker } = DatePicker;

const QuanLyNguoiDung = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowKeysNguoiDung, setSelectedRowKeysNguoiDung] = useState<
    any[]
  >([]);
  const [selectedRowKeysNguoiDungEdit, setSelectedRowKeysNguoiDungEdit] =
    useState<any[]>([]);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState<boolean>(false);
  const [isOpenModalView, setIsOpenModalView] = useState<boolean>(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  //search
  const [tenDM, setTenDM] = useState<string>("");
  const [tinhTrang, setTinhTrang] = useState<boolean | undefined>(undefined);
  const [ngayTao, setNgayTao] = useState<[Dayjs, Dayjs] | null>(null);
  //add
  const [isOpenModalAddNND, setIsOpenModalAddNND] = useState<boolean>(false);
  const [form] = Form.useForm();
  //view
  const [formView] = Form.useForm();
  //edit
  const [isOpenModalEditNND, setIsOpenModalEditNND] = useState<boolean>(false);
  const [formEdit] = Form.useForm();

  const [perms, setPerms] = useState<any[]>([]);
  useEffect(() => {
    getPerms(routesConfig.quanLyNguoiDung)
      .then((res: any) => {
        console.log(res.data);
        setPerms(res.data);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
      });
  }, []);

  const [idsPhongban, setIdsPhongBan] = useState<any>([]);
  const [idEditNguoiDung, setIdEditNguoiDung] = useState<any>();
  const handleOpenEditModal = (record: any) => {
    setLoading(true);
    setIdEditNguoiDung(record.id)
    getNguoiDungById(record.id)
      .then((response: any) => {
        formEdit.setFieldsValue(response.data);
        setIdsPhongBan(response.data.ds_id_phong_ban);
        setSelectedRowKeysNguoiDungEdit(response.data.ds_nhom_nguoi_dung);
        setIsOpenModalEdit(true);
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteConfirm = async (record: any) => {
    await deleteNguoiDung(record.id)
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Xóa người dùng thành công", 3);
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        ShowToast("error", "Thông báo", "Xóa người dùng thất bại", 3);
      });
  };

  const handleAdd = async () => {
    setLoading(true);
    var tai_khoan = form.getFieldValue("tai_khoan");
    var ten = form.getFieldValue("ten");
    var so_dien_thoai = form.getFieldValue("so_dien_thoai");
    var gioi_tinh = form.getFieldValue("gioi_tinh");
    var email = form.getFieldValue("email");
    var ds_phong_ban = form.getFieldValue("ds_phong_ban");
    var ds_nhom_nguoi_dung = selectedRowKeysNguoiDung;

    var data = {
      tai_khoan,
      ten,
      so_dien_thoai,
      gioi_tinh,
      email,
      dsPhongBan: Array.isArray(ds_phong_ban)
        ? ds_phong_ban.map((pb: any) => {
            return {
              danh_muc_id: pb,
            };
          })
        : [],
      ds_nhom_nguoi_dung: Array.isArray(ds_nhom_nguoi_dung)
        ? ds_nhom_nguoi_dung.map((nnd: any) => {
            return {
              nhom_nguoi_dung_id: nnd.id,
              mac_dinh: nnd.mac_dinh,
            };
          })
        : [],
    };

    if (
      tai_khoan === null || ten === null || Array.isArray(data.dsPhongBan)
        ? data.dsPhongBan.length > 0
          ? false
          : true
        : true
    ) {
      ShowToast(
        "warning",
        "Thông báo",
        "Vui lòng nhập đầy đủ thông tin người dùng",
        3
      );
      setLoading(false);
    } else {
      await addNguoiDung(data)
        .then((res: any) => {
          ShowToast("success", "Thông báo", "Thêm người dùng thành công", 3);
          setIsOpenModalAdd(false);
          setSelectedRowKeysNguoiDung([]);
          form.resetFields();
          setIsRefreshData(!isRefreshData);
        })
        .catch((error: any) => {
          if (error.response.data) {
            ShowToast("warning", "Thông báo", error.response.data, 3);
          } else {
            ShowToast("error", "Thông báo", "Thêm người dùng thất bại", 3);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    var tai_khoan = formEdit.getFieldValue("tai_khoan");
    var ten = formEdit.getFieldValue("ten");
    var so_dien_thoai = formEdit.getFieldValue("so_dien_thoai");
    var gioi_tinh = formEdit.getFieldValue("gioi_tinh");
    var email = formEdit.getFieldValue("email");
    var ds_phong_ban = idsPhongban;
    var ds_nhom_nguoi_dung = selectedRowKeysNguoiDungEdit;

    var data = {
      tai_khoan,
      ten,
      so_dien_thoai,
      gioi_tinh,
      email,
      dsPhongBan: Array.isArray(ds_phong_ban)
        ? ds_phong_ban.map((pb: any) => {
            return {
              danh_muc_id: pb,
            };
          })
        : [],
      ds_phong_ban: Array.isArray(ds_phong_ban)
        ? ds_phong_ban.map((pb: any) => {
            return {
              id: pb,
            };
          })
        : [],
      ds_nhom_nguoi_dung: Array.isArray(ds_nhom_nguoi_dung)
        ? ds_nhom_nguoi_dung.map((nnd: any) => {
            return {
              nhom_nguoi_dung_id: nnd.nhom_nguoi_dung_id ?nnd.nhom_nguoi_dung_id : nnd.id,
              nguoi_dung_id: idEditNguoiDung,
              mac_dinh: nnd.mac_dinh,
            };
          })
        : [],
    };

    if (
      tai_khoan === null || ten === null || Array.isArray(data.dsPhongBan)
        ? data.dsPhongBan.length > 0
          ? false
          : true
        : true
    ) {
      ShowToast(
        "warning",
        "Thông báo",
        "Vui lòng nhập đầy đủ thông tin người dùng",
        3
      );
      setLoading(false);
    } else {
      await updateNguoiDung(idEditNguoiDung, data)
        .then((res: any) => {
          ShowToast("success", "Thông báo", "Cập nhật thông tin người dùng thành công", 3);
          setIsOpenModalEditNND(false);
          setIsOpenModalEdit(false);
          setSelectedRowKeysNguoiDungEdit([]);
          formEdit.resetFields();
          setIsRefreshData(!isRefreshData);
        })
        .catch((error: any) => {
          if (error.response.data) {
            ShowToast("warning", "Thông báo", error.response.data, 3);
          } else {
            ShowToast("error", "Thông báo", "Cập nhật thông tin người dùng thất bại", 3);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const column = [
    {
      title: "Tài khoản",
      dataIndex: "tai_khoan",
      key: "tai_khoan",
      width: "20%",
    },
    {
      title: "Tên người dùng",
      dataIndex: "ten",
      key: "ten",
      width: "20%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
      render: (data: any, __: any, index: number) => {
        return <span>{formatDateTime(data)}</span>;
      },
      width: "20%",
    },
    {
      title: "Phòng ban",
      dataIndex: "dsPhongBan",
      key: "dsPhongBan",
      width: "20%",
      render: (_: any, __: any, index: number) => {
        return __.ds_phong_ban.map((x: any) => x.ten).join(", ");
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (_: any, __: any, index: number) => {
        return <span>{_ === true ? "Đang hoạt động" : "Ngừng hoạt động"}</span>;
      },
      width: "20%",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "7%",
      fixed: "right" as "right",
      render: (text: any, record: any) => (
        <div className="action-table">
          {perms.find((x) => x === "PERM_EDIT") ? (
            <EditOutlined
              className="action-table-edit"
              onClick={() => handleOpenEditModal(record)}
            />
          ) : (
            ""
          )}
          {perms.find((x) => x === "PERM_DELETE") ? (
            <Popconfirm
              title="Xóa người dùng"
              description="Bạn có chắc chắn muốn xóa người dùng này không?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleDeleteConfirm(record)}
            >
              <DeleteOutlined className="action-table-delete" />
            </Popconfirm>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  const handleSearch = () => {
    setIsRefreshData(!isRefreshData);
  };

  const handleDeleteAny = () => {
    deleteAnyPhongBan(selectedRowKeys as (string | number)[])
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Xóa người dùng thành công", 3);
        setIsOpenModalDelete(false);
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        if (error.response.data) {
          ShowToast("warning", "Thông báo", error.response.data, 3);
        } else {
          ShowToast("error", "Thông báo", "Xóa người dùng thất bại", 3);
        }
      });
  };

  return (
    <div>
      <Spin spinning={loading}>
        {/* search */}
        <Collapse
          bordered={false}
          items={[
            {
              key: "1",
              label: "Tìm kiếm thông tin",
              children: (
                <p>
                  <Row gutter={22}>
                    <Col span={8}>
                      <FormItemInput
                        value={tenDM}
                        label="Tên người dùng"
                        placeholder="Nhập tên người dùng"
                        onChange={(e) => setTenDM(e.target.value)}
                      />
                    </Col>
                    <Col span={8}>
                      <FormSelect
                        value={tinhTrang}
                        label="Trạng thái"
                        selectType="normal"
                        placeholder="Chọn trạng thái"
                        options={[
                          { label: "Tất cả", value: "" },
                          { label: "Đang hoạt động", value: true },
                          { label: "Ngừng hoạt động", value: false },
                        ]}
                        onChange={(value) => setTinhTrang(value)}
                      />
                    </Col>
                    <Col span={8}>
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
                  </Row>
                  <Row justify="center" style={{ marginTop: 24 }}>
                    <ButtonCustom
                      text="Tìm kiếm"
                      variant="solid"
                      onClick={handleSearch}
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
          <Typography.Text
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--color-primary-9)",
            }}
          >
            Danh sách người dùng
          </Typography.Text>
          <div>
            <Space size={"middle"}>
              {perms.find((x) => x === "PERM_ADD") ? (
                <ButtonCustom
                  text="Thêm người dùng"
                  variant="solid"
                  onClick={() => setIsOpenModalAdd(true)}
                />
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
                        "Vui lòng chọn ít nhất một người dùng để xóa.",
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
              <p>Bạn có chắc chắn muốn xóa các người dùng đã chọn không?</p>
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
        <TableComponent
          refreshData={isRefreshData}
          columns={column}
          src="api/nguoi-dung/get-pagination"
          request={{
            keySearch: tenDM,
            trang_thai: tinhTrang,
            ngay_tao: ngayTao,
          }}
          rowSelection={{
            type: "checkbox",
            width: "5%",
            onChange: (selectedRowKeys: any) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
        />

        {/* modal thêm mới */}
        <Modal
          title="Thêm mới người dùng"
          open={isOpenModalAdd}
          onCancel={() => setIsOpenModalAdd(false)}
          width={1300}
          footer={
            <div style={{ textAlign: "center" }}>
              <Button
                style={{ fontSize: "16px", marginRight: "8px" }}
                onClick={() => setIsOpenModalAdd(false)}
              >
                Đóng
              </Button>

              <ButtonCustom text="Lưu" variant="solid" onClick={handleAdd} />
            </div>
          }
          centered
          loading={loading}
        >
          <Form layout="vertical" form={form}>
            <Row gutter={23}>
              <Col span={12}>
                <Form.Item name={"tai_khoan"}>
                  <FormItemInput
                    required
                    label="Tài khoản đăng nhập"
                    placeholder="Tài khoản đăng nhập"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={"ten"}>
                  <FormItemInput
                    required
                    label="Tên người dùng"
                    placeholder="Nhập tên người dùng"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={23}>
              <Col span={12}>
                <Form.Item name={"so_dien_thoai"}>
                  <FormItemInput
                    label="Số điện thoại"
                    placeholder="Số điện thoại"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={"gioi_tinh"}>
                  <FormSelect
                    selectType="normal"
                    label="Giới tính"
                    placeholder="Chọn"
                    options={[
                      {
                        label: "Nam",
                        value: true,
                      },
                      {
                        label: "Nữ",
                        value: false,
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name={"email"}>
                  <FormItemInput label="Email" placeholder="Email" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name={"ds_phong_ban"}>
                  <FormSelect
                    selectType="selectApi"
                    required
                    label="Phòng ban"
                    placeholder="Chọn"
                    mode="multiple"
                    src="api/danh-muc-phong-ban"
                    labelField="ten"
                    valueField="id"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div
              style={{
                display: "flex",
                justifyItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography.Title level={5} style={{ margin: 0 }}>
                Nhóm người dùng
              </Typography.Title>
              <ButtonCustom
                text="Thêm nhóm người dùng"
                onClick={() => {
                  setIsOpenModalAddNND(!isOpenModalAddNND);
                }}
              />
            </div>
            <TableComponent
              rowSelection={{
                type: "radio" as const,
                onChange: (selectedRowKeys: any, selectedRows: any[]) => {
                  // Cập nhật mac_dinh cho bản ghi được chọn
                  const updated = selectedRowKeysNguoiDung.map((item) => ({
                    ...item,
                    mac_dinh: selectedRows.some((row) => row.id === item.id),
                  }));

                  setSelectedRowKeysNguoiDung(updated);
                },
              }}
              dataSource={selectedRowKeysNguoiDung}
              columns={[
                {
                  title: "Mã nhóm",
                  dataIndex: "ma",
                  key: "ma",
                  width: "35%",
                },
                {
                  title: "Tên nhóm",
                  dataIndex: "ten",
                  key: "ten",
                  width: "40%",
                },
                {
                  title: "Thao tác",
                  dataIndex: "action",
                  key: "action",
                  width: "10%",
                  render: (id: any, record: any) => (
                    <div className="action-table">
                      <DeleteOutlined
                        className="action-table-delete"
                        onClick={() => {
                          setSelectedRowKeysNguoiDung(
                            selectedRowKeysNguoiDung.filter(
                              (x) => x.id !== record.id
                            )
                          );
                        }}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </Form>
          <ModalAddNhomNguoiDung
            isOpen={isOpenModalAddNND}
            setIsOpen={setIsOpenModalAddNND}
            setSelectedRowKeysNguoiDung={setSelectedRowKeysNguoiDung}
            selectedRowKeysNguoiDung={selectedRowKeysNguoiDung}
          />
        </Modal>

        {/* model Sửa */}
        <Modal
          title="Sửa người dùng"
          open={isOpenModalEdit}
          onCancel={() => setIsOpenModalEdit(false)}
          width={1300}
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
            <Row gutter={23}>
              <Col span={12}>
                <Form.Item name={"tai_khoan"}>
                  <FormItemInput
                    required
                    label="Tài khoản đăng nhập"
                    placeholder="Tài khoản đăng nhập"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={"ten"}>
                  <FormItemInput
                    required
                    label="Tên người dùng"
                    placeholder="Nhập tên người dùng"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={23}>
              <Col span={12}>
                <Form.Item name={"so_dien_thoai"}>
                  <FormItemInput
                    label="Số điện thoại"
                    placeholder="Số điện thoại"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={"gioi_tinh"}>
                  <FormSelect
                    selectType="normal"
                    label="Giới tính"
                    placeholder="Chọn"
                    options={[
                      {
                        label: "Nam",
                        value: true,
                      },
                      {
                        label: "Nữ",
                        value: false,
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name={"email"}>
                  <FormItemInput label="Email" placeholder="Email" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <FormSelect
                  selectType="selectApi"
                  required
                  label="Phòng ban"
                  placeholder="Chọn"
                  mode="multiple"
                  src="api/danh-muc-phong-ban"
                  labelField="ten"
                  valueField="id"
                  value={idsPhongban}
                  defaultValue={idsPhongban}
                  onChange={(value) => setIdsPhongBan(value)}
                />
              </Col>
            </Row>

            <div
              style={{
                display: "flex",
                justifyItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Typography.Title level={5} style={{ margin: 0 }}>
                Nhóm người dùng
              </Typography.Title>
              <ButtonCustom
                text="Thêm nhóm người dùng"
                onClick={() => {
                  setIsOpenModalEditNND(true);
                }}
              />
            </div>
            <TableComponent
              rowSelection={{
                type: "radio" as const,
                selectedRowKeys: selectedRowKeysNguoiDungEdit
                  .filter((item) => item.mac_dinh)
                  .map((item) => item.id), // chỉ lấy id của nhóm có mac_dinh=true
                onChange: (selectedRowKeys: any, selectedRows: any[]) => {
                  // Cập nhật mac_dinh cho bản ghi được chọn
                  const updated = selectedRowKeysNguoiDungEdit.map((item) => ({
                    ...item,
                    mac_dinh: selectedRows.some((row) => row.id === item.id),
                  }));

                  setSelectedRowKeysNguoiDungEdit(updated);
                },
              }}
              dataSource={selectedRowKeysNguoiDungEdit}
              columns={[
                {
                  title: "Mã nhóm",
                  dataIndex: "ma",
                  key: "ma",
                  width: "35%",
                },
                {
                  title: "Tên nhóm",
                  dataIndex: "ten",
                  key: "ten",
                  width: "40%",
                },
                {
                  title: "Thao tác",
                  dataIndex: "action",
                  key: "action",
                  width: "10%",
                  render: (id: any, record: any) => (
                    <div className="action-table">
                      <DeleteOutlined
                        className="action-table-delete"
                        onClick={() => {
                          setSelectedRowKeysNguoiDungEdit(
                            selectedRowKeysNguoiDungEdit.filter(
                              (x) => x.id !== record.id
                            )
                          );
                        }}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </Form>
          <ModalAddNhomNguoiDung
            isOpen={isOpenModalEditNND}
            setIsOpen={setIsOpenModalEditNND}
            setSelectedRowKeysNguoiDung={setSelectedRowKeysNguoiDungEdit}
            selectedRowKeysNguoiDung={selectedRowKeysNguoiDungEdit}
          />
        </Modal>
      </Spin>
    </div>
  );
};

export default QuanLyNguoiDung;
