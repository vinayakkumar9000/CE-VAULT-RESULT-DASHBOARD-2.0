<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CE-VAULT-RESULT-DASHBOARD-2.0 🎓

A modern, glassmorphic student result portal built with React, TypeScript, and Vite. This application provides an elegant interface for viewing student results, analytics, and profiles with AI-powered chat support.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff.svg)](https://vitejs.dev/)

View your app in AI Studio: https://ai.studio/apps/drive/1Ml-lZxoDS9Xa4wT_iuLO5A51dJlszR8a

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphic Design**: Beautiful glass panels with blur effects
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Custom Scrollbar**: Sleek, minimal scrollbar design
- **Smooth Animations**: Fluid transitions and hover effects

### 📊 Core Functionality
- **Student Search**: Quick roll number-based student lookup
- **Result Dashboard**: Comprehensive result display with grades and credits
- **Performance Analytics**: Visual charts and graphs using Recharts
- **Profile Management**: Detailed student profile view
- **AI ChatBot**: Gemini AI-powered assistance (requires API key)

### 🎯 Scroll Control UI

The application features an intelligent scroll-control system with dynamic buttons that enhance navigation:

#### **Scroll to Bottom Button** ⬇️
- **Visibility**: Appears automatically when page is scrollable and user is NOT at the bottom
- **Behavior**: Smoothly scrolls to the bottom of the page
- **Design**: Semi-transparent white button with glass effect
- **Location**: Bottom-right corner (fixed position)

#### **Scroll to Top Button** ⬆️
- **Visibility**: Appears ONLY when user reaches the bottom of the page
- **Behavior**: Smoothly scrolls back to the top
- **Design**: Blue-themed button with enhanced glow effect
- **Location**: Same position as bottom button (seamless transition)

#### **Key Features of Scroll Controls**:
- ✅ **Smart Detection**: Only appears on scrollable content
- ✅ **Smooth Transitions**: CSS-based fade and slide animations (500ms duration)
- ✅ **Hover Effects**: Scale transformation and enhanced shadows on hover
- ✅ **Interactive Tooltips**: Custom-styled tooltips with fade-in animation
- ✅ **Responsive Design**: Optimized positioning for mobile and desktop
- ✅ **Accessibility**: Proper ARIA labels for screen readers
- ✅ **Icon Animations**: Arrow icons animate on hover (up/down movement)
- ✅ **Glass Morphism**: Backdrop blur effects matching app theme

#### **Technical Implementation**:
```typescript
// Automatic scroll detection with 50px buffer
const isAtBottom = scrollTop + windowHeight >= docHeight - 50;

// Conditional rendering based on scroll position
{!isAtBottom && <ScrollToBottomButton />}
{isAtBottom && <ScrollToTopButton />}
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager
- **Gemini API Key** (optional, for AI chatbot feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinayakkumar9000/CE-VAULT-RESULT-DASHBOARD-2.0.git
   cd CE-VAULT-RESULT-DASHBOARD-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional)
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
CE-VAULT-RESULT-DASHBOARD-2.0/
├── components/           # React components
│   ├── ScrollControls.tsx    # Scroll navigation buttons
│   ├── Navbar.tsx           # Navigation bar
│   ├── ChatBot.tsx          # AI chatbot
│   ├── Charts.tsx           # Data visualizations
│   ├── GlassComponents.tsx  # Reusable glass UI elements
│   ├── StudentCreditCard.tsx # Student credit display
│   └── ElectricBorder.tsx   # Decorative border effects
├── pages/                # Page components
│   ├── Home.tsx             # Landing page
│   ├── Result.tsx           # Results display
│   ├── Dashboard.tsx        # Analytics dashboard
│   └── Profile.tsx          # Student profile
├── services/             # External services
│   └── geminiService.ts     # Gemini AI integration
├── App.tsx               # Main application component
├── index.tsx             # Application entry point
├── types.ts              # TypeScript type definitions
├── mockData.ts           # Sample data
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies

```

## 🎨 Component Details

### ScrollControls Component

Located at: `components/ScrollControls.tsx`

**Features**:
- Automatic scroll position detection
- Dynamic button visibility based on scroll state
- Smooth scroll behavior
- Custom tooltips with animations
- Responsive positioning
- Zero visibility on non-scrollable pages

**Props**: None (self-contained)

**Usage**:
```tsx
import ScrollControls from './components/ScrollControls';

function App() {
  return (
    <div>
      {/* Your content */}
      <ScrollControls />
    </div>
  );
}
```

**Styling**:
- Utilizes Tailwind CSS utility classes
- Custom CSS animations for smooth fade-in effects
- Glass morphism with backdrop blur
- Responsive breakpoints (mobile/desktop)

## 🛠️ Technologies Used

- **React 19.2.1**: Modern React with latest features
- **TypeScript 5.8.2**: Type-safe development
- **Vite 6.2.0**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS (via CDN)
- **Lucide React**: Beautiful icon library
- **Recharts 3.5.1**: Composable charting library
- **Gemini AI**: Google's AI integration

## 🎓 Usage Examples

### Searching for Students

Use one of the sample roll numbers:
- `2023CS101` - Computer Science student
- `2023ME205` - Mechanical Engineering student

### Navigating Results

1. Search for a student using their roll number
2. View comprehensive results with semester-wise breakdown
3. Check performance analytics with charts
4. Access student profile for detailed information

### Using Scroll Controls

The scroll controls automatically appear when:
- Page content exceeds viewport height
- Scroll to Bottom: Visible when not at bottom
- Scroll to Top: Visible when reached bottom

## 🎯 Key Features Breakdown

### Glassmorphism Design
- Semi-transparent panels with blur effects
- Subtle borders and shadows
- Elegant color gradients
- Modern aesthetic

### Responsive Design
- Mobile-first approach
- Breakpoint optimizations
- Touch-friendly interactions
- Adaptive layouts

### Performance
- Optimized React rendering
- Lazy loading where applicable
- Efficient state management
- Fast build times with Vite

### Accessibility
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader compatibility

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Vinayak Kumar**
- GitHub: [@vinayakkumar9000](https://github.com/vinayakkumar9000)

## 🙏 Acknowledgments

- Google Gemini AI for chatbot functionality
- Lucide for beautiful icons
- Recharts for data visualization
- Tailwind CSS for styling utilities

## 📧 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

<div align="center">
Made with ❤️ for students and educators
</div>
