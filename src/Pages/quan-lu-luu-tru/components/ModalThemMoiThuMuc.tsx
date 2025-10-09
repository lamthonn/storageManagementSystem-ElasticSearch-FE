import { Modal } from "antd";
import React, { useState } from "react";
import FormItemInput from "../../../Components/form-input/FormInput";
import { axiosConfig } from "../../../Utils/configApi";
import { addThuMuc } from "../../../services/thu-muc";
import ShowToast from "../../../Components/show-toast/ShowToast";

type ModalThemMoiThuMucProps = {
  isOpenModal: boolean;
  thu_muc_id?: string;
  setIsOpenModal: (val: boolean) => void;
  isRefreshData: boolean;
  setIsRefreshData: (val: boolean) => void;
};

const ModalThemMoiThuMuc: React.FC<ModalThemMoiThuMucProps> = ({
  isOpenModal,
  thu_muc_id,
  setIsOpenModal,
  isRefreshData,
  setIsRefreshData,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [newFolder, setNewFolder] = useState<string>(
    "Thư mục không có tiêu đề"
  );
  const handleAddThuMuc =async () => {
    setLoading(true);
    var data = {
      ten: newFolder,
      thu_muc_cha_id: thu_muc_id || null,
    }

    await addThuMuc(data)
      .then((res:any)=> {
        ShowToast("success","Thông báo", "Thêm mới thư mục thành công", 3);
        setLoading(false);
        setIsOpenModal(false);
        setIsRefreshData(!isRefreshData)
      })
      .catch((err:any)=> {
        ShowToast("error","Thông báo", "Có lỗi xảy ra", 3);
      })
      .finally(()=> {
        setLoading(false);
      })
  }

  return (
    <Modal
      title="Thư mục mới"
      open={isOpenModal}
      onCancel={() => setIsOpenModal(false)}
      centered
      okText="Tạo"
      cancelText="Hủy"
      onOk={handleAddThuMuc}
      loading={loading}
    >
      <FormItemInput
        value={newFolder}
        onChange={(e) => setNewFolder(e.target.value)}
      />
    </Modal>
  );
};

export default ModalThemMoiThuMuc;
