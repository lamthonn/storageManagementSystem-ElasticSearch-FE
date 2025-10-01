import {
  Col,
  Collapse,
  DatePicker,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  Typography,
} from "antd";
import ButtonCustom from "../../../Components/button/button";
import TableComponent from "../../../Components/table";
import FormSelect from "../../../Components/select/FormSelect";
import FormItemInput from "../../../Components/form-input/FormInput";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import DatePickerCustom from "../../../Components/datepicker/DatePickerCustomOld";
import { axiosConfig } from "../../../Utils/configApi";
import {
  createCapDo,
  deleteAnyCapDo,
  deleteCapDo,
  getAllCapDo,
  getCapDoById,
  updateCapDo,
} from "../../../services/quan-tri-danh-muc/danh-muc-cap-do";
import {
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import FormAreaCustom from "../../../Components/text-area/FormTextArea";
import { Button } from "antd/lib";
import ShowToast from "../../../Components/show-toast/ShowToast";
import { formatDateTime, getPerms } from "../../../Utils/common";
import { routesConfig } from "../../../Routers/routes";
const { RangePicker } = DatePicker;

const DanhMucCapDo = () => {
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
  //add
  const [form] = Form.useForm();

  //view
  const [formView] = Form.useForm();
  //edit
  const [formEdit] = Form.useForm();

  const [perms, setPerms] = useState<any[]>([]);
  useEffect(() => {
    getPerms(routesConfig.danhMucCapDo)
      .then((res: any) => {
        console.log(res.data);
        setPerms(res.data);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
      });
  }, []);

  const handleOpenViewModal = (record: any) => {
    getCapDoById(record.id)
      .then((response: any) => {
        formView.setFieldsValue(response.data);
        setIsOpenModalView(true);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleOpenEditModal = (record: any) => {
    getCapDoById(record.id)
      .then((response: any) => {
        formEdit.setFieldsValue(response.data);
        setIsOpenModalEdit(true);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleDeleteConfirm = async (record: any) => {
    await deleteCapDo(record.id)
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Xóa cấp độ thành công", 3);
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        ShowToast("error", "Thông báo", "Xóa cấp độ thất bại", 3);
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
        "Vui lòng điền đầy đủ thông tin cấp độ",
        3
      );
      return;
    }
    await createCapDo(data)
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Thêm cấp độ thành công", 3);
        setIsOpenModalAdd(false);
        form.resetFields();
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        if (error.response.data) {
          ShowToast("warning", "Thông báo", error.response.data, 3);
        } else {
          ShowToast("error", "Thông báo", "Thêm cấp độ thất bại", 3);
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
        "Vui lòng điền đầy đủ thông tin cấp độ",
        3
      );
      return;
    }
    await updateCapDo(id, data)
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Cập nhật cấp độ thành công", 3);
        setIsOpenModalEdit(false);
        formEdit.resetFields();
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        ShowToast("error", "Thông báo", "Cập nhật cấp độ thất bại", 3);
      });
  };

  const column = [
    {
      title: "Mã cấp độ",
      dataIndex: "ma",
      key: "ma",
      width: "20%",
    },
    {
      title: "Tên cấp độ",
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
        return <span>{_ === true ? "Đang hoạt động" : "Ngừng hoạt động"}</span>;
      },
      width: "20%",
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
              title="Xóa cấp độ"
              description="Bạn có chắc chắn muốn xóa cấp độ này không?"
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
    deleteAnyCapDo(selectedRowKeys as (string | number)[])
      .then((response: any) => {
        ShowToast("success", "Thông báo", "Xóa cấp độ thành công", 3);
        setIsOpenModalDelete(false);
        setIsRefreshData(!isRefreshData);
      })
      .catch((error: any) => {
        if (error.response.data) {
          ShowToast("warning", "Thông báo", error.response.data, 3);
        } else {
          ShowToast("error", "Thông báo", "Xóa cấp độ thất bại", 3);
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
                      value={tenDM}
                      label="Tên cấp độ"
                      placeholder="Nhập tên cấp độ"
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
          Danh sách cấp độ
        </Typography.Text>
        <div>
          <Space size={"middle"}>
            {perms.find((x) => x === "PERM_ADD") ? (
              <ButtonCustom
                text="Thêm cấp độ"
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
                      "Vui lòng chọn ít nhất một cấp độ để xóa.",
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
            <p>Bạn có chắc chắn muốn xóa các cấp độ đã chọn không?</p>
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
        src="api/danh-muc-cap-do/get-all"
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
        title="Thêm mới cấp độ"
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
              label="Mã cấp độ"
              placeholder="Nhập mã cấp độ"
            />
          </Form.Item>
          <Form.Item name={"ten"}>
            <FormItemInput
              required
              label="Tên cấp độ"
              placeholder="Nhập tên cấp độ"
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
        title="Xem chi tiết cấp độ"
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
              label="Mã cấp độ"
              placeholder="Nhập mã cấp độ"
            />
          </Form.Item>
          <Form.Item name={"ten"}>
            <FormItemInput
              disabled
              required
              label="Tên cấp độ"
              placeholder="Nhập tên cấp độ"
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
        title="Sửa cấp độ"
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
              label="Mã cấp độ"
              placeholder="Nhập mã cấp độ"
            />
          </Form.Item>
          <Form.Item name={"ten"}>
            <FormItemInput
              required
              label="Tên cấp độ"
              placeholder="Nhập tên cấp độ"
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

export default DanhMucCapDo;
