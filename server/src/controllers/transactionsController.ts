import { Request, Response } from "express";
import { TransactionModel } from "../models/transactionsModels";
import { dbPool } from "../config/db";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";

const transactionModel = new TransactionModel(dbPool);

export const transferMoney = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = (req as any).user?.user_id;
    const { receiver_account, amount, description } = req.body;

    if (!receiver_account || !amount) {
      res.status(400).json({
        status: "error",
        message: "Missing required fields receiver account and amount",
      });
      return;
    }

    if (!/^\d{12}$/.test(receiver_account)) {
      res.status(400).json({
        status: "error",
        message: "Invalid account number format Must be 12 digits",
      });
      return;
    }

    const senderAccount = await transactionModel.findAccountByUserId(user_id);
    if (!senderAccount) {
      res
        .status(404)
        .json({ status: "error", message: "Sender account not found" });
      return;
    }

    if (senderAccount.account_number === receiver_account) {
      res.status(400).json({
        status: "error",
        message: "Cannot transfer to your own account",
      });
      return;
    }

    if (senderAccount.status !== "approved") {
      res.status(403).json({
        status: "error",
        message: "Sender account is not approved for transactions",
      });
      return;
    }

    const receiverAccount = await transactionModel.findAccountByAccountNumber(
      receiver_account
    );
    if (!receiverAccount) {
      await transactionModel.createTransaction({
        sender_account: senderAccount.account_number,
        receiver_account: null,
        amount: parseFloat(amount),
        transaction_type: "transfer",
        status: "failed",
        description: "Receiver account not found",
        transaction_uuid: uuidv4(),
      });
      res
        .status(404)
        .json({ status: "error", message: "Receiver account not found" });
      return;
    }

    if (receiverAccount.status !== "approved") {
      await transactionModel.createTransaction({
        sender_account: senderAccount.account_number,
        receiver_account: receiver_account,
        amount: parseFloat(amount),
        transaction_type: "transfer",
        status: "failed",
        description: "Receiver account is not approved",
        transaction_uuid: uuidv4(),
      });
      res.status(403).json({
        status: "error",
        message: "Receiver account is not approved for transactions",
      });
      return;
    }

    if (senderAccount.balance < parseFloat(amount)) {
      await transactionModel.createTransaction({
        sender_account: senderAccount.account_number,
        receiver_account: receiver_account,
        amount: parseFloat(amount),
        transaction_type: "transfer",
        status: "failed",
        description: "Insufficient balance",
        transaction_uuid: uuidv4(),
      });
      res
        .status(400)
        .json({ status: "error", message: "Insufficient balance" });
      return;
    }

    const transactionUuid = uuidv4();

    await transactionModel.performTransfer(
      senderAccount.account_number,
      receiver_account,
      parseFloat(amount)
    );

    await transactionModel.createTransaction({
      sender_account: senderAccount.account_number,
      receiver_account: receiver_account,
      amount: parseFloat(amount),
      transaction_type: "transfer",
      status: "success",
      description: description || `Transfer to ${receiver_account}`,
      transaction_uuid: transactionUuid,
    });

    res.status(200).json({
      status: "success",
      message: "Transfer successful",
      data: {
        transaction_uuid: transactionUuid,
        amount: parseFloat(amount),
        receiver_account: receiver_account,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Transfer failed" });
  }
};

export const depositMoney = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { account_number, balance, description } = req.body;

    if (!account_number || !balance) {
      res
        .status(400)
        .json({ status: "error", message: "All fields are required!" });
      return;
    }

    if (!/^\d{12}$/.test(account_number)) {
      res.status(400).json({
        status: "error",
        message: "Invalid account number format Must be 12 digits",
      });
      return;
    }

    const account = await transactionModel.findAccountByAccountNumber(
      account_number
    );

    if (!account) {
      res.status(404).json({ status: "error", message: "Account not found" });
      return;
    }

    if (account.status !== "approved") {
      res
        .status(400)
        .json({ status: "error", message: "Account was not approved!" });
      return;
    }

    await transactionModel.depositInAccount(account_number, Number(balance));

    await transactionModel.createTransaction({
      sender_account: 0,
      receiver_account: account.account_number,
      amount: Number(balance),
      transaction_type: "credit",
      status: "success",
      description: description || "Admin Deposit",
      transaction_uuid: uuidv4(),
    });

    res.status(200).json({
      status: "success",
      message: "Amount deposited successfully",
    });
    return;
  } catch (error) {
    console.log("Error in deposit money: ", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.user_id;

    if (!user_id) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const transactions = await transactionModel.getTransactionHistory(user_id);

    res.status(200).json({
      status: "success",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch transactions",
    });
  }
};

