import React, { useEffect, useState } from "react";
import { Card, Input, Button, Tag, Space, Checkbox, InputNumber, Typography, message } from "antd";
import { getAll, updateConfig } from "../../../services/cau-hinh-file";
import ShowToast from "../../../Components/show-toast/ShowToast";

const { Title, Text } = Typography;

export default function QuanLyCauHinhFile() {
  const [loading, setLoading] = useState<boolean>(false);
  const [allowed, setAllowed] = useState([".pdf", ".docx", ".png"]);
  const [inputExt, setInputExt] = useState("");
  const [sizeMb, setSizeMb] = useState(20);
  const [sizeGb, setSizeGb] = useState(1);
  const [useGb, setUseGb] = useState(false);

  useEffect(()=> {
    setLoading(true);
    getAll()
    .then(res => {
      console.log("cấu hình file: ", res.data);
      const fileType = res.data.map((x:any) => {return x.extension_file})
      setAllowed(fileType);
      setSizeMb(res.data[0].file_size)
    })
    .catch(()  => {
      ShowToast("error", "Lỗi", "Không lấy được cấu hình file", 3)
    })
    .finally(()=> {
      setLoading(false);
    })
  }, [])

  function addExt() {
    const raw = inputExt.trim();
    if (!raw) return;
    const withDot = raw.startsWith(".") ? raw.toLowerCase() : `.${raw.toLowerCase()}`;
    if (!/^\.[a-z0-9]+$/.test(withDot)) {
      message.error("Định dạng không hợp lệ, ví dụ: .pdf hoặc pdf");
      return;
    }
    if (allowed.includes(withDot)) {
      message.warning("Loại file đã tồn tại");
      return;
    }
    setAllowed([...allowed, withDot]);
    setInputExt("");
  }

  function removeExt(ext:any) {
    setAllowed(allowed.filter(x => x !== ext));
  }

  function resetDefaults() {
    setAllowed([".pdf", ".docx", ".png"]);
    setSizeMb(20);
    setSizeGb(1);
    setUseGb(false);
  }

  function saveConfig() {
    setLoading(true);
    const payload = allowed.map((item:any)=> {
      return {
        extension_file: item,
        file_size: useGb ? sizeGb * 1024 : sizeMb,
      }
    }) 
    console.log(payload);

    updateConfig(payload)
    .then((res:any)=> {
      ShowToast("success", "Thông báo", "Cập nhật cấu hình thành công", 3)
    })
    .catch(()=> {
      ShowToast("error", "Lỗi", "Xảy ra lỗi khi cập nhật cấu hình", 3)
    })
    .finally(()=> {
      setLoading(false);
    })
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Cấu hình upload file</Title>
      <Text type="secondary">
        Thiết lập loại file được phép tải lên và dung lượng tối đa cho mỗi file.
      </Text>

      <Space direction="vertical" size={24} style={{ marginTop: 24, width: "100%" }}>

        {/* CARD 1 */}
        <Card title="Loại file được phép tải lên" bordered >
          <Space>
            <Input
              style={{ width: 250 }}
              placeholder="Nhập loại file (vd: pdf/.pdf)"
              value={inputExt}
              onChange={e => setInputExt(e.target.value)}
              onPressEnter={addExt}
            />
            <Button type="primary" onClick={addExt}>Thêm</Button>
          </Space>
            `<br />
          <Space wrap style={{ marginTop: 16 }}>
            {allowed.map(ext => (
              <Tag
                key={ext}
                closable
                onClose={() => removeExt(ext)}
                color="blue"
              >
                {ext}
              </Tag>
            ))}
          </Space>
        </Card>

        {/* CARD 2 */}
        <Card title="Dung lượng tối đa cho phép" bordered>
          <Text strong>Dung lượng (tối đa):</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <InputNumber
                min={1}
                value={sizeMb}
                disabled={useGb}
                onChange={(v:any) => setSizeMb(v)}
              />
              <Text>MB</Text>
            </Space>
          </div>

          <Text style={{ display: "block", margin: "12px 0" }}>hoặc</Text>

          <Space>
            <InputNumber
              min={1}
              value={sizeGb}
              disabled={!useGb}
              onChange={(v:any) => setSizeGb(v)}
            />
            <Text>GB</Text>
            <Checkbox checked={useGb} onChange={e => setUseGb(e.target.checked)}>
              Sử dụng GB
            </Checkbox>
          </Space>

          <Text type="secondary" style={{ display: "block", marginTop: 10 }}>
            Áp dụng cho mỗi file tải lên
          </Text>
        </Card>

        <Space>
          <Button type="primary" onClick={saveConfig}>Lưu cấu hình</Button>
          <Button onClick={resetDefaults}>Khôi phục mặc định</Button>
        </Space>
      </Space>
    </div>
  );
}
