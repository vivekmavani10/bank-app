import { Request, Response } from "express";
import { TransactionModel } from "../models/transactionsModels";
import { dbPool } from "../config/db";
import { v4 as uuidv4 } from "uuid";

const transactionModel = new TransactionModel(dbPool);

export const transferMoney = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = (req as any).user?.user_id;
    const { receiver_account, amount, description } = req.body;

    if (!receiver_account || !amount) {
      res
        .status(400)
        .json({
          status: "error",
          message: "Missing required fields receiver account and amount",
        });
      return;
    }

    if (!/^\d{12}$/.test(receiver_account)) {
      res
        .status(400)
        .json({
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
      res
        .status(400)
        .json({
          status: "error",
          message: "Cannot transfer to your own account",
        });
      return;
    }

    if (senderAccount.status !== "approved") {
      res
        .status(403)
        .json({
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
      res
        .status(403)
        .json({
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
