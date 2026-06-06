const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [120, 'Title must not exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description must not exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Plumbing', 'Electrical', 'Security', 'Cleaning', 'Others'],
        message: 'Category must be one of: Plumbing, Electrical, Security, Cleaning, Others',
      },
    },
    flatNumber: {
      type: String,
      required: [true, 'Flat number is required'],
      trim: true,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Ticket must be associated with a user'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Resolved'],
        message: 'Status must be: Pending, In Progress, or Resolved',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries per user and status
ticketSchema.index({ raisedBy: 1, status: 1 });
ticketSchema.index({ status: 1 });

// Transform output: add id, remove __v
ticketSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
