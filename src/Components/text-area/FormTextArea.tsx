import React, { ChangeEvent, FunctionComponent } from 'react';
import { Input, Form, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

type TextAreaComponentProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>)=> void;
  disabled?: boolean;
  style?: React.CSSProperties;
  rows?: number; // Number of rows for the textarea
  maxLength?: number; // Maximum length of input
  allowClear?: boolean; // Show clear icon
  defaultValue?: string;
};

const { TextArea } = Input;

const FormAreaCustom: FunctionComponent<TextAreaComponentProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  style,
  rows = 4, // Default to 4 rows
  maxLength,
  allowClear = false,
  defaultValue,
  ...rest
}) => {

  // Hàm xử lý để loại bỏ khoảng trắng đầu cuối
  const handleChangeBlur = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const trimmedValue = e.target.value.trim();
    // Gọi hàm onChange nếu được truyền từ props
    if (onChange) {
      onChange({
        ...e,
        target: { ...e.target, value: trimmedValue },
      });
    }
  };
  return (
    <Form.Item className="form-item">

      {label && <Typography.Text style={{ fontSize:"16px" }}>{label}</Typography.Text>}
      <TextArea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={style}
        rows={rows}
        onBlur={handleChangeBlur}
        maxLength={maxLength}
        allowClear={{clearIcon: <CloseOutlined style={{ marginLeft:"16px"}}/>}}
        defaultValue={defaultValue}
        {...rest}
      />
    </Form.Item>
  );
};

export default FormAreaCustom;
