import {
  Col,
  Collapse,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tag,
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
  createPhongBan,
  deleteAnyPhongBan,
  deletePhongBan,
  getPhongBanById,
  updatePhongBan,
} from "../../../services/quan-tri-danh-muc/danh-muc-phong-ban";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import FormAreaCustom from "../../../Components/text-area/FormTextArea";
import { Button } from "antd/lib";
import ShowToast from "../../../Components/show-toast/ShowToast";
import { formatDateTime, getPerms } from "../../../Utils/common";
import { routesConfig } from "../../../Routers/routes";

const QuanLyNhatKyHeThong = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState<boolean>(false);
  const [isOpenModalView, setIsOpenModalView] = useState<boolean>(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);

  //search
  const [taiKhoan, setTaiKhoan] = useState<string>("");
  const [tinhTrang, setTinhTrang] = useState<number | undefined>(undefined);
  const [ngayTao, setNgayTao] = useState<[Dayjs, Dayjs] | null>(null);
  const [hanhDong, setHanhDong] = useState<string | null>(null);
  //add
  const [form] = Form.useForm();

  //view
  const [formView] = Form.useForm();
  //edit
  const [formEdit] = Form.useForm();
  
  const [perms, setPerms] = useState<any[]>([]);
  useEffect(() => {
    getPerms(routesConfig.quanLyNhatKyHeThong)
      .then((res: any) => {
        setPerms(res.data);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
      });
  }, []);

  const handleOpenViewModal = (record: any) => {
    getPhongBanById(record.id)
      .then((response: any) => {
        formView.setFieldsValue(response.data);
        setIsOpenModalView(true);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleOpenEditModal = (record: any) => {
    getPhongBanById(record.id)
      .then((response: any) => {
        formEdit.setFieldsValue(response.data);
        setIsOpenModalEdit(true);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleDeleteConfirm = async (record: any) => {
    await deletePhongBan(record.id)
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Xóa nhật ký thành công", 3);
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        ShowToast("error", "Thông báo", "Xóa nhật ký thất bại", 3);
      });
  };

  const handleAdd = async () => {
    var ma = form.getFieldValue("ma");
    var ten = form.getFieldValue("ten");
    var trang_thai = form.getFieldValue("trang_thai");
    var mo_ta = form.getFieldValue("mo_ta");

    var data = {
      ma,
      ten,
      trang_thai,
      mo_ta,
    };

    if (ma === undefined || ten === undefined || trang_thai === undefined) {
      ShowToast(
        "warning",
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin nhật ký",
        3
      );
      return;
    }
    await createPhongBan(data)
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Thêm nhật ký thành công", 3);
        setIsOpenModalAdd(false);
        form.resetFields();
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        if (error.response.data) {
          ShowToast("warning", "Thông báo", error.response.data, 3);
        } else {
          ShowToast("error", "Thông báo", "Thêm nhật ký thất bại", 3);
        }
      });
  };

  const handleEdit = async () => {
    var id = formEdit.getFieldValue("id");
    var ma = formEdit.getFieldValue("ma");
    var ten = formEdit.getFieldValue("ten");
    var trang_thai = formEdit.getFieldValue("trang_thai");
    var mo_ta = formEdit.getFieldValue("mo_ta");

    var data = {
      id,
      ma,
      ten,
      trang_thai,
      mo_ta,
    };

    if (ma === undefined || ten === undefined || trang_thai === undefined) {
      ShowToast(
        "warning",
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin nhật ký",
        3
      );
      return;
    }
    await updatePhongBan(id, data)
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Cập nhật nhật ký thành công", 3);
        setIsOpenModalEdit(false);
        formEdit.resetFields();
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        ShowToast("error", "Thông báo", "Cập nhật nhật ký thất bại", 3);
      });
  };

  const column = [
    {
      title: "Tài khoản",
      dataIndex: "tai_khoan",
      key: "tai_khoan",
      width: "15%",
    },
    {
      title: "Nội dung",
      dataIndex: "detail",
      key: "detail",
      width: "30%",
    },
    {
      title: "Hành động",
      dataIndex: "command",
      key: "command",
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
      title: "Trạng thái",
      dataIndex: "loai",
      key: "loai",
      render: (_: any, __: any, index: number) => {
        return <span>{_ === 1 ? <Tag color="green">Information</Tag> : <Tag color="red">Error</Tag>}</span>;
      },
      width: "10%",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      fixed: "right" as "right",
      render: (text: any, record: any) => (
        <div className="action-table">
          {perms.find((x) => x === "PERM_VIEW") ? (
            <EyeOutlined
              className="action-table-view"
              onClick={() => handleOpenViewModal(record)}
            />
          ) : (
            ""
          )}
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
              title="Xóa nhật ký"
              description="Bạn có chắc chắn muốn xóa nhật ký này không?"
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
        ShowToast("success", "Thông báo", "Xóa nhật ký thành công", 3);
        setIsOpenModalDelete(false);
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        if (error.response.data) {
          ShowToast("warning", "Thông báo", error.response.data, 3);
        } else {
          ShowToast("error", "Thông báo", "Xóa nhật ký thất bại", 3);
        }
      });
  };

  return (
    <div>
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
                      value={taiKhoan}
                      label="Tài khoản"
                      placeholder="Nhập..."
                      onChange={(e) => setTaiKhoan(e.target.value)}
                    />
                  </Col>
                  <Col span={8}>
                    <FormSelect
                      value={tinhTrang}
                      label="Trạng thái"
                      selectType="normal"
                      placeholder="Chọn trạng thái"
                      options={[
                        { label: "Information", value: 1 },
                        { label: "Error", value: 2 },
                        { label: "Warrning", value: 3 },
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
                <Row gutter={22}>
                  <Col span={8}>
                    <FormSelect
                      value={tinhTrang}
                      label="Hành động"
                      selectType="normal"
                      placeholder="Chọn trạng thái"
                      options={[
                        { label: "Truy cập hệ thống", value: "DANG_NHAP" },
                        { label: "Thêm mới dữ liệu", value: "PERM_ADD" },
                        { label: "Sửa dữ liệu", value: "PERM_EdIT" },
                        { label: "Xóa dữ liệu", value: "PERM_DELETE" },
                        { label: "Phân quyền", value: "PERM_PHAN_QUYEN" },
                      ]}
                      onChange={(value) => setHanhDong(value)}
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
          Danh sách nhật ký
        </Typography.Text>
        <div>
          <Space size={"middle"}>
            {perms.find((x) => x === "PERM_ADD") ? (
              <ButtonCustom
                text="Thêm nhật ký"
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
                      "Vui lòng chọn ít nhất một nhật ký để xóa.",
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
            <p>Bạn có chắc chắn muốn xóa các nhật ký đã chọn không?</p>
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
        src="api/nhat-ky-he-thong/get-all"
        request={{
          tai_khoan: taiKhoan,
          loai: tinhTrang,
          fromDate: ngayTao ? ngayTao[0].toISOString() : null,
          toDate: ngayTao ? ngayTao[1].toISOString() : null,
          command: hanhDong,
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
        title="Thêm mới nhật ký"
        open={isOpenModalAdd}
        onCancel={() => setIsOpenModalAdd(false)}
        width={600}
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
        <Form layout="vertical" form={form}>
          <Form.Item name={"ma"}>
            <FormItemInput
              required
              label="Mã nhật ký"
              placeholder="Nhập mã nhật ký"
            />
          </Form.Item>
          <Form.Item name={"ten"}>
            <FormItemInput
              required
              label="Tên nhật ký"
              placeholder="Nhập tên nhật ký"
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

      {/* model xem */}
      <Modal
        title="Xem chi tiết nhật ký"
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
              label="Mã nhật ký"
              placeholder="Nhập mã nhật ký"
            />
          </Form.Item>
          <Form.Item name={"ten"}>
            <FormItemInput
              disabled
              required
              label="Tên nhật ký"
              placeholder="Nhập tên nhật ký"
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
        title="Sửa nhật ký"
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
              label="Mã nhật ký"
              placeholder="Nhập mã nhật ký"
            />
          </Form.Item>
          <Form.Item name={"ten"}>
            <FormItemInput
              required
              label="Tên nhật ký"
              placeholder="Nhập tên nhật ký"
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
    </div>
  );
};

export default QuanLyNhatKyHeThong;
