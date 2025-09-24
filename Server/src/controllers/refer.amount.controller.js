import { ReferAmount } from "../models/add.refer.amount.model.js";
// Add Refer Amount
export const addReferAmount = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const newAmount = new ReferAmount({ amount });
    await newAmount.save();

    res.status(201).json({
      message: "Refer amount added successfully",
      data: newAmount,
    });
  } catch (error) {
    console.error("Error adding refer amount:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch all Refer Amounts
export const getReferAmounts = async (req, res) => {
  try {
    const amounts = await ReferAmount.find().sort({ createdAt: -1 });
    res.status(200).json(amounts);
  } catch (error) {
    console.error("Error fetching refer amounts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Refer Amount by ID
export const deleteReferAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ReferAmount.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Refer amount not found" });
    }

    res.status(200).json({ message: "Refer amount deleted successfully" });
  } catch (error) {
    console.error("Error deleting refer amount:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
