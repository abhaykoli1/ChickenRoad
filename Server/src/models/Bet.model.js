import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true
  },
  betType: {
    type: String,
    required: true,
    enum: ['color', 'number', 'size']
  },
  betValue: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  multiplier: {
    type: Number,
    required: true,
    default: 1
  },
  userId: {
    type: String,
    required: true
  },
  isWon: {
    type: Boolean,
    default: false
  },
  payout: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Bet', betSchema);