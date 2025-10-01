import {
  Button,
  Col,
  Collapse,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { formatDateTime, getPerms } from "../../Utils/common";
import { routesConfig } from "../../Routers/routes";
import ShowToast from "../../Components/show-toast/ShowToast";
import FormSelect from "../../Components/select/FormSelect";
import ButtonCustom from "../../Components/button/button";
import DatePickerCustom from "../../Components/datepicker/DatePickerCustomOld";
import TableComponent from "../../Components/table";
import FormItemInput from "../../Components/form-input/FormInput";
import FormAreaCustom from "../../Components/text-area/FormTextArea";
import UploadFileCustom from "../../Components/modal/FormUpload";

const QuanLyLuuTru = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isOpenModalImport, setIsOpenModalImport] = useState<boolean>(false);
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
    getPerms(routesConfig.quanLyLuuTru)
      .then((res: any) => {
        setPerms(res.data);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
      });
  }, []);

  const handleOpenViewModal = (record: any) => {
    // getPhongBanById(record.id)
    //   .then((response: any) => {
    //     formView.setFieldsValue(response.data);
    //     setIsOpenModalView(true);
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //   });
  };

  const handleOpenEditModal = (record: any) => {
    // getPhongBanById(record.id)
    //   .then((response: any) => {
    //     formEdit.setFieldsValue(response.data);
    //     setIsOpenModalEdit(true);
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //   });
  };

  const handleDeleteConfirm = async (record: any) => {
    // await deletePhongBan(record.id)
    //   .then((response: any) => {
    //     ShowToast("success", "Thông báo", "Xóa tài liệu thành công", 3);
    //     setIsRefreshData(!isRefreshData);
    //   })
    //   .catch((error: any) => {
    //     ShowToast("error", "Thông báo", "Xóa tài liệu thất bại", 3);
    //   });
  };

  const handleAdd = async () => {
    // var ma = form.getFieldValue("ma");
    // var ten = form.getFieldValue("ten");
    // var trang_thai = form.getFieldValue("trang_thai");
    // var mo_ta = form.getFieldValue("mo_ta");

    // var data = {
    //   ma,
    //   ten,
    //   trang_thai,
    //   mo_ta,
    // };

    // if (ma === undefined || ten === undefined || trang_thai === undefined) {
    //   ShowToast(
    //     "warning",
    //     "Thông báo",
    //     "Vui lòng điền đầy đủ thông tin tài liệu",
    //     3
    //   );
    //   return;
    // }
    // await createPhongBan(data)
    //   .then((response: any) => {
    //     ShowToast("success", "Thông báo", "Thêm tài liệu thành công", 3);
    //     setIsOpenModalAdd(false);
    //     form.resetFields();
    //     setIsRefreshData(!isRefreshData);
    //   })
    //   .catch((error: any) => {
    //     if (error.response.data) {
    //       ShowToast("warning", "Thông báo", error.response.data, 3);
    //     } else {
    //       ShowToast("error", "Thông báo", "Thêm tài liệu thất bại", 3);
    //     }
    //   });
  };

  const handleEdit = async () => {
    // var id = formEdit.getFieldValue("id");
    // var ma = formEdit.getFieldValue("ma");
    // var ten = formEdit.getFieldValue("ten");
    // var trang_thai = formEdit.getFieldValue("trang_thai");
    // var mo_ta = formEdit.getFieldValue("mo_ta");

    // var data = {
    //   id,
    //   ma,
    //   ten,
    //   trang_thai,
    //   mo_ta,
    // };

    // if (ma === undefined || ten === undefined || trang_thai === undefined) {
    //   ShowToast(
    //     "warning",
    //     "Thông báo",
    //     "Vui lòng điền đầy đủ thông tin tài liệu",
    //     3
    //   );
    //   return;
    // }
    // await updatePhongBan(id, data)
    //   .then((response: any) => {
    //     ShowToast("success", "Thông báo", "Cập nhật tài liệu thành công", 3);
    //     setIsOpenModalEdit(false);
    //     formEdit.resetFields();
    //     setIsRefreshData(!isRefreshData);
    //   })
    //   .catch((error: any) => {
    //     ShowToast("error", "Thông báo", "Cập nhật tài liệu thất bại", 3);
    //   });
  };

  const column = [
    {
      title: "Mã tài liệu",
      dataIndex: "ma",
      key: "ma",
      width: "20%",
    },
    {
      title: "Tên tài liệu",
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
              title="Xóa tài liệu"
              description="Bạn có chắc chắn muốn xóa tài liệu này không?"
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
    // deleteAnyPhongBan(selectedRowKeys as (string | number)[])
    //   .then((response: any) => {
    //     ShowToast("success", "Thông báo", "Xóa tài liệu thành công", 3);
    //     setIsOpenModalDelete(false);
    //     setIsRefreshData(!isRefreshData);
    //   })
    //   .catch((error: any) => {
    //     if (error.response.data) {
    //       ShowToast("warning", "Thông báo", error.response.data, 3);
    //     } else {
    //       ShowToast("error", "Thông báo", "Xóa tài liệu thất bại", 3);
    //     }
    //   });
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
                      label="Tên tài liệu"
                      placeholder="Nhập tên tài liệu"
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
          Danh sách tài liệu
        </Typography.Text>
        <div>
          <Space size={"middle"}>
            {perms.find((x) => x === "PERM_ADD") ? (
              <ButtonCustom
                text="Upload tài liệu"
                variant="solid"
                onClick={() => setIsOpenModalImport(true)}
              />
            ) : (
              ""
            )}

            {perms.find((x) => x === "PERM_ADD") ? (
              <Button
                variant="outlined"
                onClick={() => setIsOpenModalAdd(true)}
              >Thêm tài liệu</Button>
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
      <TableComponent
        refreshData={isRefreshData}
        columns={column}
        src=""
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
        title="Thêm mới tài liệu"
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

      {/* modal import */}
      <Modal 
        open={isOpenModalImport}
        width={1000}
        footer={false}
        title="Upload tài liệu"
        centered
        onCancel={()=> setIsOpenModalImport(false)}
      >
        <UploadFileCustom 
          acceptedFileTypes= {[".docx"]}
          handleClose={()=> setIsOpenModalImport(false)}
          title="Upload tài liệu"
        />
      </Modal>

    </div>
  );
};

export default QuanLyLuuTru;
