import mongoose from 'mongoose';

const UploadSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

export const UploadModel = mongoose.models.Upload || mongoose.model('Upload', UploadSchema);
