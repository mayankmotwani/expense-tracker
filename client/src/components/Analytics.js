import React from "react";
import { Progress } from "antd";

import "../resources/analytics.css";

function Analytics({ transactions, type }) {
  const totalTransactions = transactions.length;
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === "income"
  );
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const totalIncomeTransactionsPercentage = (incomeTransactions.length / totalTransactions) * 100;
  const totalExpenseTransactionsPercentage = (expenseTransactions.length / totalTransactions) * 100;

  //const totalTurnover = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalIncomeTurnover = incomeTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalExpenseTurnover = expenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnover = totalIncomeTurnover + totalExpenseTurnover;
  
  const totalIncomeTurnoverPercentage =
    (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercentage =
    (totalExpenseTurnover / totalTurnover) * 100;

  const categories = [
    "salary",
    "entertainment",
    "freelance",
    "food",
    "travel",
    "investment",
    "education",
    "medical",
    "tax",
  ];

  const EmptyPlaceholder = ({message}) => <div className="empty-placeholder">{message}</div>

  const CategoryWiseTransactionChart = ({transactionType, totalTurnOver}) => {
    const transactions = (transactionType === "income") ? incomeTransactions : expenseTransactions;
    
    const list = []
    categories.forEach((category) => {
      const amount = transactions
        .filter((t) => t.category === category)
        .reduce((acc, t) => acc + t.amount, 0);
      amount > 0 && list.push(
        <div className="category-card">
          <h5>{category}</h5>
          <Progress strokeColor="#0B5AD9" percent={((amount / totalTurnOver) * 100).toFixed(0)} />
        </div>
      );
    })
    return list.length ? list : <EmptyPlaceholder message={`No ${transactionType} transactions found for the selected duration`}/>
  }

  return (
    <div className="analytics">
      <div className="row">
        <div className="col-md-4 mt-3">
          <div className="transactions-count">
            <h4>Total Transactions : {totalTransactions}</h4>
            <hr />
            <h5>Income : {incomeTransactions.length}</h5>
            <h5>Expense : {expenseTransactions.length}</h5>

            <div className="progress-bars">
              <Progress
                className="mx-5"
                strokeColor="#5DD64F"
                type="circle"
                percent={totalIncomeTransactionsPercentage.toFixed(0)}
              />
              <Progress
                strokeColor="#E5572F"
                type="circle"
                percent={totalExpenseTransactionsPercentage.toFixed(0)}
              />
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-3">
          <div className="transactions-count">
            <h4>Total Turnover : {totalTurnover}</h4>
            <hr />
            <h5>Income : {totalIncomeTurnover}</h5>
            <h5>Expense : {totalExpenseTurnover}</h5>

            <div className="progress-bars">
              <Progress
                className="mx-5"
                strokeColor="#5DD64F"
                type="circle"
                percent={totalIncomeTurnoverPercentage.toFixed(0)}
              />
              <Progress
                strokeColor="#E5572F"
                type="circle"
                percent={totalExpenseTurnoverPercentage.toFixed(0)}
              />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="row">
        {(type === 'all' || type === 'income') && (
          <div className="col-md-6">
            <div className="category-analysis">
              <h4 className="category-analysis-header">Income - Category Wise</h4>
              <CategoryWiseTransactionChart transactionType="income" totalTurnOver={totalIncomeTurnover}/>
            </div>
          </div>
        )}

        {(type === 'all' || type === 'expense') && (
          <div className="col-md-6">
            <div className="category-analysis">
              <h4 className="category-analysis-header">Expense - Category Wise</h4>
              <CategoryWiseTransactionChart transactionType="expense" totalTurnOver={totalExpenseTurnover}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
