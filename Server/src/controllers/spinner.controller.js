import Prize from "../models/spinner.model.js";

// ✅ Add a new document with full prizes array
export const addPrizes = async (req, res) => {
  try {
    const { prizes } = req.body; // array of strings
    const newPrizes = new Prize({ prizes });
    await newPrizes.save();
    res.status(201).json(newPrizes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all prize documents
export const getAllPrizes = async (req, res) => {
  try {
    const prizes = await Prize.find().sort({ createdAt: -1 });
    res.json(prizes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get one document by ID
export const getPrizeById = async (req, res) => {
  try {
    const { id } = req.params;
    const prize = await Prize.findById(id);

    if (!prize) return res.status(404).json({ message: "Prize not found" });
    res.json(prize);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Replace entire array by ID
export const updatePrizes = async (req, res) => {
  try {
    const { id } = req.params;
    const { prizes } = req.body;

    const updatedPrize = await Prize.findByIdAndUpdate(
      id,
      { prizes },
      { new: true }
    );

    if (!updatedPrize)
      return res.status(404).json({ message: "Prize not found" });

    res.json(updatedPrize);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add one new item into prizes array
export const addPrizeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { prize } = req.body; // single string

    const updatedPrize = await Prize.findByIdAndUpdate(
      id,
      { $push: { prizes: prize } }, // add item
      { new: true }
    );

    if (!updatedPrize)
      return res.status(404).json({ message: "Prize not found" });

    res.json(updatedPrize);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Remove one item from prizes array
export const removePrizeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { prize } = req.body; // item string to remove

    const updatedPrize = await Prize.findByIdAndUpdate(
      id,
      { $pull: { prizes: prize } }, // remove item
      { new: true }
    );

    if (!updatedPrize)
      return res.status(404).json({ message: "Prize not found" });

    res.json(updatedPrize);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete entire prize document
export const deletePrize = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPrize = await Prize.findByIdAndDelete(id);

    if (!deletedPrize)
      return res.status(404).json({ message: "Prize not found" });

    res.json({ message: "Prize document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
