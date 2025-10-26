# Dfoods - Premium Organic Jaggery Website

A premium responsive website for "Dfoods" - an organic jaggery brand inspired by GudWorld's aesthetic. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎨 Design Theme

- **Colors**: Primary golden-orange (#E67E22, #F39C12), brown (#8B4513), deep red (#C0392B), cream backgrounds (#FDF6E3)
- **Aesthetic**: Traditional Indian jaggery with modern functionality
- **Style**: Warm, earthy tones throughout

## ✨ Features

### 🏠 Homepage
- **Hero Banner**: "Pure Traditional Sweetness" with compelling CTA
- **What We Do**: 4 interactive flip cards (Organic Farming, Traditional Processing, Quality Assurance, Farm-to-Table)
- **Product Categories**: 6 circular category cards with hover effects
- **Why Choose Us**: 4 flip cards highlighting key benefits
- **Testimonials**: Scrollable carousel with customer reviews and ratings

### 📄 Pages
- **About Page**: Company story, mission, values, process, and team
- **Products Page**: Filterable product listing with sorting and pagination
- **Product Detail**: Image gallery, size selection, quantity controls, and tabs
- **Contact Page**: Contact form, business information, and map placeholder
- **Rewards Page**: Loyalty program with points system

### 🛒 Shopping Cart
- **Persistent Storage**: Cart data saved in localStorage
- **Real-time Updates**: Cart counter and total updates instantly
- **Drawer Interface**: Slide-out cart with add/remove functionality
- **Toast Notifications**: User feedback for cart actions

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Mobile navigation and interactions
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)

### 🎭 Animations
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Flip Cards**: Interactive hover/click animations
- **Loading States**: Elegant loading spinners and transitions
- **Hover Effects**: Subtle animations on interactive elements

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## 📦 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── products/          # Products listing and detail pages
│   ├── rewards/           # Rewards page
│   ├── layout.tsx         # Root layout with header/footer
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/            # Header, Footer, CartDrawer
│   ├── sections/          # Page sections (Hero, Categories, etc.)
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and data
│   ├── data/              # Sample data (products, testimonials, team)
│   ├── store/             # Zustand store for cart management
│   └── utils/             # Utility functions
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dfoods-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Key Components

### Product Management
- **15+ Product Variations**: Different jaggery types and flavors
- **Category Filtering**: Filter by product type
- **Price Sorting**: Sort by price, rating, name
- **Stock Management**: In-stock/out-of-stock indicators

### Cart Functionality
- **Add to Cart**: With size and quantity selection
- **Remove Items**: Individual item removal
- **Update Quantities**: Increment/decrement controls
- **Persistent Storage**: Cart survives browser refresh

### User Experience
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error states
- **Form Validation**: Contact form validation
- **Accessibility**: ARIA labels and keyboard navigation

## 🎨 Customization

### Colors
The color scheme can be customized by updating Tailwind CSS classes:
- Primary: `#E67E22` (Golden Orange)
- Secondary: `#8B4513` (Brown)
- Accent: `#C0392B` (Deep Red)
- Background: `#FDF6E3` (Cream)

### Content
- **Products**: Update `src/lib/data/products.ts`
- **Testimonials**: Modify `src/lib/data/testimonials.ts`
- **Team**: Edit `src/lib/data/team.ts`

## 📱 Mobile Features

- **Hamburger Menu**: Collapsible navigation
- **Touch Gestures**: Swipeable carousels
- **Responsive Images**: Optimized for all devices
- **Mobile Cart**: Touch-friendly cart interface

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Component Structure**: Modular and reusable components
- **Performance**: Optimized images and lazy loading

## 🌟 Future Enhancements

- [ ] User authentication and accounts
- [ ] Payment integration
- [ ] Order tracking
- [ ] Product reviews and ratings
- [ ] Newsletter subscription
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Inventory management

## 📄 License

This project is created for demonstration purposes. Please ensure you have proper licensing for any production use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Dfoods** - Pure Traditional Sweetness 🍯