import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { DatePicker, message, Select, Table } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import DefaultLayout from "../components/DefaultLayout";
import AddEditTransaction from "../components/AddEditTransaction";
import Analytics from "../components/Analytics";
import Spinner from "../components/Spinner";
import "../resources/transactions.css";

const { RangePicker } = DatePicker;

function Home() {
  const [timePeriod, setTimePeriod] = useState("7");
  const [selectedRange, setSelectedRange] = useState([]);
  const [type, setType] = useState("all");

  const [viewType, setViewType] = useState("table");

  const [transactionsData, setTransactionsData] = useState([]);

  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [showAddEditTransactionModal, setShowAddEditTransactionModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));

      setLoading(true);

      const response = await axios.post("/api/transactions/get-all-transactions", {
          userid: user._id,
          timePeriod,
          ...(timePeriod === "custom" && { selectedRange }),
          type
        }
      );
      
      setLoading(false);

      setTransactionsData(response.data);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong\nPlease try again later");
    }
  };

  const deleteTransaction = async (record) => {
    try {
      setLoading(true);

      await axios.post("/api/transactions/delete-transaction", {
        transactionId: record._id,
      });

      message.success("Transaction deleted successfully");

      getTransactions(); // Alternative way possible ?

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong\nPlease try again later");
    }
  };

  useEffect(() => {
    getTransactions();
  }, [timePeriod, selectedRange, type]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{ moment(text).format("YYYY-MM-DD") }</span>
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => { // text argument is required?
        return (
          <div>
            <EditOutlined
              onClick={() => {
                setSelectedItemForEdit(record);
                setShowAddEditTransactionModal(true);
              }}
            />
            <DeleteOutlined
              className="mx-3"
              onClick={() => deleteTransaction(record)}
            />
          </div>
        );
      },
    },
  ];

  const getPaginationConfiguration = (pageSize) => transactionsData.length > pageSize ? {pageSize} : false // ?

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <div className="filter d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="d-flex flex-column">
            <h6>Select Time Period</h6>
            <Select value={timePeriod} onChange={(value) => setTimePeriod(value)}>
              <Select.Option value="7">Last 1 Week</Select.Option>
              <Select.Option value="30">Last 1 Month</Select.Option>
              <Select.Option value="365">Last 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>

            {timePeriod === "custom" && (
              <div className="mt-2">
                <RangePicker
                  value={selectedRange}
                  onChange={(values) => setSelectedRange(values)}
                />
              </div>
            )}
          </div>
              
          <div className="d-flex flex-column mx-5">
            <h6>Select Type</h6>
            <Select value={type} onChange={(value) => setType(value)}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </div>
        </div>

        <div className="d-flex">
          <div className="view-switch mx-5">
            <UnorderedListOutlined
              className={`mx-3 ${
                viewType === "table" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewType("table")}
              size={30}
            />
            <AreaChartOutlined
              className={`${
                viewType === "analytics" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewType("analytics")}
              size={30}
            />
          </div>

          <button className="primary" onClick={() => setShowAddEditTransactionModal(true)}>
            ADD TRANSACTION
          </button>
        </div>
      </div>

      <div className="table-analytics">
        {viewType === "table" ? (
          <div className="table">
            <Table columns={columns} dataSource={transactionsData} pagination={getPaginationConfiguration(10)}/>
          </div>
        ) : (
          <Analytics transactions={transactionsData} type={type}/>
        )}
      </div>

      {showAddEditTransactionModal && (
        <AddEditTransaction
          showAddEditTransactionModal={showAddEditTransactionModal} // required ?
          setShowAddEditTransactionModal={setShowAddEditTransactionModal}
          selectedItemForEdit={selectedItemForEdit}
          setSelectedItemForEdit={setSelectedItemForEdit}
          getTransactions={getTransactions}
        />
      )}
    </DefaultLayout>
  );
}

export default Home;
