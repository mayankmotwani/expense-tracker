import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "../resources/default-layout.css";

function DefaultLayout(props) {
  const user = JSON.parse(localStorage.getItem("expense-tracker-user"));

  const navigate = useNavigate();
  const menu = (
    <Menu style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      items={[
        {
          label: (
            <li className="btn btn-outline-success" onClick={() => { // Why li ?
              localStorage.removeItem("expense-tracker-user");
              navigate("/login");
            }}>
              Logout
            </li>
          ),
        },
      ]}
    />
  );

  return (
    <div className="layout">
      <div className="header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="logo">EXPENSE TRACKER</h1>
        </div>
        
        <div>
          <Dropdown overlay={menu} placement="bottomLeft">
            <button className="primary profile-button">
              <UserOutlined />
              <div className="profile-name">{user.name}</div>
            </button>
          </Dropdown>
        </div>
      </div>

      <div className="content">{props.children}</div>
    </div>
  );
}

export default DefaultLayout;
