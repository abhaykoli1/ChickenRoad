import Amount from "../models/telegram.amount.model.js";

// Create
export const createAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    const newAmount = new Amount({ amount });
    await newAmount.save();
    res.status(201).json(newAmount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All
export const getAllAmounts = async (req, res) => {
  try {
    const amounts = await Amount.find();
    res.json(amounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get One
export const getAmountById = async (req, res) => {
  try {
    const amount = await Amount.findById(req.params.id);
    if (!amount) return res.status(404).json({ message: "Amount not found" });
    res.json(amount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    const updatedAmount = await Amount.findByIdAndUpdate(
      req.params.id,
      { amount },
      { new: true }
    );
    if (!updatedAmount)
      return res.status(404).json({ message: "Amount not found" });
    res.json(updatedAmount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
export const deleteAmount = async (req, res) => {
  try {
    const deletedAmount = await Amount.findByIdAndDelete(req.params.id);
    if (!deletedAmount)
      return res.status(404).json({ message: "Amount not found" });
    res.json({ message: "Amount deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
