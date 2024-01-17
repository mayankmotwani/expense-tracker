import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import { Form, Input, message, Modal, Select, DatePicker } from "antd";
import Spinner from "./Spinner";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const portNumber = 5000;
const baseURL = `http://localhost:${portNumber}`;

function AddEditTransaction({
  showAddEditTransactionModal,
  setShowAddEditTransactionModal,
  selectedItemForEdit,
  setSelectedItemForEdit,
  getTransactions
}) {

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");  // Required ?
  const [open, setOpen] = useState(false); // Merge to dialog
  const [dialog, setDialog] = useState({title: '', content: ''});
  const [date, setDate] = useState((selectedItemForEdit ? moment(selectedItemForEdit.date) : null));

  const validateAmt = (event) => {
    setValue(event.target.value);

    if (event.target.value < 0) {
      setDialog({ title: ' Error', content: 'Value of amount cannot be negative' });
      setOpen(true);

      document.getElementById("myForm").reset();
    }
  };

  const validateDate = (_, value) => {
    const pickedDate = new Date(value)
    const currentDate = new Date()
    return currentDate.valueOf() < pickedDate.valueOf() ? Promise.reject(new Error('Date not accepted')) : Promise.resolve()
  }

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const validateFormInput = (values) => {
    const fields = Object.keys(values);
    const emptyFields = fields.filter((field) => values[field] === undefined || values[field] === null || values[field] === '');
    if (emptyFields.length === 0) 
      return true;

    const message = `${emptyFields.map(capitalizeFirstLetter).join(', ')} fields cannot be empty!`;

    setOpen(true);
    setDialog({ title: ' Validation Error', content: message });

    return false;
  };

  const onFinish = async (values) => {
    values.date = date;

    const isValid = validateFormInput(values)
    if(!isValid) 
      return;

    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));

      setLoading(true);

      if (selectedItemForEdit) {
        await axios.post(`${baseURL}/api/transactions/edit-transaction`, {
          payload: {
            ...values,
            userid: user._id
          },
          transactionId: selectedItemForEdit._id
        });

        getTransactions();

        message.success("Transaction updated successfully");
      } else {
        await axios.post(`${baseURL}/api/transactions/add-transaction`, {
          ...values,
          userid: user._id,
        });

        getTransactions();

        message.success("Transaction added successfully");
      }

      setShowAddEditTransactionModal(false);
      setSelectedItemForEdit(null);

      setLoading(false);
    } catch (error) {
      message.error("Something went wrong\nPlease try again later");
      setLoading(false);
    }
  };

  const resetDialog = () => { // can be merged in to CustomDialog ?
    setDialog({ title: '', content: '' });
  };

  const CustomDialog = ({ open, onClose, title, content }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const initialValues = () => {
    if (!selectedItemForEdit)
      return null;
    const {date, ...values} = selectedItemForEdit;
    return values;
  };

  return (
    <Modal
      title={selectedItemForEdit ? 'Edit Transaction' : 'Add Transaction'}
      visible={showAddEditTransactionModal}
      onCancel={() => setShowAddEditTransactionModal(false)}
      footer={false}
    >
      <CustomDialog open={open} onClose={resetDialog} title={dialog.title} content={dialog.content} />

      {loading && <Spinner />}

      <Form
        layout="vertical"
        className="transaction-form"
        onFinish={onFinish}
        initialValues={initialValues()}
        id="myForm"
      >
        <Form.Item label="Amount" name="amount" id="value" value={value} onBlur={validateAmt}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Select>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select>
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="entertainment">Entertainment</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            <Select.Option value="travel">Travel</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="medical">Medical</Select.Option>
            <Select.Option value="tax">Tax</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Date" name="date" rules={[
          {message: 'Date Invalid!', validator: validateDate}
        ]}>
          <DatePicker defaultValue={date} onChange={(date, dateString) => setDate(date)} />
        </Form.Item>

        <Form.Item label="Reference" name="reference">
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input type="text" />
        </Form.Item>

        <div className="d-flex justify-content-end">
          <button className="primary" type="submit">
            SAVE
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditTransaction;
