const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      enum: ['Job', 'Company'],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType',
    },
  },
  { timestamps: true }
);

// Prevent duplicate bookmarks
bookmarkSchema.index(
  { userId: 1, itemType: 1, itemId: 1 },
  { unique: true }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);