const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const upload = require('../config/cloudinary');
const Video = require('../models/Video');
const auth = require('../middleware/auth');

// @route   POST api/videos/upload
// @desc    Upload a video
// @access  Private
router.post(
  '/upload',
  [
    auth,
    upload.single('video'),
    check('title', 'Title is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, caption, tags } = req.body;
      const tagsArray = tags
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      // multer/cloudinary puts the uploaded file info on req.file
      if (!req.file || !req.file.path) {
        return res.status(400).json({ msg: 'Video upload failed' });
      }

      const newVideo = new Video({
        title,
        caption,
        tags: tagsArray,
        url: req.file.path,
        user: req.user.id,
      });

      const video = await newVideo.save();
      res.json(video);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/videos
// @desc    Get all videos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('user', ['name', 'userId'])
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/videos/:id
// @desc    Get video by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('user', [
      'name',
      'userId',
    ]);
    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.json(video);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Video not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/videos/:id/like
// @desc    Toggle like on a video
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ msg: 'Video not found' });
    }

    const userId = req.user.id;
    const alreadyLiked = video.likes.some(
      (like) => like.toString() === userId
    );

    if (alreadyLiked) {
      video.likes = video.likes.filter((like) => like.toString() !== userId);
    } else {
      video.likes.unshift(userId);
    }

    await video.save();
    res.json({ likes: video.likes.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/videos/:id/comment
// @desc    Add a comment to a video
// @access  Private
router.post(
  '/:id/comment',
  [auth, check('text', 'Text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const video = await Video.findById(req.params.id);

      if (!video) {
        return res.status(404).json({ msg: 'Video not found' });
      }

      const comment = {
        user: req.user.id,
        text: req.body.text,
      };

      video.comments.unshift(comment);

      await video.save();
      res.json(video.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
