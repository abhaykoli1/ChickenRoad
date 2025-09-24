import mongoose from 'mongoose';

const gameRoundSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true,
    unique: true
  },
  winningNumber: {
    type: Number,
    required: true,
    min: 0,
    max: 9
  },
  winningColor: {
    type: String,
    required: true,
    enum: ['green', 'red', 'violet']
  },
  size: {
    type: String,
    required: true,
    enum: ['big', 'small']
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('ColorGameRound', gameRoundSchema);