import express from 'express';
import { authenticateAdmin } from '../middlewares/adminAuth.js';
import Product from '../models/Product.js';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import slugify from 'slugify'; // Install if needed

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ----------------------
// PUBLIC ROUTES
// ----------------------

// GET ALL PRODUCTS (public)
router.get('/products', async (req, res) => {
  console.log('Received GET request to /api/products');
  try {
    const products = await Product.find();
    console.log('Products fetched:', products.length);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE PRODUCT (public)
router.get('/products/:id', async (req, res) => {
  console.log(`Received GET request to /api/products/${req.params.id}`);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// ADMIN-PROTECTED ROUTES
// ----------------------

// UPLOAD CSV (temporarily without auth for testing)
router.post('/products/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const errors = [];
  let rowCount = 0;

  fs.createReadStream(req.file.path)
    .pipe(csvParser({
      mapHeaders: ({ header }) => header.trim(),
      skipEmptyLines: true
    }))
    .on('data', (row) => {
      rowCount++;
      try {
        console.log(`Processing row ${rowCount}:`, Object.keys(row));
        
        // Map CSV columns to schema - matching user's CSV format
        // Parse variants: "250g:80|500g:120|1kg:220" -> [{size: "250g", price: 80}, ...]
        let variantsArray = [];
        const variantsString = row.Variants || row.variants || row['Select Variant(Weight)'] || '';
        if (variantsString) {
          const variantPairs = variantsString.split('|');
          variantsArray = variantPairs.map(pair => {
            const [size, price] = pair.split(':');
            return {
              size: size?.trim() || '',
              price: parseFloat(price) || 0
            };
          }).filter(v => v.size && v.price);
        }

        const productData = {
          name: row.Name || row.name || row.Title || row.title,
          sku: row.SKU || row.sku,
          description: row.Description || row.description || '',
          ingredients: row.ingredients ? row.ingredients.split(',').map(i => i.trim()) : [],
          productInfo: row['Product Info'] || row['product information'] || row['Product Information'] || '',
          variants: variantsArray, // Structured variant objects with size and price
          tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
          category: row.Category || row.category,
          price: parseFloat(row.Price || row.price) || 0,
          originalPrice: parseFloat(row['Original Price (optional)'] || row['Original Price'] || row['original price']) || undefined,
          images: (row.Images || row.images || row['img src'] || row['Image URL']) ? (row.Images || row.images || row['img src'] || row['Image URL']).split(',').map(img => img.trim()) : [],
          quantity: parseInt(row.Quantity || row.quantity) || 100,
          status: 'in-stock'
        };
        
        console.log(`Parsed product:`, { 
          name: productData.name, 
          sku: productData.sku, 
          category: productData.category,
          price: productData.price,
          images: productData.images.length,
          tags: productData.tags,
          variants: productData.variants.length
        });
        
        // Validate required fields
        if (!productData.name || !productData.sku || !productData.category || !productData.price || productData.images.length === 0) {
          const missing = [];
          if (!productData.name) missing.push('name');
          if (!productData.sku) missing.push('sku');
          if (!productData.category) missing.push('category');
          if (!productData.price) missing.push('price');
          if (productData.images.length === 0) missing.push('images');
          
          errors.push(`Row ${rowCount} (SKU: ${productData.sku || 'unknown'}): Missing ${missing.join(', ')}`);
          console.log(`Validation failed for row ${rowCount}:`, missing);
          return;
        }

        // Generate slug
        productData.slug = slugify(productData.name, { lower: true, strict: true });
        
        results.push(productData);
        console.log(`Added product ${rowCount} to results`);
      } catch (err) {
        errors.push(`Row ${rowCount}: ${err.message}`);
        console.error(`Error parsing row ${rowCount}:`, err);
      }
    })
    .on('end', async () => {
      try {
        console.log(`CSV parsing complete. Processed ${rowCount} rows, got ${results.length} valid products`);
        
        // Clean up uploaded file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        if (results.length === 0) {
          console.log('No valid products found. Errors:', errors);
          return res.status(400).json({ 
            error: 'No valid products found in CSV',
            details: errors.length > 0 ? errors.join('; ') : 'Check CSV format and required fields'
          });
        }

        // Check for existing products and filter out duplicates
        const existingProducts = await Product.find({
          $or: results.map(product => ({ 
            $or: [
              { name: product.name },
              { sku: product.sku }
            ]
          }))
        });
        
        const existingNames = new Set(existingProducts.map(p => p.name));
        const existingSkus = new Set(existingProducts.map(p => p.sku));
        
        const newProducts = results.filter(product => 
          !existingNames.has(product.name) && !existingSkus.has(product.sku)
        );
        
        const duplicateCount = results.length - newProducts.length;
        
        if (newProducts.length === 0) {
          return res.status(200).json({ 
            message: `All ${results.length} products already exist in database`,
            count: 0,
            duplicates: duplicateCount,
            errors: errors.length > 0 ? errors : undefined
          });
        }
        
        // Insert only new products
        const insertedProducts = await Product.insertMany(newProducts, { ordered: false });
        
        console.log(`Successfully uploaded ${insertedProducts.length} new products, skipped ${duplicateCount} duplicates`);
        res.status(200).json({ 
          message: `Uploaded ${insertedProducts.length} new products${duplicateCount > 0 ? `, skipped ${duplicateCount} duplicates` : ''}`, 
          count: insertedProducts.length,
          duplicates: duplicateCount,
          errors: errors.length > 0 ? errors : undefined
        });
      } catch (err) {
        console.error('Error inserting products:', err);
        
        // Handle duplicate key errors
        if (err.code === 11000) {
          const insertedCount = err.result?.nInserted || 0;
          return res.status(200).json({ 
            message: `Uploaded ${insertedCount} products (some duplicates skipped)`,
            count: insertedCount
          });
        }
        
        res.status(500).json({ error: err.message });
      }
    })
    .on('error', (err) => {
      console.error('CSV parsing error:', err);
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Failed to parse CSV file: ' + err.message });
    });
});

// CREATE PRODUCT
router.post('/products', authenticateAdmin, async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    const { name, sku, category, images, price } = req.body;

    if (!name || !sku || !category || !price)
      return res.status(400).json({ error: 'Name, sku, category, and price are required' });

    // Check duplicate
    const existing = await Product.findOne({ $or: [{ name }, { sku }] });
    if (existing)
      return res
        .status(400)
        .json({ error: `Product with name '${name}' or sku '${sku}' already exists` });

    if (!images || images.length === 0)
      return res.status(400).json({ error: 'At least one image URL is required' });

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET ALL PRODUCTS (admin)
router.get('/products/admin', authenticateAdmin, async (req, res) => {
  console.log('Received GET request to /api/products/admin');
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE PRODUCT (admin)
router.get('/products/admin/:id', authenticateAdmin, async (req, res) => {
  console.log(`Received GET request to /api/products/admin/${req.params.id}`);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PRODUCT
router.put('/products/:id', authenticateAdmin, async (req, res) => {
  console.log('Updating product:', { id: req.params.id, data: req.body });
  try {
    const { name, sku, category, images, price } = req.body;

    if (!name || !sku || !category || !price)
      return res.status(400).json({ error: 'Name, sku, category, and price are required' });

    // Check duplicate (excluding same product)
    const existing = await Product.findOne({
      $or: [{ name }, { sku }],
      _id: { $ne: req.params.id },
    });
    if (existing)
      return res
        .status(400)
        .json({ error: `Product with name '${name}' or sku '${sku}' already exists` });

    if (!images || images.length === 0)
      return res.status(400).json({ error: 'At least one image URL is required' });

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE PRODUCT
router.delete('/products/:id', authenticateAdmin, async (req, res) => {
  console.log('Deleting product:', req.params.id);
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PRODUCT INVENTORY
router.put('/products/:id/inventory', authenticateAdmin, async (req, res) => {
  const { quantity } = req.body;
  console.log('Updating product inventory:', { id: req.params.id, quantity });
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.quantity = quantity;
    if (quantity > 20) product.status = 'in-stock';
    else if (quantity > 0) product.status = 'limited';
    else product.status = 'out-of-stock';

    await product.save();
    res.json({ message: 'Inventory updated', product });
  } catch (err) {
    console.error('Error updating product inventory:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;