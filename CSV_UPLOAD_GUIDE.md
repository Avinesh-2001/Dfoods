# 📤 CSV Upload Guide for Products

## How to Upload Products via CSV

### Step 1: Login as Admin
**Important:** Only admin users can upload CSV files.

- Go to http://localhost:3000/login
- Login with admin credentials:
  - **Email:** `admin@dfoods.com`
  - **Password:** `admin123`

### Step 2: Go to Admin Dashboard
- After login, you'll be redirected to `/admin`
- Scroll to "Manage Products" section

### Step 3: Download Sample CSV
- Click "Download sample CSV template"
- This will download `sample-products.csv`

### Step 4: Prepare Your CSV File
Edit the CSV file with your product data following the format below.

---

## CSV File Format

### Required Columns:

| Column Name | Required | Description | Example |
|------------|----------|-------------|---------|
| `Title` | ✅ Yes | Product name | Premium Organic Jaggery |
| `SKU` | ✅ Yes | Unique product code | PJ001 |
| `category` | ✅ Yes | Product category | plain-jaggery |
| `price` | ✅ Yes | Selling price in ₹ | 250 |
| `img src` | ✅ Yes | Image URLs (comma-separated) | https://picsum.photos/400/400 |

### Optional Columns:

| Column Name | Required | Description | Example |
|------------|----------|-------------|---------|
| `description` | ❌ No | Product description | Pure organic jaggery made from sugarcane |
| `ingredients` | ❌ No | Comma-separated ingredients | Sugarcane juice, Natural minerals |
| `product information` | ❌ No | Additional product info | Rich in iron and minerals |
| `select variant(weight)` | ❌ No | Available sizes (comma-separated) | 500g,1kg,2kg |
| `tags` | ❌ No | Comma-separated tags | organic,healthy,natural |
| `original price` | ❌ No | Original price before discount | 300 |

---

## Valid Categories

Use one of these category values:
- `plain-jaggery`
- `jaggery-powder`
- `jaggery-cubes`
- `flavoured-jaggery`
- `gud-combo`

---

## Example CSV Content

```csv
Title,SKU,description,ingredients,product information,select variant(weight),tags,category,price,original price,img src
Premium Organic Jaggery,PJ001,"Pure organic jaggery","Sugarcane juice","Rich in iron","500g,1kg,2kg","organic,healthy",plain-jaggery,250,300,https://picsum.photos/400/400
Jaggery Powder,JP001,"Fine jaggery powder","Organic jaggery","Perfect for tea","250g,500g,1kg","powder,convenient",jaggery-powder,180,220,https://picsum.photos/400/400
```

---

## Important Notes

### 1. **CSV Format Rules:**
- Use commas (`,`) as separators
- Use quotes (`"`) for text with commas inside
- No empty rows at the end
- Column names must match exactly (case-sensitive)

### 2. **Multiple Values:**
For columns that accept multiple values (ingredients, variants, tags, images):
- Separate with commas: `500g,1kg,2kg`
- No spaces after commas (will be trimmed automatically)

### 3. **Images:**
- Use full URLs: `https://example.com/image.jpg`
- Multiple images: `https://img1.jpg,https://img2.jpg,https://img3.jpg`
- At least one image is required

### 4. **SKU (Stock Keeping Unit):**
- Must be unique for each product
- Cannot duplicate existing SKUs
- Letters, numbers, hyphens allowed: `PJ-001`, `JP_2023`

### 5. **Prices:**
- Numbers only (no ₹ symbol or commas)
- ✅ Correct: `250`
- ❌ Wrong: `₹250`, `2,50`, `Rs. 250`

---

## Step 5: Upload Your CSV

1. Click **"Choose File"** button
2. Select your prepared CSV file
3. Click **"Upload CSV"** button
4. Wait for success message
5. Products will appear in the table below

---

## Troubleshooting

### Error: "Please select a CSV file"
- Make sure you've selected a file
- Check file extension is `.csv`

### Error: "Admin access required"
- You're not logged in as admin
- Logout and login with admin credentials

### Error: "Missing required fields in CSV row"
- Check all required columns are present
- Verify: Title, SKU, category, price, img src

### Error: "Product with SKU already exists"
- SKU must be unique
- Change the SKU or delete existing product

### Network Error
- Make sure backend is running on port 5000
- Check MongoDB is connected
- Verify you're logged in as admin

---

## Sample Products Included

The sample CSV includes 5 products:
1. Premium Organic Jaggery
2. Jaggery Powder
3. Jaggery Cubes
4. Ginger Flavored Jaggery
5. Gud Combo Pack

Feel free to edit these or add more!

---

## Tips for Best Results

✅ **Do:**
- Test with sample CSV first
- Use valid image URLs
- Keep SKUs unique
- Use standard categories

❌ **Don't:**
- Add extra columns (they'll be ignored)
- Leave required fields empty
- Use duplicate SKUs
- Include special characters in SKU

---

## Need Help?

If you encounter issues:
1. Download and test with the sample CSV first
2. Verify you're logged in as admin
3. Check browser console for detailed errors
4. Verify backend server is running

---

**Happy Uploading! 🎉**

