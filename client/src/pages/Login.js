import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, message } from "antd";
import Input from "antd/lib/input/Input";

import Spinner from "../components/Spinner";
import "../resources/authentication.css";

const portNumber = 5000;
const baseURL = `http://localhost:${portNumber}`;

function Login() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post(`${baseURL}/api/users/login`, values);

      let { password, ...userData } = response.data;
      localStorage.setItem(
        "expense-tracker-user",
        JSON.stringify(userData)
      );

      setLoading(false);
      message.success("Login successful");

      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong\nPlease try again later");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("expense-tracker-user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register">
      {loading && <Spinner />}
      <div className="row justify-content-center align-items-center w-100 h-100">
        <div className="col-md-4">
          <Form layout="vertical" onFinish={onFinish}>
            <h1>LOGIN</h1>

            <Form.Item label="Email" name="email" rules={[{ message: "Please enter your email", required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ message: "Please enter your password", required: true }]}>
              <Input type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
              <Link to="/register" className="linkTo">
              Not registered yet?<br />Click here to Register
              </Link>
              
              <button className="btn btn-outline-light" type="submit">
                Login
              </button>
            </div>
          </Form>
        </div>

        <div className="col-md-5">
          <div className="lottie">
            <lottie-player
              src="https://assets3.lottiefiles.com/packages/lf20_06a6pf9i.json"
              background="transparent"
              speed="1"
              loop
              autoplay
            ></lottie-player>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
