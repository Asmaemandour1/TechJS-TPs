const mongoose = require('mongoose');

const STATUS = ['Read', 'Re-read', 'DNF', 'Currently reading', 'Returned Unread', 'Want to read'];
const FORMAT = ['Print', 'PDF', 'Ebook', 'AudioBook'];

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  numberOfPages: { type: Number, required: true, min: 1 },
  pagesRead: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: STATUS, default: 'Want to read' },
  price: { type: Number, default: 0 },
  format: { type: String, enum: FORMAT, default: 'Print' },
  suggestedBy: { type: String, default: '' },
  finished: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save calculate finished when pagesRead >= numberOfPages
BookSchema.pre('save', function (next) {
  if (this.pagesRead >= this.numberOfPages) this.finished = true;
  else this.finished = false;
  next();
});

// Instance method currentlyAt: returns percentage
BookSchema.methods.currentlyAt = function () {
  if (!this.numberOfPages || this.numberOfPages === 0) return 0;
  return Math.min(100, Math.round((this.pagesRead / this.numberOfPages) * 100));
};

// Static helper to delete by id
BookSchema.statics.deleteBook = async function (id) {
  return this.findByIdAndDelete(id);
};

const BookModel = mongoose.model('Book', BookSchema);

// Export both the Mongoose model and some constants for frontend use
module.exports = BookModel;
