import { FunctionComponent } from "react";
import { ConfigProvider, DatePicker, Typography } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import viVN from "antd/lib/locale/vi_VN";
import ShowToast from "../show-toast/ShowToast";
import "./datepicker-custom.scss";

// Cấu hình dayjs
dayjs.locale("vi");
dayjs.extend(utc);
dayjs.extend(timezone);

type DatePickerComponentProps = {
  label?: string;
  placeholder?: string;
  placeholderRange?: string[];
  value?: Dayjs | [Dayjs, Dayjs] | null;
  onChange?: DatePickerProps["onChange"] | RangePickerProps["onChange"];
  disabled?: boolean;
  style?: any;
  format?: string;
  picker?: "week" | "month" | "quarter" | "year";
  mode?: "date" | "range";
  allowClear?: boolean;
  defaultValue?: Dayjs;
  limit?: number | null;
  onlyDate?: boolean;
};

const { RangePicker } = DatePicker;

const DatePickerCustom: FunctionComponent<DatePickerComponentProps> = ({
  label,
  placeholder,
  placeholderRange = ["Bắt đầu", "Kết thúc"],
  value,
  onChange,
  disabled,
  style,
  format = "DD/MM/YYYY",
  mode = "date",
  allowClear = true,
  defaultValue,
  limit,
  onlyDate = true,
  picker,
  ...rest
}) => {
  // Xử lý khi chọn trên calendar (chỉ khi chọn range)
  const onCalendarChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const start = dates[0].add(7, "h").tz("Asia/Ho_Chi_Minh");
      const end = dates[1].add(7, "h").tz("Asia/Ho_Chi_Minh");

      if (limit && end.diff(start, "day") > limit) {
        ShowToast(
          "error",
          "Thông báo",
          `Khoảng thời gian tối đa có thể chọn là ${limit} ngày`,
          6
        );
      } else {
        onChange?.(dates, [start.format(format), end.format(format)]);
      }
    }
  };

  // Xử lý khi change giá trị (range)
  const onRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const [start, end] = dates;
      const diff = end.diff(start, "day");

      if (limit && diff > limit) {
        ShowToast(
          "error",
          "Có lỗi xảy ra",
          `Khoảng thời gian tối đa có thể chọn là ${limit} ngày`,
          6
        );
        onChange?.(start, [start.format(format), start.format(format)]);
      } else {
        onChange?.(dates, [
          start.add(7, "hour").format(format),
          end.add(7, "hour").format(format),
        ]);
      }
    } else {
      onChange?.(null as any, null as any);
    }
  };

  return (
    <ConfigProvider locale={viVN}>
      {label && (
        <Typography.Paragraph style={{ fontSize: "16px", margin: 0 }}>
          {label}
        </Typography.Paragraph>
      )}

      {mode === "range" ? (
        <RangePicker
          placeholder={placeholderRange as any}
          value={value as [Dayjs, Dayjs] | null}
          onChange={onRangeChange}
          onCalendarChange={onCalendarChange}
          disabled={disabled}
          style={style}
          format={format}
          showTime={onlyDate ? false : { format }}
          allowClear={allowClear}
          picker={picker}
        />
      ) : (
        <DatePicker
          placeholder={placeholder ?? placeholderRange[0]}
          value={value as Dayjs | null}
          onChange={onChange as DatePickerProps["onChange"]}
          disabled={disabled}
          defaultValue={defaultValue}
          style={style}
          format={format}
          showTime={
            onlyDate
              ? false
              : {
                  format: "HH:mm",
                  hourStep: 1,
                }
          }
          allowClear={allowClear}
          picker={picker}
          {...rest}
        />
      )}
    </ConfigProvider>
  );
};

export default DatePickerCustom;
