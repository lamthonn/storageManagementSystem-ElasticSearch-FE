
import React, { useState } from "react";
import { Modal, Table, Radio, Button, Pagination } from "antd";

interface NhomNguoiDung {
  id: number;
  ten: string;
}

interface ModalDoiNhomNguoiDungProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedId: number) => void;
  data: NhomNguoiDung[];
  defaultId?: number;
}

const ModalDoiNhomNguoiDung: React.FC<ModalDoiNhomNguoiDungProps> = ({
  isOpen,
  onClose,
  onSave,
  data,
  defaultId,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(defaultId || null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const handleSave = () => {
    if (selectedId !== null) onSave(selectedId);
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
      title: "Nhóm người dùng",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Mặc định",
      key: "macdinh",
      align: "center" as const,
      render: (_: any, record: NhomNguoiDung) => (
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
