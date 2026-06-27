import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, 'You are not allowed to create this comment')
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId !== req.user.id) {
      return next(
        errorHandler(403, 'Only the original author can edit this comment')
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, 'You are not allowed to delete this comment')
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
};

// Admins see every comment site-wide.
// Regular users see comments THEY personally left (since only admins can author posts).
export const getcomments = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;

    const filter = req.user.isAdmin ? {} : { userId: req.user.id };

    const comments = await Comment.find(filter)
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments(filter);
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      ...filter,
      createdAt: { $gte: oneMonthAgo },
    });

    // Enrich each comment with the commenter's name/role and the post title,
    // so the dashboard table can show human-readable info instead of raw IDs.
    const userIds = [...new Set(comments.map((c) => c.userId))];
    const postIds = [...new Set(comments.map((c) => c.postId))];

    const users = await User.find({ _id: { $in: userIds } }).select(
      'username isAdmin'
    );
    const posts = await Post.find({ _id: { $in: postIds } }).select('title');

    const userMap = {};
    users.forEach((u) => {
      userMap[u._id.toString()] = {
        username: u.username,
        isAdmin: u.isAdmin,
      };
    });
    const postMap = {};
    posts.forEach((p) => {
      postMap[p._id.toString()] = p.title;
    });

    const enrichedComments = comments.map((c) => ({
      ...c.toObject(),
      author: userMap[c.userId] || null,
      postTitle: postMap[c.postId] || null,
    }));

    res
      .status(200)
      .json({ comments: enrichedComments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
