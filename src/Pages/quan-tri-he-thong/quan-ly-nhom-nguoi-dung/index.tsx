import {
  Col,
  Collapse,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import _ from "lodash";
import ButtonCustom from "../../../Components/button/button";
import TableComponent from "../../../Components/table";
import FormSelect from "../../../Components/select/FormSelect";
import FormItemInput from "../../../Components/form-input/FormInput";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import DatePickerCustom from "../../../Components/datepicker/DatePickerCustomOld";
import {
  createPhongBan,
  deleteAnyPhongBan,
  deletePhongBan,
  getPhongBanById,
  updatePhongBan,
} from "../../../services/quan-tri-danh-muc/danh-muc-phong-ban";
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import FormAreaCustom from "../../../Components/text-area/FormTextArea";
import { Button } from "antd/lib";
import ShowToast from "../../../Components/show-toast/ShowToast";
import { formatDateTime, getPerms } from "../../../Utils/common";
import PermissionModal from "./components/modalPhanQuyen";
import { axiosConfig } from "../../../Utils/configApi";
import { render } from "@testing-library/react";
import { addNhomNguoiDung, getNhomNguoiDungById, handleDeleteManyNND, handleDeleteNND, handleEditNND } from "../../../services/nhom-nguoi-dung";
import { routesConfig } from "../../../Routers/routes";

const QuanLyNhomNguoiDung = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState<boolean>(false);
  const [isOpenModalView, setIsOpenModalView] = useState<boolean>(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);

  //search
  const [tenDM, setTenDM] = useState<string>("");
  const [tinhTrang, setTinhTrang] = useState<boolean | undefined>(undefined);
  const [ngayTao, setNgayTao] = useState<[Dayjs, Dayjs] | null>(null);

  //common
  const [lstNguoiDung, setLstNguoiDung] = useState<any[]>([]);
  const [lstNguoiDungEdit, setLstNguoiDungEdit] = useState<any[]>([]);

  //add
  const [form] = Form.useForm();

  //view
  const [formView] = Form.useForm();
  //edit
  const [formEdit] = Form.useForm();
  const [perms, setPerms] = useState<any[]>([]);
    useEffect(() => {
      getPerms(routesConfig.quanLyNhomNguoiDung)
        .then((res: any) => {
          console.log(res.data);
          setPerms(res.data);
        })
        .catch((err: any) => {
          ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
        });
    }, []);

  //phan quyen
  const [isOpenModalPermission, setIsOpenModalPermission] =
    useState<boolean>(false);
  const [currentNhomNguoiDung, setCurrentNhomNguoiDung] = useState<any>();

  const handleOpenEditModal = async (record: any) => {
    await getNhomNguoiDungById(record.id)
      .then((response: any) => {
        formEdit.setFieldsValue(response.data);
        setLstNguoiDungEdit(response.data.lstNguoiDungs)
        setIsOpenModalEdit(true);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleDeleteConfirm = async (record: any) => {
    await handleDeleteNND(record.id)
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Xóa nhóm người dùng thành công", 3);
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        ShowToast("error", "Thông báo", "Xóa nhóm người dùng thất bại", 3);
      });
  };

  const handleAdd = async () => {
    setLoading(true);
    var ma = form.getFieldValue("ma");
    var ten = form.getFieldValue("ten");
    var mo_ta = form.getFieldValue("mo_ta");
    var ds_nguoi_dung = lstNguoiDung

    var data = {
      ma,
      ten,
      mo_ta,
      lstNguoiDungs: ds_nguoi_dung,
    };

    if (ma === undefined || ten === undefined || ma === "" || ten === "") {
      ShowToast(
        "warning",
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin nhóm người dùng",
        3
      );
      setLoading(false);
      return;
    }

    await addNhomNguoiDung(data)
      .then((res:any)=> {
        ShowToast("success", "Thông báo", "Thêm mới nhóm người dùng thành công", 3);
        setIsOpenModalAdd(false);
        form.resetFields();
        setLstNguoiDung([]);
        setIsRefreshData(!isRefreshData);
      })
      .catch((error:any)=> {
        console.log(error);
        if(error.response.data.includes("Mã nhóm người dùng đã tồn tại")){
          ShowToast("warning", "Thông báo", "Mã nhóm người dùng đã tồn tại", 3);
        }
        else{
          ShowToast("error", "Thông báo", "Thêm mới nhóm người dùng thất bại", 3);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = async () => {
    setLoading(true);
    var id = formEdit.getFieldValue("id");
    var ma = formEdit.getFieldValue("ma");
    var ten = formEdit.getFieldValue("ten");
    var mo_ta = formEdit.getFieldValue("mo_ta");
    var ds_nguoi_dung = lstNguoiDungEdit

    var data = {
      id,
      ma,
      ten,
      mo_ta,
      lstNguoiDungs: ds_nguoi_dung
    };

    if (ma === undefined || ten === undefined ) {
      ShowToast(
        "warning",
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin nhóm người dùng",
        3
      );
      return;
    }
    await handleEditNND(id, data)
      .then((response: any) => {
        ShowToast(
          "success",
          "Thông báo",
          "Cập nhật nhóm người dùng thành công",
          3
        );
        setIsOpenModalEdit(false);
        formEdit.resetFields();
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        ShowToast("error", "Thông báo", "Cập nhật nhóm người dùng thất bại", 3);
      })
      .finally(()=> {
        setLoading(false);
      });
  };

  const handlePhanQuyen = (record: any) => {
    setIsOpenModalPermission(true);
    setCurrentNhomNguoiDung(record);
  };

  const column = [
    {
      title: "Mã nhóm người dùng",
      dataIndex: "ma",
      key: "ma",
      width: "20%",
    },
    {
      title: "Tên nhóm người dùng",
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
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (_: any, __: any, index: number) => {
        return <span>{_ === 1 ? "Đang hoạt động" : "Ngừng hoạt động"}</span>;
      },
      width: "20%",
    },
    perms.find((x) => x === "PERM_PHAN_QUYEN")
    ? {
        title: "Phân quyền",
        dataIndex: "phan_quyen",
        key: "phan_quyen",
        render: (_: any, __: any, index: number) => {
          return (
            <div style={{ textAlign: "center", fontSize: 18 }}>
              <SettingOutlined
                style={{ cursor: "pointer" }}
                onClick={() => handlePhanQuyen(__)}
              />
            </div>
          );
        },
        width: "10%",
      }
    : {},
    {
      title: "Thao tác",
      key: "action",
      width: "7%",
      fixed: "right" as "right",
      render: (text: any, record: any) => (
        <div className="action-table">
          {perms.find((x) => x === "PERM_ADD") ? (
              <EditOutlined
                className="action-table-edit"
                onClick={() => handleOpenEditModal(record)}
              />
            ) : (
              ""
            )}

            {perms.find((x) => x === "PERM_DELETE") ? (
              <Popconfirm
                title="Xóa nhóm người dùng"
                description="Bạn có chắc chắn muốn xóa nhóm người dùng này không?"
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

  const handleDeleteMany = () => {
    handleDeleteManyNND(selectedRowKeys as (string | number)[])
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Xóa nhóm người dùng thành công", 3);
        setIsOpenModalDelete(false);
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        if (error.response.data) {
          ShowToast("warning", "Thông báo", error.response.data, 3);
        } else {
          ShowToast("error", "Thông báo", "Xóa nhóm người dùng thất bại", 3);
        }
      });
  };

  // hàm thêm người dùng vào nhóm người dùng
  const handleAddUser = async (isEdit?:boolean) => {
    setLoading(true);
    // logic thêm người dùng vào nhóm người dùng
    var lstNguoiDungs = form.getFieldValue("ds_nguoi_dung");
    if(isEdit){
      lstNguoiDungs = formEdit.getFieldValue("ds_nguoi_dung");
    }
    await axiosConfig
      .post("api/nguoi-dung/get-by-ids", lstNguoiDungs)
      .then((response: any) => {
        setLstNguoiDungEdit(response.data);
      })
      .catch((error: any) => {
        ShowToast("error", "Thông báo", "Lấy danh sách người dùng thất bại", 3);
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
                        label="Tên nhóm người dùng"
                        placeholder="Nhập tên nhóm người dùng"
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
            Danh sách nhóm người dùng
          </Typography.Text>
          <div>
            <Space size={"middle"}>
              {perms.find((x) => x === "PERM_ADD") ? (
                <ButtonCustom
                  text="Thêm nhóm người dùng"
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
                        "Vui lòng chọn ít nhất một nhóm người dùng để xóa.",
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
              <p>
                Bạn có chắc chắn muốn xóa các nhóm người dùng đã chọn không?
              </p>
              <Space style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={() => setIsOpenModalDelete(false)}>Hủy</Button>
                <Button type="primary" danger onClick={handleDeleteMany}>
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
          src="api/nhom-nguoi-dung/get-all"
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
          title="Thêm mới nhóm người dùng"
          open={isOpenModalAdd}
          onCancel={() => setIsOpenModalAdd(false)}
          width={900}
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
        >
          <Typography.Text style={{ fontWeight: "bold" }}>
            Thông tin nhóm người dùng
          </Typography.Text>
          <Form layout="vertical" form={form}>
            <Row gutter={23}>
              <Col span={12}>
                <Form.Item name={"ma"}>
                  <FormItemInput
                    required
                    label="Mã nhóm"
                    placeholder="Nhập mã nhóm người dùng"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={"ten"}>
                  <FormItemInput
                    required
                    label="Tên nhóm"
                    placeholder="Nhập tên nhóm người dùng"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name={"mo_ta"}>
                  <FormItemInput
                    label="Mô tả"
                    placeholder="Nhập mô tả nhóm người dùng"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={15}>
                <Form.Item name={"ds_nguoi_dung"}>
                  <FormSelect
                    selectType="selectApi"
                    mode="multiple"
                    src="api/nguoi-dung/get-all "
                    label="Danh sách người dùng"
                    placeholder="Chọn người dùng"
                    labelField="ten"
                    valueField="id"
                  />
                </Form.Item>
              </Col>
              <Col
                span={9}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <ButtonCustom
                  text="Thêm người dùng"
                  variant="solid"
                  style={{ height: "36px" }}
                  onClick={()=>handleAddUser()}
                />
              </Col>
            </Row>
          </Form>

          <TableComponent
            dataSource={lstNguoiDung ? lstNguoiDung : []}
            columns={[
              {
                title: "Tài khoản người dùng",
                dataIndex: "tai_khoan",
                key: "tai_khoan",
                width: "30%",
              },
              {
                title: "Họ và tên",
                dataIndex: "ten",
                key: "ten",
                width: "30%",
              },
              {
                title: "Phòng ban",
                dataIndex: "dsPhongBan",
                render: (text: any, record: any) => (
                  <span>{Array.isArray(record.dsPhongBan) ? record.dsPhongBan.join(", ") : ""}</span>
                ),
                key: "dsPhongBan",
                width: "30%",
              },
              {
                title: "Thao tác",
                dataIndex: "action",
                key: "action",
                width: "10%",
                render: (text: any, record: any) => (
                  <div className="action-table">
                    <DeleteOutlined className="action-table-delete" 
                    onClick={()=> {
                      setLstNguoiDungEdit(_.filter(lstNguoiDung, (x) => x.id !== record.id));
                    }}/>
                  </div>
                ),
              },
            ]}
          />
        </Modal>

        {/* model xem */}
        <Modal
          title="Xem chi tiết nhóm người dùng"
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
                label="Mã nhóm người dùng"
                placeholder="Nhập mã nhóm người dùng"
              />
            </Form.Item>
            <Form.Item name={"ten"}>
              <FormItemInput
                disabled
                required
                label="Tên nhóm người dùng"
                placeholder="Nhập tên nhóm người dùng"
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
          title="Sửa nhóm người dùng"
          open={isOpenModalEdit}
          onCancel={() => setIsOpenModalEdit(false)}
          width={900}
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
          <Typography.Text style={{ fontWeight: "bold" }}>
            Thông tin nhóm người dùng
          </Typography.Text>
          <Form layout="vertical" form={formEdit}>
            <Row gutter={23}>
              <Col span={12}>
                <Form.Item name={"ma"}>
                  <FormItemInput
                    required
                    label="Mã nhóm"
                    placeholder="Nhập mã nhóm người dùng"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={"ten"}>
                  <FormItemInput
                    required
                    label="Tên nhóm"
                    placeholder="Nhập tên nhóm người dùng"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name={"mo_ta"}>
                  <FormItemInput
                    label="Mô tả"
                    placeholder="Nhập mô tả nhóm người dùng"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={15}>
                <Form.Item name={"ds_nguoi_dung"}>
                  <FormSelect
                    selectType="selectApi"
                    mode="multiple"
                    src="api/nguoi-dung/get-all "
                    label="Danh sách người dùng"
                    placeholder="Chọn người dùng"
                    labelField="ten"
                    valueField="id"
                  />
                </Form.Item>
              </Col>
              <Col
                span={9}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <ButtonCustom
                  text="Thêm người dùng"
                  variant="solid"
                  style={{ height: "36px" }}
                  onClick={()=>handleAddUser(true)}
                />
              </Col>
            </Row>
          </Form>

          <TableComponent
            dataSource={lstNguoiDungEdit ? lstNguoiDungEdit : []}
            columns={[
              {
                title: "Tài khoản người dùng",
                dataIndex: "tai_khoan",
                key: "tai_khoan",
                width: "30%",
              },
              {
                title: "Họ và tên",
                dataIndex: "ten",
                key: "ten",
                width: "30%",
              },
              {
                title: "Phòng ban",
                dataIndex: "dsPhongBan",
                render: (text: any, record: any) => (
                  <span>{Array.isArray(record.dsPhongBan) ? record.dsPhongBan.join(", ") : ""}</span>
                ),
                key: "dsPhongBan",
                width: "30%",
              },
              {
                title: "Thao tác",
                dataIndex: "action",
                key: "action",
                width: "10%",
                render: (text: any, record: any) => (
                  <div className="action-table">
                    <DeleteOutlined className="action-table-delete" 
                    onClick={()=> {
                      setLstNguoiDungEdit(_.filter(lstNguoiDungEdit, (x) => x.id !== record.id));
                    }}/>
                  </div>
                ),
              },
            ]}
          />
        </Modal>

        {/* modal phân quyền */}
        <PermissionModal
          open={isOpenModalPermission}
          onClose={() => setIsOpenModalPermission(false)}
          nhomNguoiDung={currentNhomNguoiDung}
        />
      </Spin>
    </div>
  );
};

export default QuanLyNhomNguoiDung;
