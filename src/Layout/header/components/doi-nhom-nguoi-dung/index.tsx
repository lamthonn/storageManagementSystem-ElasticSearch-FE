
import React, { use, useEffect, useState } from "react";
import { Modal, Table, Radio, Button, Pagination } from "antd";
import { ChangeNhomNguoiDung, GetNhomNguoiDungByNguoiDungId } from "../../../../services/nguoi-dung";
import ShowToast from "../../../../Components/show-toast/ShowToast";
import { useNavigate } from "react-router-dom";
import { routesConfig } from "../../../../Routers/routes";

interface ModalDoiNhomNguoiDungProps {
  isOpen: boolean;
  onClose: () => void;
  defaultId?: number;
}

const ModalDoiNhomNguoiDung: React.FC<ModalDoiNhomNguoiDungProps> = ({
  isOpen,
  onClose,
  defaultId,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(defaultId || null);
  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  useEffect(()=> {
    setLoading(true)
    GetNhomNguoiDungByNguoiDungId()
    .then((res:any)=> {
      // Xử lý dữ liệu trả về
      setData(res.data);
      setSelectedId(res.data.find((item: any) => item.isMacDinh)?.id || null);
    })
    .catch(err => {
      // Xử lý lỗi
      console.error("Lỗi khi lấy nhóm người dùng:", err);
    })
    .finally(()=> setLoading(false));
  }, []);
  const navigate = useNavigate();

  const handleSave = () => {
    ChangeNhomNguoiDung(selectedId)
    .then((res:any)=> {
      // Xử lý dữ liệu trả về
      ShowToast("success", "Thành công", "Đổi nhóm người dùng thành công, vui lòng đăng nhập lại", 3);
      localStorage.removeItem("auth");
      navigate(routesConfig.dangNhap);
      onClose();
    })
    .catch(err => {
      // Xử lý lỗi
      ShowToast("error", "Thất bại", "Đổi nhóm người dùng thất bại", 3);
    });

  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Mã",
      dataIndex: "ma",
      key: "ma",
    },
    {
      title: "Nhóm người dùng",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Mặc định",
      key: "macdinh",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Radio
          checked={selectedId === record.id}
          onChange={() => setSelectedId(record.id)}
        />
      ),
    },
  ];

  // Dữ liệu phân trang
  const pagedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Modal
      open={isOpen}
      title="Đổi nhóm người dùng"
      centered
      width={600}
      footer={null}
      onCancel={onClose}
      loading={loading}
    >
      <Table
        dataSource={pagedData}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered={false}
        size="middle"
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <div>
          <span style={{ fontSize: 13 }}>
            {pagedData.length > 0
              ? `${(currentPage - 1) * pageSize + 1} - ${
                  (currentPage - 1) * pageSize + pagedData.length
                } / ${data.length} bản ghi`
              : "Không có dữ liệu"}
          </span>
        </div>

        <Pagination
          size="small"
          current={currentPage}
          total={data.length}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <Button onClick={onClose}>Đóng</Button>
        <Button type="primary" onClick={handleSave}>
          Lưu
        </Button>
      </div>
    </Modal>
  );
};

export default ModalDoiNhomNguoiDung;
