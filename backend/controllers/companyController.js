const Company = require("../models/Company");


// company controller:
const createCompany = async (req, res) => {
  try {
    const { name, address, tagline } = req.body;

    const existingCompany = await Company.findOne({ user: req.user.id });
    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists for this user" });
    }

    const company = new Company({
      name: name || "Your Company",
      address: address || "Lahore, Pakistan",
      tagline: tagline || "Best Company",
      user: req.user.id,
    });

    await company.save();
    res.status(201).json(company);
  } catch (err) {
    // THIS LINE WILL REVEAL THE PROBLEM
    console.error("Error creating company:", err); 
    res.status(500).json({ message: err.message });
  }
};
// Get company
const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) return res.status(404).json({ message: "No company found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update company
const updateCompany = async (req, res) => {
  try {
    const { name, address, tagline } = req.body;

    const company = await Company.findOneAndUpdate(
      { user: req.user.id },
      { name, address, tagline },
      { new: true, runValidators: true }
    );

    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({ user: req.user.id });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCompany, getMyCompany, updateCompany, deleteCompany };
