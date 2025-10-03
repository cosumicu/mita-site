"use client";

import React, { useState } from "react";
import type { MenuProps } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import RegisterModal from "../modals/RegisterModal";
import LoginModal from "../modals/LoginModal";

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
  const [current, setCurrent] = useState("login");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);

    if (e.key === "login") {
      setIsLoginOpen(true);
    }
    if (e.key === "register") {
      setIsRegisterOpen(true);
    }
  };

  const handleLogin = (values: { email: string; password: string }) => {
    console.log("Register form values:", values);
  };

  const handleRegister = (values: { email: string; password: string }) => {
    console.log("Register form values:", values);
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
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
      <RegisterModal
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default RightMenu;
