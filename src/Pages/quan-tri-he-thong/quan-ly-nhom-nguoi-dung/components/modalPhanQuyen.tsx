import React, { use, useEffect, useState } from "react";
import {
  Modal,
  Button,
  Collapse,
  Space,
  Card,
  Tree,
  Spin,
} from "antd";
import "./modalPhanQuyen.scss";
import { menu } from "../../../../Utils/menu";
import { getMenu, getPhanQuyen } from "../../../../services/dieu-huong";
import ShowToast from "../../../../Components/show-toast/ShowToast";
import { axiosConfig } from "../../../../Utils/configApi";
import { get } from "axios";

const { Panel } = Collapse;

interface Props {
  open: boolean;
  onClose: () => void;
  nhomNguoiDung:any;
}

const PermissionModal: React.FC<Props> = ({ open, onClose, nhomNguoiDung }) => {
  //initial data
  const [permissions, setPermissions] = useState<any[]>([]);
  const [currentPermission, setCurrentPermission] = useState<any>();
  const [selectedPermission, setSelectedPermission] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Get data menu từ backend
  useEffect(() => {
    if (open) {
      setLoading(true);
      // Lấy phân quyền của nhóm người dùng
          getPhanQuyen(nhomNguoiDung.id)
          .then((res:any)=> {
            var resp = res.data.map((item:any) => ({
              id: item.id,
              key: item.ma,
              title: item.ten,
              Permissions: Array.isArray(item.permission)
                ? item.permission.map((perm: any) => ({
                    key: perm.command,
                    id: perm.id,
                    title: perm.ten,
                    menuKey: item.id,
                  }))
                : [],
            }));

            setSelectedPermission(resp);
          })
          .catch(()=> {
            ShowToast("error", "Thông báo", "Lấy phân quyền thất bại!", 3);
          })

      // Logic call API lấy menu từ backend
      var menuData: any[] = [];
      getMenu()
        .then((res) => {
          menuData = Array.isArray(res.data)
            ? res.data.map((item: any) => ({
                title: item.ten,
                key: item.ma,
                id: item.id,
                parent: null,
                isParent: true,
                Permissions: Array.isArray(item.permission)
                  ? item.permission.map((perm: any) => ({
                      key: perm.command,
                      id: perm.id,
                      title: perm.ten,
                      menuKey: item.id,
                    }))
                  : [],
                children: item.danh_sach_dieu_huong_con
                  ? item.danh_sach_dieu_huong_con.map((child: any) => ({
                      title: child.ten,
                      key: child.ma,
                      id: child.id,
                      parent: item,
                      isParent: false,
                      Permissions: Array.isArray(child.permission)
                        ? child.permission.map((perm: any) => ({
                            key: perm.command,
                            id: perm.id,
                            title: perm.ten,
                            menuKey: child.id,
                          }))
                        : [],
                    }))
                  : [],
              }))
            : [];

          setPermissions(menuData);

          
        })
        .catch((err) => {
          ShowToast("error", "Thông báo", "Lấy menu thất bại!", 3);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  //Lưu phân quyền
  const handleSave = async () => {
    var body = {
      nhom_nguoi_dung_id: nhomNguoiDung.id,
      ds_dieu_huong: selectedPermission.map((item) => ({
        id: item.id,
        permission: item.Permissions.map((perm: any) => {
          return { id: perm.id, command: perm.key, ten: perm.title };
        }),
      })),
    }

    await axiosConfig.post("/api/nhom-nguoi-dung/phan-quyen", body)
      .then((res:any) => {
        ShowToast("success", "Thông báo", "Lưu phân quyền thành công!", 3);
        onClose();
      })
      .catch((err:any) => {
        ShowToast("error", "Thông báo", "Lưu phân quyền thất bại!", 3);
      });
  };

  // hàm khi select vào menu bên trái
  const onSelectRightMenu = (value: any) => {
    setCurrentPermission(value);
  };

  const onCheckLeftMenu = (
    checkedKeys: any,
    isPermission: boolean = false,
    isCheck: boolean
  ) => {
    if (!isPermission) {
      //node
      var node = checkedKeys.node;
      //node cha
      var parentNode = checkedKeys.node.parent;

      if (checkedKeys.checked) {
        var result = [...selectedPermission];

        if (node.isParent) {
          var childrenNode = node.children || [];
          var exitPerm = selectedPermission.map((item) => item.id);
          if (!exitPerm.includes(node.id)) {
            result.push({ id: node.id, key: node.key, Permissions: [] });
          }
          childrenNode.forEach((element: any) => {
            if (!exitPerm.includes(element.id)) {
              result.push({
                id: element.id,
                key: element.key,
                Permissions: [],
              });
            }
          });
        } else {
          //nếu có parent và parent chưa được chọn thì thêm parent vào selectedPermission
          if (
            parentNode &&
            selectedPermission.findIndex(
              (item) => item.id === parentNode.id
            ) === -1
          ) {
            result = [
              ...selectedPermission,
              { id: parentNode.id, key: parentNode.ma, Permissions: [] },
              { id: node.id, key: node.key, Permissions: [] },
            ];
          } else {
            result = [
              ...selectedPermission,
              { id: node.id, key: node.key, Permissions: [] },
            ];
          }
        }

        setSelectedPermission(result);
      } else {
        //bỏ chọn node
        var result = [...selectedPermission];
        if (node.isParent) {
          var childrenNode = node.children || [];
          var exitPerm = Array.isArray(childrenNode)
            ? [...childrenNode, node].map((item) => item.id)
            : [];

          result.forEach((element: any) => {
            if (exitPerm.includes(element.id)) {
              result = result.filter((item) => item.id !== element.id);
            }
          });
        } else {
          //bỏ chọn node
          result = result.filter((item) => item.id !== node.id);
          //nếu có parent và không còn node con nào được chọn thì bỏ parent khỏi selectedPermission
          if (
            parentNode &&
            !permissions
              .find((item) => item.id === parentNode.id)
              ?.children?.some(
                (child: any) =>
                  result.findIndex((perm: any) => perm.id === child.id) !== -1
              )
          ) {
            result = result.filter((item) => item.id !== parentNode.id);
          }
        }

        setSelectedPermission(result);
      }
    } else {
      var localPerm = [...selectedPermission];
      var perm = checkedKeys.node;
      if (checkedKeys.checked) {
        localPerm.forEach((element) => {
          if (element.id === currentPermission?.id) {
            if(!element.Permissions.some((p: any) => p.id === perm.id)){
              element.Permissions.push({
                id: perm.id,
                key: perm.key,
                title: perm.title,
              });
            }
          }
        });
        setSelectedPermission(localPerm);
      } else {
        localPerm.forEach((element) => {
          if (element.id === currentPermission?.id) {
            if(element.Permissions.some((p: any) => p.id === perm.id)){
              element.Permissions = element.Permissions.filter(
                (item: any) => item.id !== perm.id
              );
            }
          }
        });
        setSelectedPermission(localPerm);
      }
    }
  };

  // Đồng bộ Menu
  const syncMenu = () => {
    // Logic đồng bộ menu từ FE về BE
    console.log("Menu đồng bộ:::", menu());
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      title="Phân quyền nhóm người dùng"
    >
      <Spin spinning={loading}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Left */}
          <Card style={{ width: "49%" }}>
            <Tree
              checkable
              defaultExpandAll
              checkedKeys={
                selectedPermission
                  ? selectedPermission.map((item) => {
                      if (
                        item.key !== "quan-ly-danh-muc" &&
                        item.key !== "quan-ly-he-thong"
                      ) {
                        return item.key;
                      }
                    })
                  : []
              }
              onSelect={(value: any, record: any) =>
                onSelectRightMenu(record.node)
              }
              onCheck={(value: any, record: any) =>
                onCheckLeftMenu(record, false, record.checked)
              }
              treeData={permissions}
            />
          </Card>

          {/* Right */}
          <Card style={{ width: "49%" }}>
            <Tree
              checkable
              checkedKeys={
                selectedPermission ? (selectedPermission
                  .find((item) => item.id === currentPermission?.id)
                  ?.Permissions.map((perm: any) => perm.key) || []) : []
              }
              onCheck={(value: any, record: any) =>
                onCheckLeftMenu(record, true, record.checked)
              }
              treeData={currentPermission ? currentPermission.Permissions : []}
              defaultExpandAll
            />
          </Card>
        </div>

        <div
          className="button-group-modal-phan-quyen"
          style={{ marginTop: 20, textAlign: "right" }}
        >
          <Space>
            <Button onClick={onClose}>Đóng</Button>
            {/* <Button>Chọn tất cả Permission</Button> */}
            {/* <Button 
              style={{ borderColor: "green", color: "green" }}
              onClick={syncMenu}
            >
              Đồng bộ menu
            </Button> */}
            <Button type="primary" onClick={handleSave}>
              Lưu
            </Button>
          </Space>
        </div>
      </Spin>
    </Modal>
  );
};

export default PermissionModal;
