const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Product = require('../models/Product');
const Search = require('../models/Search');
const Category = require('../models/Category');

// Search products
router.get('/products', async (req, res, next) => {
  try {
    const { 
      query,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10 
    } = req.query;

    const searchQuery = {};

    // Add text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Add category filter
    if (category) {
      searchQuery.category = category;
    }

    // Add price range filter
    if (minPrice) {
      searchQuery.price = { $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      searchQuery.price = searchQuery.price || {};
      searchQuery.price.$lte = parseFloat(maxPrice);
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get products
    const products = await Product.find(searchQuery)
      .populate('category')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Product.countDocuments(searchQuery);

    // Save search history if user is authenticated
    if (req.user) {
      await Search.create({
        user: req.user.id,
        query,
        location: req.user.location
      });
    }

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    next(error);
  }
});

// Get recent searches (for authenticated users)
router.get('/history', protect, async (req, res, next) => {
  try {
    const searches = await Search.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(10);
    res.status(200).json(searches);
  } catch (error) {
    next(error);
  }
});

// Get trending searches
router.get('/trending', async (req, res, next) => {
  try {
    const searches = await Search.aggregate([
      { $group: { 
        _id: '$query',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 }},
      { $limit: 10 }
    ]);
    res.status(200).json(searches);
  } catch (error) {
    next(error);
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort } = req.query;

    const products = await Product.find({ category: req.params.categoryId })
      .populate('category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Product.countDocuments({ category: req.params.categoryId });

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    next(error);
  }
});

// Get autocomplete suggestions
router.get('/suggest', async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const suggestions = await Product.find({
      name: { $regex: query, $options: 'i' }
    }, 'name')
    .limit(5);

    res.status(200).json(suggestions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