export const downloadTransactionStatementPDF = async (
  req: Request,
  res: Response
) => {
  try {
    const user_id = (req as any).user?.user_id;

    if (!user_id) {
      res
        .status(401)
        .json({ status: "error", message: "Unauthorized" });
      return;
    }

    const transactions = await transactionModel.getTransactionHistory(user_id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transaction_statement.pdf"
    );

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.pipe(res);

    // Header branding
    doc
      .fillColor("#004466")
      .fontSize(30)
      .font("Times-Bold")
      .text("KV BANK", { align: "center" });

    doc
      .fillColor("#000000")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Transaction Statement", { align: "center" });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#666")
      .text(`Generated on: ${new Date().toLocaleString("en-IN")}`, {
        align: "center",
      });

    doc.moveDown(2);

    // Table headers
    const tableTop = 135;
    const rowHeight = 25;
    const col = {
      txnId: 50,
      from: 100,
      to: 190,
      amount: 280,
      type: 350,
      status: 410,
      date: 480,
    };

    doc
      .rect(40, tableTop, 520, rowHeight)
      .fill("#004466")
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(10);

    doc.text("ID", col.txnId, tableTop + 7);
    doc.text("From", col.from, tableTop + 7);
    doc.text("To", col.to, tableTop + 7);
    doc.text("Amount", col.amount, tableTop + 7);
    doc.text("Type", col.type, tableTop + 7);
    doc.text("Status", col.status, tableTop + 7);
    doc.text("Date", col.date, tableTop + 7);

    // Table body
    let y = tableTop + rowHeight;
    doc.font("Helvetica").fontSize(9);

    transactions.forEach((txn: any, index: number) => {
      const isEven = index % 2 === 0;

      // Background for rows
      if (isEven) {
        doc.rect(40, y, 520, rowHeight).fill("#f5f5f5");
      }

      doc
        .fillColor("#000")
        .text(txn.transaction_id.toString(), col.txnId, y + 7)
        .text(txn.sender_account || "-", col.from, y + 7)
        .text(txn.receiver_account || "-", col.to, y + 7)
        .text(`₹${Number(txn.amount || 0).toFixed(2)}`, col.amount, y + 7)
        .text(txn.transaction_type, col.type, y + 7)
        .text(txn.status, col.status, y + 7)
        .text(
          new Date(txn.created_at).toLocaleString("en-IN"),
          col.date,
          y + 7
        );

      y += rowHeight;

      // Page break if content goes beyond page height
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    // Optional footer or notes
    doc.moveDown(2);
    doc
      .font("Helvetica-Oblique")
      .fontSize(9)
      .fillColor("#444")

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to generate PDF" });
  }
};

// export const getAllTransactionsForAdmin = async (req: Request, res: Response) => {
//   try {
//     const transactions = await transactionModel.getAllTransactions();

//     res.status(200).json({
//       status: "success",
//       data: transactions,
//     });
//   } catch (error) {
//     console.error("Error fetching all transactions:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch all transactions",
//     });
//   }
// };

export const getAllTransactionsForAdmin = async (req: Request, res: Response) => {
  try {
    const typeParam = (req.query.type as string || "all").toLowerCase();
    const allowedTypes = ["all", "credit", "debit", "transfer"];
    if (!allowedTypes.includes(typeParam)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid transaction type. Allowed types: ${allowedTypes.join(", ")}`,
      });
    }

    const transactions = await transactionModel.getAllTransactions(typeParam);

    res.status(200).json({
      status: "success",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch all transactions",
    });
  }
};