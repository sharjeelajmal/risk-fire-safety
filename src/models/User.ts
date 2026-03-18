import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'inspector'],
    default: 'inspector',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  customLists: {
    auftraggeber: { type: [String], default: [] },
    participants: { type: [String], default: [] },
    functions: { type: [String], default: [] },
    notes: { type: [String], default: [] }
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
