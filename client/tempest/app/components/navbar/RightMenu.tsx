"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import RegisterModal from "../modals/RegisterModal";
import LoginModal from "../modals/LoginModal";
import apiService from "@/app/services/apiService";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <MenuOutlined />,
    key: "SubMenu",
    children: [
      {
        label: "Login",
        key: "login",
      },
      {
        label: "Register",
        key: "register",
      },
    ],
  },
];

function RightMenu() {
  const router = useRouter();
  const [current, setCurrent] = useState("login");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);

    if (e.key === "login") {
      setIsLoginOpen(true);
    }
    if (e.key === "register") {
      setIsRegisterOpen(true);
    }
  };

  return (
    <div>
      <Menu
        className="bg-transparent"
        disabledOverflow={true}
        onClick={onClick}
        selectedKeys={[current]}
        triggerSubMenuAction="click"
        mode="horizontal"
        items={items}
        style={{ backgroundColor: "transparent" }}
      />
      <LoginModal
        open={isLoginOpen}
        close={() => setIsLoginOpen(false)}
        success={() => {
          setIsLoginOpen(false), router.push("/");
        }}
      />
      <RegisterModal
        open={isRegisterOpen}
        close={() => setIsRegisterOpen(false)}
        success={() => {
          setIsLoginOpen(false), router.push("/");
        }}
      />
    </div>
  );
}

export default RightMenu;
