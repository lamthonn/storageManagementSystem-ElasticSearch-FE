import { Button, Col, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import FormItemInput from "../../../Components/form-input/FormInput";
import TableComponent from "../../../Components/table";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import ButtonCustom from "../../../Components/button/button";
import ShowToast from "../../../Components/show-toast/ShowToast";
interface ModalAddNhomNguoiDungProp {
  isOpen: boolean;
  setIsOpen: (val: any) => void;
  setSelectedRowKeysNguoiDung: (val: any) => void;
  selectedRowKeysNguoiDung: any[];
}
const ModalAddNhomNguoiDung: React.FC<ModalAddNhomNguoiDungProp> = ({
  isOpen,
  setIsOpen,
  setSelectedRowKeysNguoiDung,
  selectedRowKeysNguoiDung,
}) => {
  const [selectionNguoiDungInModal, setSelectionNguoiDungInModal] = useState<
    any[] | null
  >(null);
  useEffect(() => {
    setSelectionNguoiDungInModal(selectedRowKeysNguoiDung);
  }, [selectedRowKeysNguoiDung]);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<string | undefined>(undefined);

  const column = [
    {
      title: "Mã nhóm người dùng",
      dataIndex: "ma",
      key: "ma",
      width: "40%",
    },
    {
      title: "Tên nhóm người dùng",
      dataIndex: "ten",
      key: "ten",
      width: "40%",
    },
  ];
  const handleChange = (val: any) => {
    setDataSearch(val.target.value);
  };

  useEffect(() => {
    setIsRefreshData(!isRefreshData);
  }, [dataSearch]);

  const handleSaveNguoiDung = () => {
    if (selectionNguoiDungInModal && selectionNguoiDungInModal.length > 0) {
      setSelectedRowKeysNguoiDung(selectionNguoiDungInModal);
      setIsOpen(false);
    } else {
      ShowToast(
        "warning",
        "Thông báo",
        "Vui lòng chọn nhóm người dùng trước khi lưu",
        3
      );
    }
  };
  return (
    <>
      <Modal
        open={isOpen}
        title="Danh sách nhóm người dùng"
        width={900}
        footer={
          <div style={{ textAlign: "center" }}>
            <Button
              style={{ fontSize: "16px", marginRight: "8px" }}
              onClick={() => setIsOpen(false)}
            >
              Đóng
            </Button>
            <ButtonCustom text="Lưu" onClick={handleSaveNguoiDung} />
          </div>
        }
        centered
        onCancel={() => setIsOpen(false)}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Input
              onChange={handleChange}
              value={dataSearch}
              addonAfter={<SearchOutlined />}
              style={{ marginBottom: "10px" }}
            />
          </Col>
        </Row>
        {/* table */}
        <TableComponent
          refreshData={isRefreshData}
          columns={column}
          src="api/nhom-nguoi-dung/get-all"
          request={{
            keySearch: dataSearch,
          }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectionNguoiDungInModal ? selectionNguoiDungInModal.map(item => item.id) : [],
            onChange: (selectedRowKeys: any, record: any) => {
              setSelectionNguoiDungInModal(record);
            },
          }}
        />
      </Modal>
    </>
  );
};

export default ModalAddNhomNguoiDung;
