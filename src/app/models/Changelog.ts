import mongoose from 'mongoose';

const changelogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  owner: { type: String, required: true },
  repo: { type: String, required: true },
});

const Changelog = mongoose.models.Changelog || mongoose.model('Changelog', changelogSchema, 'changelogs');

export default Changelog;
