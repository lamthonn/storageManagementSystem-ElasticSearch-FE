import {
  CaretDownOutlined,
  CloseOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import {
  Button,
  Empty,
  Input,
  Spin,
  TreeSelect,
  Typography,
  Skeleton,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { axiosConfig } from "../../Utils/configApi";

type TreeDataNode = {
  title: string;
  value: string;
  children?: TreeDataNode[];
};

type TreeSelectProps = {
  itemRecord?: any;
  onChange?: (value: string | number | null | undefined) => void;
  defaultValue?: string | number | null | undefined;
  treeData?: TreeDataNode[];
  value?: string | number | null | undefined;
  placeholder?: string;
  showCheckedStrategy?: "SHOW_CHILD" | "SHOW_PARENT" | "SHOW_ALL";
  label?: string;
  required?: boolean;
  labelStyle?: React.CSSProperties;
  treeCheckable?: boolean;
  style?: React.CSSProperties;
  treeDataApi?: string;
  filterFKState?: any;
  filterFK?: any;
  filterFKDefault?: any;
  searchField?:string;
  labelField?: string;
  valueField?: string | number;
  monHocId?: string;
  changeField?: string;
};

const TreeSelectCustom: React.FC<TreeSelectProps> = ({
  onChange,
  itemRecord,
  treeData, // Dữ liệu tĩnh nếu không dùng API
  value,
  defaultValue,
  placeholder,
  showCheckedStrategy = "SHOW_ALL",
  label,
  required,
  labelStyle,
  treeCheckable = false,
  treeDataApi,
  filterFKState,
  filterFK,
  filterFKDefault = "",
  style,
  labelField = "ten",
  valueField = "id",
  searchField = "ten",
  changeField,
  ...rest
}) => {

  const [dataFromApi, setDataFromApi] = useState<TreeDataNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hàm xây dựng URL từ treeDataApi và filter
  const buildApiUrl = (searchValue?: string) => {
    let url = treeDataApi || ""; // Reset URL về giá trị ban đầu
    if (filterFK && Array.isArray(filterFK) && filterFKState) {
      filterFK.forEach((fk: any, idx: number) => {
        if (filterFKState[idx] && Array.isArray(filterFKState[idx])) {
          const lstValue = filterFKState[idx]
            .map((x: any) => `${x.label}=${x.value ?? x ?? ""}`)
            .join(",");
          url = url.replaceAll(`{${fk.replace("filter_", "")}}`, lstValue);
        } else {
          const param = `${fk.replace("filter_", "")}=${
            filterFKState[idx]?.value ?? filterFKDefault
          }`;
          url += (url.includes("?") ? "&" : "?") + param; // Thêm ? cho đầu tiên, & cho sau
        }
      });
    }
    const pageSizeParam = `page_size=9999${searchValue ? `&filter={"${searchField}":"${searchValue}"}` : ''}`;
    url += (url.includes("?") ? "&" : "?") + pageSizeParam;
    return url;
  };

  // Hàm fetch dữ liệu từ API
  const getDataOptions = async (searchValue?:string) => {
    if (!treeDataApi) return; // Nếu không có API thì không fetch

    setLoading(true);
    const url = buildApiUrl(searchValue);
    await axiosConfig
      .get(url)
      .then((res: any) => {
        const convertToTree = (data: any[]): TreeDataNode[] => {
          return data.map((item) => {
            const children = item.children && item.children.length > 0 
              ? convertToTree(item.children) 
              : undefined;

            return {
              title: item[labelField],
              value: item[valueField],
              ...(children ? { children } : {}), // Chỉ thêm trường `children` nếu nó tồn tại
            };
          });
        };
        const treeData = convertToTree(res.data.data);
        if(treeData){
          setDataFromApi(treeData);
        }
      })
      .catch((err: any) => {
        console.log("Error fetching data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Chỉ gọi API khi các dependency thay đổi
  useEffect(() => {
    getDataOptions();
  }, [filterFK, changeField]);

  // Khởi tạo giá trị mặc định
  useEffect(() => {
    if ((value === undefined || value === null) && defaultValue && onChange) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  const handleClear = () => {
    onChange?.(undefined);
  };

  const onDropdownVisibleChange = (open: boolean) => {
    setDropdownOpen(open);
  };

  const handleSearch = async  (searchValue: string) => {
    // if (!treeDataApi) return;
    setDropdownOpen(true);
    await getDataOptions(searchValue);

  };

  return (
    <div className="form-tree-select-custom">
      <Typography.Text style={labelStyle || { fontSize: "16px" }}>
        {label}
      </Typography.Text>
      <TreeSelect
        showSearch
        treeData={treeDataApi ? dataFromApi : treeData} 
        value={value}
        onDropdownVisibleChange={onDropdownVisibleChange}
        onSelect={onChange}
        onChange={onChange}
        onSearch={handleSearch}
        treeCheckable={treeCheckable}
        showCheckedStrategy={showCheckedStrategy}
        placeholder={placeholder}
        open={dropdownOpen}
        style={{
          width: "100%",
          ...style, 
        }}
        allowClear={{
          clearIcon: (
            <CloseOutlined className="clearContentIcon" onClick={handleClear} />
          ),
        }}
        notFoundContent={
          loading ? (
            <Spin size="small" />
          ) : (
            <Empty
              style={{ margin: "0 auto", padding: "0 auto" }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có dữ liệu"
            />
          )
        }
        suffixIcon={<CaretDownOutlined style={{ cursor: "pointer" }} />}
        {...rest}
      />
      
    </div>
  );
};

export default TreeSelectCustom;
