import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
  useRef,
} from "react";
import { Select, Form, Typography, Empty, Spin, Skeleton } from "antd";
import "./form-select.scss";
import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";
import { axiosConfig } from "../../Utils/configApi";
interface Option {
  value: string | number;
  label: string;
}

type SelectComponentProps = {
  formItemName?: any;
  ma_dinh_danh?: string;
  label?: string | any;
  required?: boolean;
  labelStyle?: any;
  selectType: "normal" | "selectApi";
  src?: string;
  labelField?: string;
  valueField?: string | number;
  sortField?: string;
  allOptionLabel?: string;
  placeholder?: string;
  options?: { value: string | number | boolean; label: string | ReactNode }[]; // Array of options with value and label
  value?: string | number | null | undefined | any | any[];
  valueRender?: string | number | null | undefined | any;
  fromRender?: boolean;
  onChange?: (value: any, option: any | any[]) => void;
  disabled?: boolean;
  style?: any;
  mode?: "multiple" | "tags"; // Allow multiple or tag selection
  allowClear?: boolean;
  defaultValue?: string | number | null | undefined;
  defaultByName?: string | number | null | undefined;
  maxCount?: number;
  limit?: number;
  sort?: string;
  showSearch?: boolean;
  onGetItems?: (items: any[]) => void;
  handleSetDataOptions?: (dataOptions: any) => void;
  filterFKState?: any;
  filterFK?: any;
  filterFKDefault?: any;
  maxTagCount?: boolean;
  className?: string;
  defaultFirstOption?: boolean;
  notFoundContent?: React.ReactNode;
  children?: any[];
  formItemStyle?: any;
  click_to_reload?: boolean;
};

