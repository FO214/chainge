import mongoose from 'mongoose';

const commitSchema = new mongoose.Schema({
  sha: { type: String, required: true, unique: true },
  message: { type: String, required: true },
  date: { type: Date, required: true },
  changelogGenerated: { type: Boolean, default: false },
});

// Check if the model already exists to avoid overwriting
const Commit = mongoose.models.Commit || mongoose.model('Commit', commitSchema, 'commits');

export default Commit;
