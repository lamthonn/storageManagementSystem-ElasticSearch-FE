import React from "react";
import UploadFileCustom from "../../../Components/modal/FormUpload";
import { Button, Collapse, Dropdown, Form, Input, Modal, Space } from "antd";
import { FolderOutlined, EllipsisOutlined } from "@ant-design/icons";
import FormAreaCustom from "../../../Components/text-area/FormTextArea";
import ModalThemMoiThuMuc from "../components/ModalThemMoiThuMuc";
import FormSelect from "../../../Components/select/FormSelect";
import FormItemInput from "../../../Components/form-input/FormInput";
import ButtonCustom from "../../../Components/button/button";
import TableComponent from "../../../Components/table";

type ManHinhDefaultProps = {
    dsThuMuc: any[];
    curentFolderName: string;
    isRefreshData: boolean;
    formEdit: any;
    editingFolderId: string | null;
    isOpenModalEdit: boolean;
    menuPropsFolder: any;
    formView: any;
    column: any[];
    isOpenModalView: boolean;
    setCurrentFolderAction: (item: any) => void;
    setIsOpenModalView: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingFolderId: React.Dispatch<React.SetStateAction<string | null>>;
    setIsRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenModalEdit: React.Dispatch<React.SetStateAction<boolean>>;
    updateThuMuc: (id: string, data: any) => Promise<void>;
    handleEdit: () => void;
    setCurentFolderName: (name: string) => void;
    handleChooseFolder: (item: any) => void;
    setSelectedRowKeys: (selectedRowKeys: React.Key[]) => void;
};
const ManHinhDefault: React.FC<ManHinhDefaultProps> = ({
    dsThuMuc,
    editingFolderId,
    curentFolderName,
    isRefreshData,
    formEdit,
    isOpenModalEdit,
    menuPropsFolder,
    formView,
    column,
    isOpenModalView,
    setCurrentFolderAction,
    setIsOpenModalView,
    setEditingFolderId,
    setIsOpenModalEdit,
    setIsRefreshData,
    updateThuMuc,
    handleEdit,
    setCurentFolderName,
    handleChooseFolder,
    setSelectedRowKeys,
}) => {
  return (
    <div>
      {/* DS thư mục */}
      <Collapse
        bordered={false}
        style={{ marginBottom: "10px", backgroundColor: "transparent" }}
        defaultActiveKey={["ds-thu-muc"]}
        items={[
          {
            key: "ds-thu-muc",
            label: "Danh sách thư mục",
            children: (
              <div className="folder-list">
                {dsThuMuc.map((item: any) => {
                  return (
                    <div
                      className="folder-item"
                      onDoubleClick={() => handleChooseFolder(item)}
                    >
                      <div style={{ display: "flex" }}>
                        <FolderOutlined />
                        {editingFolderId === item.id ? (
                          <Input
                            autoFocus
                            value={curentFolderName}
                            onChange={(e) =>
                              setCurentFolderName(e.target.value)
                            }
                            onBlur={async () => {
                              if (
                                curentFolderName.trim() &&
                                curentFolderName !== item.ten
                              ) {
                                await updateThuMuc(item.id, {
                                  id: item.id,
                                  ten: curentFolderName,
                                });
                                setIsRefreshData((prev) => !prev);
                              }
                              setEditingFolderId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                          />
                        ) : (
                          <span
                            onClick={() => {
                              setCurentFolderName(item.ten);
                              setEditingFolderId(item.id);
                            }}
                            style={{ marginLeft: "7px" }}
                          >
                            {item.ten}
                          </span>
                        )}
                      </div>

                      <Dropdown menu={menuPropsFolder} trigger={["click"]}>
                        <Button
                          variant="solid"
                          type="text"
                          className="iconMore"
                          onClick={() => setCurrentFolderAction(item)}
                        >
                          <Space>
                            <EllipsisOutlined />
                          </Space>
                        </Button>
                      </Dropdown>
                    </div>
                  );
                })}
              </div>
            ),
          },
        ]}
      />
      {/* table Tài liệu*/}
      <Collapse
        bordered={false}
        style={{ marginBottom: "10px", backgroundColor: "transparent" }}
        defaultActiveKey={["ds-tai-lieu"]}
        items={[
          {
            key: "ds-tai-lieu",
            label: "Danh sách tài liệu",
            children: (
              <div>
                <TableComponent
                  refreshData={isRefreshData}
                  columns={column}
                  src="api/quan-ly-tai-lieu/get-all"
                  request={{}}
                  rowSelection={{
                    type: "checkbox",
                    width: "5%",
                    onChange: (selectedRowKeys: any) => {
                      setSelectedRowKeys(selectedRowKeys);
                    },
                  }}
                />
              </div>
            ),
          },
        ]}
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
    </div>
  );
};
export default ManHinhDefault;
