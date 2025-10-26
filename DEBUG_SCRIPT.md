# 🔍 Debug Script - Find & Fix Issues

## Quick Commands to Run

### 1. Clear Cart (If Stuck with Old Items)
Open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

### 2. Check Product Data in Console
On products page, open console (F12) and run:
```javascript
fetch('http://localhost:5000/api/products')
  .then(r => r.json())
  .then(d => {
    console.log('Total Products:', d.length);
    console.log('First Product:', d[0]);
    console.log('Has Variants?', d[0]?.variants);
    console.log('Variants Data:', JSON.stringify(d[0]?.variants, null, 2));
  });
```

### 3. Check Single Product Detail
On product detail page (F12 console):
```javascript
// Replace ID with actual product ID from URL
fetch('http://localhost:5000/api/products/YOUR_PRODUCT_ID_HERE')
  .then(r => r.json())
  .then(d => {
    console.log('Product:', d);
    console.log('Variants:', d.variants);
    console.log('Price:', d.price);
    console.log('Images:', d.images);
  });
```

---

## Fix Commands

### Fix 1: Delete All Products (Clean Start)
**Warning: This deletes ALL products!**

In MongoDB or backend, you can clear products collection.

**Via Admin Panel:**
1. Go to /admin
2. Manually delete each product
3. Re-upload CSV

### Fix 2: Test with Sample Data
```
1. Download: sample-products-with-variants.csv
2. Open it - check variants column format
3. Upload in admin panel
4. Check /products page
```

---

## Expected Data Format

### Product with Variants (Correct Format):
```json
{
  "_id": "123",
  "name": "Product Name",
  "sku": "SKU123",
  "price": 120,
  "variants": [
    { "size": "250g", "price": 80 },
    { "size": "500g", "price": 120 },
    { "size": "1kg", "price": 220 }
  ],
  "tags": ["Organic", "Natural"],
  "images": ["url1", "url2"],
  "description": "Product description",
  "quantity": 100
}
```

### What Variants Should Look Like in Cards:
```
┌─────────┬─────────┬─────────┐
│  250g   │  500g   │  1kg    │
│  ₹80    │  ₹120   │  ₹220   │
└─────────┴─────────┴─────────┘
```

---

## If Variants Not Showing

### Check 1: Console Errors
```
1. Go to /products
2. F12 → Console
3. Look for red errors
4. Screenshot and send to me
```

### Check 2: Product Data
```
1. Click a product card
2. F12 → Console
3. Should see product data logged
4. Check if 'variants' field exists
5. Check if it's an array
```

### Check 3: Network Response
```
1. F12 → Network tab
2. Refresh /products page
3. Find /api/products request
4. Click it → Preview tab
5. Check if variants field is populated
```

---

## Common Issues & Solutions

### Issue: "Variants undefined"
**Solution:** Products don't have variants in database
```
1. Re-upload CSV with variants column
2. Format: "250g:80|500g:120|1kg:220"
```

### Issue: "Variants is string, not array"
**Solution:** Backend parsing issue
```
Check backend logs when uploading CSV
Should see: "variants: X" in parsed product log
```

### Issue: "Cart has old items"
**Solution:** localStorage persistence (normal behavior)
```javascript
// To clear:
localStorage.removeItem('cart-storage');
location.reload();
```

### Issue: "Product detail shows ₹0"
**Solution:** Price not set correctly
```
1. Check product in admin panel
2. Verify price field is filled
3. Verify variants have prices
```

---

## Test Checklist

### Products Page:
- [ ] Products load
- [ ] Product cards show image
- [ ] Product name shows
- [ ] Price shows
- [ ] Tags show (if any)
- [ ] **Variants show in small rectangles**
- [ ] Clicking variant changes price
- [ ] Add to cart works

### Product Detail Page:
- [ ] Large image shows
- [ ] Product name shows
- [ ] Vegetarian badge shows
- [ ] **Variants show in grid**
- [ ] **Clicking variant shows SKU/MRP**
- [ ] USP box shows (blue)
- [ ] Quantity controls work
- [ ] Add to Cart works
- [ ] Buy Now works

### Cart:
- [ ] Opens when clicking cart icon
- [ ] Shows items
- [ ] Shows quantity
- [ ] Shows price
- [ ] Total calculates correctly
- [ ] Can increase/decrease quantity
- [ ] Can remove items
- [ ] Can clear cart

### Admin:
- [ ] Contact submissions show
- [ ] Can change status
- [ ] Can delete submissions
- [ ] Products table shows all products
- [ ] CSV upload works

---

## Screenshots Needed (If Issues)

1. **Products Page:**
   - Full page screenshot
   - F12 Console (if errors)

2. **Product Detail Page:**
   - Full page
   - F12 Console
   - F12 Network → /api/products/:id response

3. **Cart:**
   - Cart drawer open
   - F12 Console

4. **Admin:**
   - Contacts section
   - Products table

---

## Send Me:

1. **Console errors** (screenshots)
2. **Network response** data (F12 → Network → Preview)
3. **Which issues** you're seeing:
   - [ ] Variants not showing
   - [ ] Prices wrong
   - [ ] Cart stuck
   - [ ] Product detail empty
   - [ ] Other (describe)

**Then I'll fix immediately! 🔧**

