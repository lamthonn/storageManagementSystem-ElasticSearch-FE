import React, { FunctionComponent, useEffect, useState } from "react";
import { Empty, Pagination, PaginationProps, Table, TableColumnType, TablePaginationConfig, TableProps, Tooltip, } from "antd";

import { DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FilterValue, SorterResult, TableCurrentDataSource, } from "antd/es/table/interface";
import { FormInstance } from "antd/lib";
import "./table-data.scss"

type TableDataProps = {
  dataTable?: Array<any>;
  dataColumns?: TableColumnType<any>[];
  totalRecords?: number;
  pageNumber?: number;
  pageSize?: number;
  scroll?: { x?: number | string; y?: number | string};
  loadingTable?: boolean;
  checkEdit?: boolean;
  hideSelection?: boolean;
  rowSelection?: any;
  pagination?: boolean;
  clearRowkey?: boolean;
  selectOneRow?: boolean;
  setSelectedRowKeysProps?: (selectedRow: React.Key[]) => void;
  setPageNumber?: (pageNumber: number) => void;
  setPageSize?: (pageNumber: number) => void;
  handleTableChangeProps: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>
  ) => void;
  form?: FormInstance;
  searchValue?: string | null;
};

const TableData: FunctionComponent<TableDataProps> = ({
  dataTable,
  dataColumns,
  totalRecords,
  loadingTable,
  checkEdit,
  scroll,
  setPageNumber,
  setPageSize,
  pageNumber,
  handleTableChangeProps,
  pageSize,
  hideSelection,
  pagination,
  selectOneRow,
  setSelectedRowKeysProps,
  clearRowkey,
  form,
  searchValue,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [totalPage, setTotalPage] = useState(totalRecords);

  useEffect(() => {
    setTotalPage(totalRecords);
  }, [totalRecords]);

  useEffect(() => {
    if (clearRowkey) {
      setSelectedRowKeys([])
    }
  }, [clearRowkey]);

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys)
      if (setSelectedRowKeysProps) {
        setSelectedRowKeysProps(selectedRows);
      }
      if (form) {
        form.setFieldsValue({ nguoiDungs: selectedRowKeys });
      }
    },

    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  const onChange: PaginationProps["onChange"] = (page, pageSize) => {
    if (setPageNumber && setPageSize) {
      setPageNumber(page);
      setPageSize(pageSize);
      setTotalPage(totalRecords);
    }
  };

  const locale = {
    emptyText: (
      <span>
        {/* <p>
          <img
            className="image-empty-data"
            src="/images/empty-img-gray.png"
            alt="empty-img"
          ></img>
        </p>
        <p className="nodata-text">
          Không có dữ liệu
        </p> */}
        <Empty
          description={"Không có dữ liệu"}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </span>
    ),
    triggerDesc: "Sắp xếp theo thứ tự Z-A",
    triggerAsc: "Sắp xếp thứ tự A-Z",
    cancelSort: "Huỷ sắp xếp",
  };

  // const itemRender: PaginationProps["itemRender"] = (
  //   _,
  //   type,
  //   originalElement
  // ) => {
  //   if (type === "prev") {
  //     return <LeftOutlined />;
  //   }
  //   if (type === "next") {
  //     return <RightOutlined />;
  //   }
  //   return originalElement;
  // };

  const handleTableChange: TableProps["onChange"] = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>
  ) => {
    handleTableChangeProps(pagination, filters, sorter, extra);
  };

  const _dataSource = dataTable?.map((row, index) => {
    return {
      ...row,
      numericalOrder: pagination && pageSize && pageNumber
        ? pageSize * (pageNumber - 1) + index + 1
        : index + 1,
    };
  });

  return (
    <div className="table-wrapper">
      <Table
        size="middle"
        tableLayout="fixed"
        rowSelection={
          hideSelection
            ? { type: selectOneRow ? "radio" : "checkbox", ...rowSelection, columnWidth: 5 }
            : undefined
        }
        bordered
        columns={dataColumns}
        loading={loadingTable}
        className="table-data"
        locale={locale}
        dataSource={_dataSource}
        pagination={false}
        scroll={scroll}
        rowKey={(obj) => obj.id}
        onChange={handleTableChange}
      />
      {/* {pagination ? (
        <div>
          <Pagination
            total={totalRecords}
            pageSize={pageSize}
            current={pageNumber}
            onChange={onChange}
            itemRender={(current, type, originalElement) => {
              const lastPage =
                pageSize && totalRecords
                  ? Math.ceil(totalRecords / pageSize)
                  : 1;
              if (type !== "jump-next" && type !== "jump-prev") {
                if (type !== "prev" && current === 1 && (pageNumber ?? 1) > 4) {
                  return <Tooltip className="tool-tip" placement="bottom" title={`Trang ${current}`} color={'var(--color-tooltip-bg)'} key={`Tooltip${type}${current}`}><DoubleLeftOutlined /></Tooltip>;
                }
                if (current === lastPage && (pageNumber ?? 1) <= lastPage - 4) {
                  return <Tooltip className="tool-tip" placement="bottom" title={`Trang ${current}`} color={'var(--color-tooltip-bg)'} key={`Tooltip${type}${current}`}><DoubleRightOutlined /></Tooltip>;
                }
              }
              if (type === "prev") {
                return <Tooltip className="tool-tip" placement="bottom" title={`Trang ${current}`} color={'var(--color-tooltip-bg)'} key={`Tooltip${type}${current}`}><LeftOutlined /></Tooltip>;
              }
              if (type === "next") {
                return <Tooltip className="tool-tip" placement="bottom" title={`Trang ${current}`} color={'var(--color-tooltip-bg)'} key={`Tooltip${type}${current}`}><RightOutlined /></Tooltip>;
              }
              return originalElement;
            }}
            // showQuickJumper
            // showSizeChanger={false}
            showSizeChanger
            hideOnSinglePage={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} bản ghi`}
            locale={{
              items_per_page: '/ trang',
              jump_to: 'Đi tới',
              page: 'Trang',
              jump_to_confirm: 'xác nhận',
              next_page: "",
              prev_page: "",
            }}
          />
        </div>
      ) : null} */}
      {/* {pagination ? (
        <Pagination
          total={totalPage}
          showSizeChanger
          pageSize={pageSize}
          current={pageNumber}
          className="pagination-table"
          onChange={onChange}
          itemRender={itemRender}
          hideOnSinglePage={false}
          locale={{
            items_per_page: '/ trang',
            jump_to: 'Đi tới',
            page: 'Trang',
            jump_to_confirm: 'xác nhận',
            next_page: "",
            prev_page: "",
          }}
          showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} bản ghi`}
        />

      ) : null} */}
      {pagination ? (
        <div style={{ marginTop: '30px' }}>
          <Pagination
            total={totalRecords}
            pageSize={pageSize}
            current={pageNumber}
            onChange={onChange}
            itemRender={(current, type, originalElement) => {
              const lastPage = pageSize && totalRecords ? Math.ceil(totalRecords / pageSize) : 1;
              if (type != 'jump-next' && type != 'jump-prev') {
                if (type != "prev" && current === 1 && (pageNumber ?? 1) > 4) {
                  return <Tooltip className="tool-tip" placement="bottom" title={`Trang ${current}`} color={'var(--color-tooltip-bg)'} key={`Tooltip${type}${current}`}><DoubleLeftOutlined /></Tooltip>;
                }
                if (current === lastPage && (pageNumber ?? 1) <= lastPage - 4) {
                  return <Tooltip className="tool-tip" placement="bottom" title={`Trang ${current}`} color={'var(--color-tooltip-bg)'} key={`Tooltip${type}${current}`}><DoubleRightOutlined /></Tooltip>;
                }
              }
              if (type === "prev") {
                return <Tooltip className="tool-tip" placement="bottom" title={`Trang ${current}`} color={'var(--color-tooltip-bg)'} key={`Tooltip${type}${current}`}>

                  <LeftOutlined />
                </Tooltip>;
              }
              if (type === "next") {
                return <Tooltip className="tool-tip" placement="bottom" title={`Trang ${current}`} color={'var(--color-tooltip-bg)'} key={`Tooltip${type}${current}`}><RightOutlined /></Tooltip>;
              }
              return originalElement;
            }}
            showSizeChanger
            // hideOnSinglePage={true}
            showTotal={(total, range) => {
              return `${range[0]}-${range[1]} / ${total} bản ghi`
            }}
            locale={{
              items_per_page: '/ trang',
            }}

          />

        </div>

      ) : null
      }
    </div>
  );
};

export default TableData;


