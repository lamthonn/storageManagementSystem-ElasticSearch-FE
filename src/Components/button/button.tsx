import React, { FunctionComponent } from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';
import './button.scss'

type ButtonCustomProps = {
  text: string;
  variant?: 'solid' | 'outlined'; // Defines the button variant (solid or outlined)
  onClick?: ButtonProps['onClick'];
  disabled?: boolean;
  style?: React.CSSProperties;
  icon? : any;
  className?: string;
  htmlType?: 'button' | 'submit' | undefined;
  loading?: boolean;
};

const ButtonCustom: FunctionComponent<ButtonCustomProps> = ({
  text,
  variant = 'solid', // Default variant is solid
  onClick,
  disabled = false,
  style,
  icon,
  className,
  htmlType,
  loading,
  ...rest
}) => {

  return (
    <Button
      type={variant === 'solid' ? 'primary' : 'default'}
      onClick={onClick}
      disabled={disabled}
      className={className ?? "btn-custom-default"}
      htmlType={htmlType ?? 'button'}
      loading={(htmlType == "submit") ? loading : undefined}
      style={{
        borderWidth: variant === 'outlined' ? '1px' : 'none', // Border for outlined variant
        ...style, // Allow custom styles to be passed in
        borderRadius: '6px', // Rounded corners like in the image
        padding: '10px 16px', // Custom padding for better appearance
        fontSize: '16px !important'
      }}
    >
        {icon}
        {text}
    </Button>
  );
};

export default ButtonCustom;
