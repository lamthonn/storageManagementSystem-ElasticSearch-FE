import { FunctionComponent, ReactNode, useState } from "react";
import "./FormInputNumber.scss";
import { InputNumber, Form, Typography, Tooltip } from "antd";
import { InputStatus } from "antd/es/_util/statusUtils";
import { CloseCircleFilled, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";

type FormInputNumberProps = {
  label?: string; // Thêm prop cho label
  prefixIcon?: ReactNode | string;
  afterPrefixIcon?: ReactNode;
  placeholder?: string;
  value?: number;
  onChange?: (value: number | null, values: string | null) => void;
  onBlur?: (value:any) => void;
  disabled?: boolean;
  style?: any;
  status?: InputStatus;
  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  isPreventCharacter?: boolean;
};

const FormInputNumber: FunctionComponent<FormInputNumberProps> = ({
  label, // Nhận label từ props
  prefixIcon,
  afterPrefixIcon,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  style,
  status,
  min,
  max,
  step,
  precision,
  isPreventCharacter,
  ...rest
}) => {

  const handleClear = () => {
    onChange ? onChange(null, '') : null;
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ["e", "E", "+"];
    if (invalidChars.includes(event.key)) {
      event.preventDefault(); // Prevent typing the invalid character
    }
  };

  const [isError, setIsError] = useState(false); // Trạng thái lỗi
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi

  const formatValue = (value: string | number | undefined): string => {
    if (value === undefined || value === null) return "";
    const [integer, decimal] = value.toString().split(".");
    const formattedInteger = integer.slice(0, 11);
    const formattedDecimal = decimal?.slice(0, 10) || "";

    return decimal !== undefined
      ? `${formattedInteger}.${formattedDecimal}`
      : formattedInteger;
  };

  const validateValue = (val: string | number | null) => {
    if (val === null || val === undefined || val === "") {
      setIsError(false);
      setErrorMessage("");
      return;
    }
    const [integer, decimal] = val.toString().split(".");
    if (
      (integer && integer.length > 11) ||
      (decimal && decimal.length > 10)
    ) {
      setIsError(true);
      setErrorMessage("Vui lòng nhập kiểu dữ liệu decimal (21,10)");
    } else {
      setIsError(false);
      setErrorMessage("");
    }
  };

  return (
    <Form.Item className="form-item"  name="inputNumber"
      validateStatus={isError ? "error" : ""}
      help={isError ? errorMessage : ""}
      style={isError ? {borderColor:"red"} : {}}
      >
      <Typography.Text style={{ fontSize: '16px' }}>{label}</Typography.Text>
      <div className="clearable-input-number">
        <InputNumber
          type="number"
          value={value}
          disabled={disabled}
          className="form-input-number"
          addonBefore={prefixIcon}
          addonAfter={afterPrefixIcon}
          style={style}
          readOnly={readOnly}
          status={status}
          formatter={(val) => formatValue(val)}
          parser={(val: any) => (val ? val.replace(/[^\d.-]/g, "") : "")}
          // onChange={(v: any) => onChange?.(v, v ? v.toString() : null)}
          onChange={(v: any) => {
            validateValue(v);
            const parsedValue = formatValue(v);
            onChange?.(v, parsedValue);
          }}
          onKeyDown={(event) => {
            if(isPreventCharacter == true){
              if (["e", "E", "+", "-", ".", ","].includes(event.key)) {
                  event.preventDefault(); // chặn ký tự đặc biệt
                }
            }else{
              //const invalidChars = ["e", "E", "+", "-"];
            const charCode = (event.which) ? event.which : event.key || event.keyCode;  // keyCode is deprecated but needed for some browsers
            return !(charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43);
            }
          }}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step ?? 1}
          precision={precision ?? precision}
          stringMode
          {...rest}
        />
        {value !== null && value !== undefined && (
          <CloseOutlined
            className="clear-icon"
            onClick={handleClear}
          />
        )}
      </div>
    </Form.Item>
  );
};

export default FormInputNumber;
