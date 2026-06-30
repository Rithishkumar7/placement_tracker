import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    storeData: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const StoreModel = mongoose.models.Store || mongoose.model('Store', StoreSchema);
