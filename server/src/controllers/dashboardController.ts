import { Request, Response } from "express";
import { DashboardModel } from "../models/dashboardModels";
import { dbPool } from "../config/db";

const dashboardModel = new DashboardModel(dbPool);

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await dashboardModel.getTotalUsers();
    const totalApprovedAccounts = await dashboardModel.getTotalApprovedAccounts();
    const totalPendingAccounts = await dashboardModel.getTotalPendingAccounts();
    const totalTransactions = await dashboardModel.getTotalTransactions();
    const totalBankBalance = await dashboardModel.getTotalBankBalance(); 
    const recentAccountApplications = await dashboardModel.getRecentAccountApplications();
    const recentTransactions = await dashboardModel.getRecentTransactions();

    res.status(200).json({
      status: "success",
      message: "Dashboard data fetched successfully",
      data: {
        totalUsers,
        totalApprovedAccounts,
        totalPendingAccounts,
        totalTransactions,
        totalBankBalance, 
        recentAccountApplications,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching dashboard data",
    });
  }
};
