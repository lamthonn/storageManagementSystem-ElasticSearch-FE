import { Pagination, Table } from "antd";
import { PaginationProps } from "antd/lib";
import { useEffect, useState } from "react";
import { axiosConfig } from "../../Utils/configApi";

interface TableComponentProps {
  columns: any[];
  dataSource?: any[];
  pagination?: { pageSize: number; total: number };
  rowSelection?: any;
  src?: string;
  request?: any;
  refreshData?: any;
}

const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  dataSource,
  pagination,
  rowSelection,
  src,
  request,
  refreshData
}) => {
  const [newColumn, setNewColumn] = useState<any[]>(columns);
  const [data, setData] = useState<any[]>([]); // state data
  const [totalRecord, setTotalRecord] = useState<number>(0); // state tổng số bản ghi
  const [current, setCurrent] = useState<number>(1); // state trang hiện tại
  const [pageSize, setPageSize] = useState<number>(10); // state kích thước trang


  useEffect(() => {
    const sttColumn = {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_: any, __: any, index: number) => ((current - 1) * pageSize + index + 1),
      width: "10%",
      align: "center",
    };
    setNewColumn([sttColumn, ...columns]);
  }, [columns, current, pageSize]);

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setPageSize(pageSize);
  };

  const handleChangeCurrent = (page: number) => {
    setCurrent(page);
  }

  //gọi api get dữ liệu
  const getData = () =>{
    axiosConfig.get(src, { params: {...request, pageNumber: current ?? 1, pageSize: pageSize ?? 10} })
      .then((response:any) => {
        setData(response.data.items);
        setCurrent(response.data.pageIndex);
        setTotalRecord(response.data.totalRecord);
        setPageSize(response.data.pageSize);
      })
      .catch((error:any) => {
        console.log(error);
      });
  }

  useEffect(()=> {
    getData()
  }, [refreshData, current, pageSize])

  return (
    <>
      <Table
        columns={newColumn}
        dataSource={dataSource ? dataSource : data}
        pagination={false}
        rowSelection={rowSelection}
        rowKey="id"
      />
      <Pagination
        style={{marginTop: '16px'}}
        align="end"
        defaultCurrent={1}
        total={totalRecord}
        current={current}
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        onChange={handleChangeCurrent}
      />
    </>
  );
};

export default TableComponent;