const FormSelect: FunctionComponent<SelectComponentProps> = ({
  formItemName,
  ma_dinh_danh,
  label,
  required,
  labelStyle,
  selectType,
  src,
  labelField = "label",
  valueField = "value",
  sortField,
  allOptionLabel = "",
  placeholder,
  options,
  value,
  valueRender,
  fromRender,
  onChange,
  disabled,
  style,
  mode,
  allowClear,
  defaultValue,
  defaultByName,
  maxCount,
  limit,
  sort,
  showSearch,
  onGetItems,
  handleSetDataOptions,
  filterFKState,
  filterFK,
  filterFKDefault,
  maxTagCount = true,
  className,
  defaultFirstOption,
  children,
  formItemStyle,
  click_to_reload = false,
  ...rest
}) => {
  const [data, setData] = useState<Option[]>([]);
  const [newOptions, setNewOptions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setNewOptions([...(options ?? [])]);
  }, [options]);

  useEffect(() => {
    try {
      if (value) onChange?.(undefined, []); // onChange khi dang co value va FK
    } catch {}
  }, [filterFKState]);

  const getDataOptions = async (searchValue?: string) => {
    
    setData([]);
    handleSetDataOptions && handleSetDataOptions([]);

    if (ma_dinh_danh) {
      if (ma_dinh_danh.toLowerCase().includes("select "))
        ma_dinh_danh = btoa(btoa(btoa(ma_dinh_danh)));
      src = "/api/dm/danh-muc/" + ma_dinh_danh;
      labelField = "ten";
      valueField = "id";
    }

    if (src) {
      setLoading(true);
      await axiosConfig.get(`${src}`, {
        search: searchValue,
        page_size: 9999,
        page: 1,
        sort: sort ?? sortField ?? `{${labelField}: 1}`,
      })
        .then((res: any) => {
          if (valueField && labelField) {
            if (res.data.items) {
              const opts = res.data.items.map((item: any) => {
                return {
                  ...item,
                  value: item[valueField ?? 0],
                  label: item[labelField ?? 0],
                };
              });
              if (onGetItems) onGetItems?.(res.data.data);
              const distinctOptions: any[] = [
                ...(allOptionLabel && allOptionLabel !== ""
                  ? [{ value: null, label: allOptionLabel }]
                  : []),
              ];
              opts.map((item: any) => {
                if (
                  distinctOptions.filter((x: any) => x.value === item.value)
                    .length === 0
                )
                  distinctOptions.push(item);
              });
              setData([...distinctOptions]);
              setDefaultValue?.(
                distinctOptions,
                defaultFirstOption === true && (!defaultValue && !defaultByName)
                  ? distinctOptions[0][valueField]
                  : defaultValue ?? defaultByName
              );
              handleSetDataOptions &&
                handleSetDataOptions([...distinctOptions]);
            } else {
              if (!Array.isArray(res.data)) res.data = [];
              const opts = res.data?.map((item: any) => {
                return {
                  ...item,
                  value: item[valueField ?? 0],
                  label: item[labelField ?? 0],
                };
              });
              if (onGetItems) onGetItems?.(res.data);
              const distinctOptions: any[] = [
                ...(allOptionLabel && allOptionLabel !== ""
                  ? [{ value: null, label: allOptionLabel }]
                  : []),
              ];
              opts.map((item: any) => {
                if (
                  distinctOptions.filter((x: any) => x.value === item.value)
                    .length === 0
                )
                  distinctOptions.push(item);
              });
              setData([...distinctOptions]);
              setDefaultValue?.(
                distinctOptions,
                defaultFirstOption === true && (!defaultValue && !defaultByName)
                  ? distinctOptions[0][valueField]
                  : defaultValue ?? defaultByName
              );
              handleSetDataOptions &&
                handleSetDataOptions([...distinctOptions]);
            }
          }
        })
        .catch((err: any) => {
          // console.log(
          //   "có lỗi xảy ra trong FormSelect: ",
          //   err.request.responseURL,
          //   err.message
          // );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSearch = (searchValue: string) => {
    if (mode === "multiple" || mode === "tags") {
      getDataOptions(searchValue);
    }
  };

  useEffect(() => {
    if (selectType?.toLowerCase() === "selectapi" || ma_dinh_danh) {
      //clear chon
      //if (onChange) onChange(null); // remove vi tu dong valid luon
      getDataOptions();
    }
  }, [filterFKState, ma_dinh_danh, selectType]);

  useEffect(() => {
    if (options) {
      const distinctOptions: any[] = [
        ...(allOptionLabel && allOptionLabel !== ""
          ? [{ value: null, label: allOptionLabel }]
          : []),
      ];
      options?.map((item: any) => {
        if (
          distinctOptions.filter((x: any) => x.value === item.value).length ===
          0
        )
          distinctOptions.push(item);
      });
      setNewOptions([...distinctOptions]);
    } else {
    }
  }, []);

  const setDefaultValue = (distinctOptions: any[], defValue: any) => {
    if (!(defValue === undefined || defValue === null)) {
      const foundOption = distinctOptions.filter(
        (opt: any) =>
          opt[valueField] + "" === defValue + "" ||
          opt[labelField] + "" === defValue + ""
      );
      //if(defValue) => 0 hay 00 cung la false
      //defValue !== undefined &&
      if (onChange && foundOption.length > 0) {
        try {
          onChange?.(defValue, foundOption[0]);
        } catch (e: any) {
          console.log("err set def value", e);
        }
      }
    }
  };

  useEffect(() => {
    let distinctOptions: any[] = [...data];
    if (distinctOptions && distinctOptions.length > 0) {
      //debugger
      if (value === undefined || value === null) {
        setDefaultValue?.(
          distinctOptions,
          defaultFirstOption === true && (!defaultValue && !defaultByName)
            ? distinctOptions[0][valueField]
            : defaultValue ?? defaultByName
        );
      } else {
        setDefaultValue?.(
          distinctOptions,
          defaultFirstOption === true && (!defaultValue && !defaultByName)
            ? value ?? distinctOptions[0][valueField]
            : value ?? defaultValue ?? defaultByName
        );
      }
    }
  }, [data]);

  useEffect(() => {
    let distinctOptions: any[] = [...newOptions];
    if (
      (value === undefined || value === null) &&
      distinctOptions &&
      distinctOptions.length > 0
    ) {
      //debugger
      //if (value === undefined || value === null) {
      setDefaultValue?.(
        distinctOptions,
        defaultFirstOption === true && (!defaultValue && !defaultByName)
          ? distinctOptions[0][valueField]
          : defaultValue ?? defaultByName
      );
      //}
    }
  }, [newOptions]);
  //để có thể tìm kiếm tương đối đối với type = selectApi
  const normalizeString = (str: string) => {
    return str
      .normalize("NFD") // Chuẩn hóa Unicode
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .toLowerCase(); // Chuyển về chữ thường
  };

  const selectRef: any = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSuffixIconClick = () => {
    if (selectRef.current) {
      selectRef.current.blur(); // To ensure the dropdown closes if already open
      selectRef.current.focus(); // Then re-focus to toggle the dropdown open
      setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
    }
  };

  const onDropdownVisibleChange = (open: any) => {
    setDropdownOpen(open);
    if (open && click_to_reload) {
      getDataOptions();
    }
  };

  if (label && label + "" != "")
    return (
      <>
        {loading === true && mode === null ? (
          <Skeleton.Input active={loading} block />
        ) : (
          <Form.Item
            style={formItemStyle}
            name={formItemName}
            className="form-item"
          >
            <Typography.Text style={labelStyle || { fontSize: "16px" }}>
              {label}{" "}
              {required === true ? (
                <span className="required-star" style={{ color: "red" }}>
                  {" "}
                  *
                </span>
              ) : (
                ""
              )}
            </Typography.Text>
            {selectType === "normal" ? (
              <Select
                className={className ?? "style-select-default"}
                placeholder={placeholder}
                options={newOptions}
                ref={selectRef}
                open={dropdownOpen}
                onDropdownVisibleChange={(open) => setDropdownOpen(open)}
                suffixIcon={
                  <CaretDownOutlined
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent default behavior
                      handleSuffixIconClick();
                    }}
                  />
                }
                value={
                  fromRender === true
                    ? valueRender ?? value
                    : value != undefined
                    ? value
                    : defaultValue
                }
                defaultValue={defaultValue || null} // kg load dc lan 2
                onChange={onChange}
                disabled={disabled}
                style={style}
                mode={mode}
                maxCount={maxCount}
                // maxTagCount={maxTagCount ? 'responsive' : undefined}
                allowClear={
                  mode === "multiple" || mode === "tags"
                    ? {
                        clearIcon: (
                          <CloseOutlined className="clearContentIcon" />
                        ),
                      }
                    : false
                }
                showSearch={showSearch}
                optionFilterProp="label"
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
                {...rest}
              >
                {options &&
                  options?.map((option) => (
                    <Select.Option
                      className={className ?? "style-select-default"}
                      key={
                        typeof option.value === "boolean"
                          ? option.value
                            ? 1
                            : 0
                          : option.value
                      }
                      value={option.value}
                    >
                      <span style={{ fontSize: "16px" }}>{option.label}</span>
                    </Select.Option>
                  ))}
              </Select>
            ) : (
              <Select
                className={className ?? "style-select-default"}
                placeholder={placeholder}
                value={
                  fromRender === true
                    ? valueRender ?? value
                    : value != undefined
                    ? value
                    : defaultValue
                }
                defaultValue={defaultValue || null} // kg load dc lan 2
                options={data}
                ref={selectRef}
                open={dropdownOpen}
                onDropdownVisibleChange={onDropdownVisibleChange}
                suffixIcon={
                  <CaretDownOutlined
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent default behavior
                      handleSuffixIconClick();
                    }}
                  />
                }
                onChange={onChange}
                disabled={disabled}
                style={style}
                mode={mode}
                showSearch
                onSearch={handleSearch}
                maxCount={maxCount}
                virtual={true}
                allowClear={
                  mode === "multiple" || mode === "tags"
                    ? {
                        clearIcon: (
                          <CloseOutlined className="clearContentIcon" />
                        ),
                      }
                    : false
                }
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
                filterOption={(inputValue, option) => {
                  const normalizedInput = normalizeString(inputValue);
                  const normalizedLabel = normalizeString(option?.label || "");
                  return normalizedLabel.includes(normalizedInput);
                }}
                {...rest}
              />
            )}
          </Form.Item>
        )}
      </>
    );
  else {
    if (selectType === "normal")
      return (
        <>
          <Select
            className={className ?? "style-select-default"}
            placeholder={placeholder}
            options={newOptions}
            ref={selectRef}
            open={dropdownOpen}
            onDropdownVisibleChange={(open) => setDropdownOpen(open)}
            suffixIcon={
              <CaretDownOutlined
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent default behavior
                  handleSuffixIconClick();
                }}
              />
            }
            value={
              fromRender === true
                ? valueRender ?? value
                : value != undefined
                ? value
                : defaultValue
            }
            defaultValue={defaultValue || null} // kg load dc lan 2
            onChange={onChange}
            disabled={disabled}
            style={style}
            mode={mode}
            maxCount={maxCount}
            // maxTagCount={maxTagCount ? 'responsive' : undefined}
            allowClear={
              mode === "multiple" || mode === "tags"
                ? {
                    clearIcon: <CloseOutlined className="clearContentIcon" />,
                  }
                : false
            }
            showSearch={showSearch}
            optionFilterProp="label"
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
            {...rest}
          >
            {newOptions &&
              newOptions?.map((option: any) => (
                <Select.Option
                  className={className ?? "style-select-default"}
                  key={
                    typeof option.value === "boolean"
                      ? option.value
                        ? 1
                        : 0
                      : option.value
                  }
                  value={option.value}
                >
                  <span style={{ fontSize: "16px" }}>{option.label}</span>
                </Select.Option>
              ))}
          </Select>
        </>
      );
    else
      return (
        <>
          {loading === true ? (
            <Skeleton.Input active={true} block />
          ) : (<>
            <Select
              className={className ?? "style-select-default"}
              placeholder={placeholder}
              value={
                fromRender === true
                  ? valueRender ?? value
                  : value != undefined
                  ? value
                  : defaultValue
              }
              defaultValue={defaultValue || null} // kg load dc lan 2
              options={data}
              ref={selectRef}
              open={dropdownOpen}
              onDropdownVisibleChange={onDropdownVisibleChange}
              suffixIcon={
                <CaretDownOutlined
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent default behavior
                    handleSuffixIconClick();
                  }}
                />
              }
              onChange={onChange}
              disabled={disabled}
              style={style}
              mode={mode}
              showSearch
              onSearch={handleSearch}
              maxCount={maxCount}
              allowClear={
                mode === "multiple" || mode === "tags"
                  ? {
                      clearIcon: <CloseOutlined className="clearContentIcon" />,
                    }
                  : false
              }
              filterOption={(inputValue, option) => {
                const normalizedInput = normalizeString(inputValue);
                const normalizedLabel = normalizeString(option?.label || "");
                return normalizedLabel.includes(normalizedInput);
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
              {...rest}
            />
            </>
          )}
        </>
      );
  }
};

export default FormSelect;
