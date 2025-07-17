const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate('parent')
      .sort('name');
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

// Get category by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parent');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

// Create category (admin only)
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { name, description, parent } = req.body;
    
    const category = await Category.create({
      name,
      description,
      parent
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// Update category (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

// Delete category (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has child categories
    const hasChildren = await Category.findOne({ parent: req.params.id });
    if (hasChildren) {
      return res.status(400).json({
        message: 'Cannot delete category with child categories'
      });
    }

    await category.remove();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
