FitLog - Fitness Tracker

https://img.shields.io/badge/FitLog-Fitness_Tracker-blue
https://img.shields.io/badge/React-18.2-blue
https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC
https://img.shields.io/badge/License-MIT-green

FitLog is a comprehensive fitness tracking application built with React and Tailwind CSS. Track your workouts, monitor progress with detailed analytics, and manage your fitness journey all in one place.

https://via.placeholder.com/800x400/3b82f6/ffffff?text=FitLog+Fitness+Tracker
✨ Features
📊 Workout Tracking

    Log Workouts: Add exercises with sets, reps, and weights

    Workout History: View and manage past workouts with filtering

    Workout Templates: Save and reuse your favorite routines

    Bulk Operations: Select multiple workouts for batch actions

📈 Advanced Analytics

    Progress Charts: Visualize your workout volume, sets, and frequency

    Comparison Charts: Compare current vs previous period performance

    Weekly/Monthly Stats: Track trends over time

    Goal Tracking: Monitor progress towards fitness goals

🎨 Modern UI/UX

    Dark/Light Theme: Toggle between themes for comfortable viewing

    Responsive Design: Works on desktop, tablet, and mobile

    Interactive Charts: Built with Recharts for detailed visualizations

    Intuitive Navigation: Clean and organized interface

🔄 CRUD Operations

    Create: Log new workouts with custom exercises

    Read: View workout history and templates

    Update: Edit existing workouts

    Delete: Remove workouts with confirmation

    Duplicate: Clone workouts for quick logging

🛠️ Advanced Features

    Export Data: Download workout data as JSON

    Exercise Library: Browse exercises with muscle group filtering

    Real-time Search: Filter workouts and exercises instantly

    Keyboard Shortcuts: Quick navigation with keyboard

    Loading States: Smooth transitions and loading indicators

🚀 Getting Started
Prerequisites

    Node.js 16.x or higher

    npm or yarn package manager

Installation

    Clone the repository
    bash

git clone https://github.com/yourusername/fitlog.git
cd fitlog

Install dependencies
bash

npm install
# or
yarn install

Start the development server
bash

npm run dev
# or
yarn dev

    Open in browser
    Navigate to http://localhost:5173

🏗️ Project Structure
text

fitlog/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── workouts/    # Workout-specific components
│   ├── context/         # React Context providers
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts

📁 Key Components
Context Providers

    WorkoutContext: Manages workout state and CRUD operations

    ThemeContext: Handles dark/light theme switching

    AuthContext: User authentication (stub implementation)

Pages

    Dashboard: Overview with stats and charts

    LogWorkout: Form to log new workouts

    History: Workout history with filtering

    Exercises: Exercise library browser

    Templates: Saved workout templates

Components

    ProgressChart: Main progress visualization

    ProgressComparisonChart: Period comparison charts

    WorkoutLog: Workout logging form

    WorkoutHistory: History display with CRUD

    EditWorkoutModal: Workout editing interface

    WorkoutTemplates: Template management

🔧 Technology Stack

    Frontend Framework: React 18

    Build Tool: Vite

    Styling: Tailwind CSS + PostCSS

    Charts: Recharts

    Date Handling: date-fns

    Routing: React Router DOM

    Icons: Emoji and Heroicons

    Code Quality: ESLint

🎨 Design System
Colors
css

Primary: Blue (3b82f6 - 1e3a8a)
Secondary: Purple (d946ef - 701a75)
Success: Green (10b981)
Warning: Yellow (f59e0b)
Error: Red (ef4444)

Typography

    Font Family: Inter (Google Fonts)

    Scale: Tailwind's default typography scale

Components

    Cards: bg-white rounded-xl shadow-lg p-6

    Buttons: Gradient backgrounds with hover states

    Inputs: Clean borders with focus rings

    Tables: Responsive with striped rows

    Modals: Centered with backdrop blur

📊 Data Structure
Workout Object
javascript

{
  id: Number,
  name: String,
  timestamp: ISOString,
  exercises: [
    {
      id: Number,
      name: String,
      sets: Number,
      reps: Number,
      weight: Number,
      notes: String
    }
  ],
  notes: String
}

Template Object
javascript

{
  id: Number,
  name: String,
  exercises: Array, // Same structure as workout exercises
  notes: String,
  isTemplate: Boolean,
  createdAt: ISOString
}

🚦 Development Workflow
Available Scripts
bash

npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint

Adding New Features

    Create component in appropriate directory

    Add to relevant context if state management needed

    Create route in App.jsx if new page

    Update Navbar for navigation

    Write tests if applicable

Styling Guidelines

    Use Tailwind utility classes

    Follow BEM-like naming for custom classes

    Use CSS variables for theming

    Mobile-first responsive design

📱 Responsive Design

The application is fully responsive with breakpoints:

    Mobile: < 640px

    Tablet: 640px - 1024px

    Desktop: > 1024px

Responsive Patterns

    Grid layouts with grid-cols-1 md:grid-cols-2 lg:grid-cols-3

    Flexbox with responsive direction

    Hidden elements with hidden md:block

    Responsive padding and margins

🔐 Security Considerations

    All data is stored locally (localStorage/Context)

    No sensitive data transmission

    Input validation on forms

    XSS protection through React's built-in escaping

🧪 Testing
Manual Testing Checklist

    Workout CRUD operations

    Theme switching

    Responsive layouts

    Form validation

    Chart rendering

    Data export/import

    Search and filtering

Automated Testing (Planned)

    Unit tests with Jest

    Component tests with React Testing Library

    E2E tests with Cypress

📈 Performance
Optimizations Implemented

    React.memo for expensive components

    Lazy loading for routes

    Optimized re-renders with useMemo/useCallback

    Efficient chart updates

    Debounced search inputs

Bundle Size

    Code splitting with React.lazy

    Tree shaking enabled

    Minified production builds

    Gzipped assets

🌐 Browser Support

    Chrome 90+

    Firefox 88+

    Safari 14+

    Edge 90+

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
🤝 Contributing

    Fork the repository

    Create a feature branch (git checkout -b feature/AmazingFeature)

    Commit your changes (git commit -m 'Add some AmazingFeature')

    Push to the branch (git push origin feature/AmazingFeature)

    Open a Pull Request

Code Style

    Follow ESLint configuration

    Use functional components with hooks

    Write meaningful commit messages

    Document new features in README

🚧 Roadmap
Phase 1: Core Features (Current)

    ✅ Workout logging and history

    ✅ Basic charts and statistics

    ✅ Dark/Light theme

    ✅ Workout templates

Phase 2: Enhanced Features

    User authentication

    Social features

    Mobile app (React Native)

    Cloud sync

    Advanced analytics

Phase 3: Enterprise Features

    Team/Group features

    Coach/trainer dashboard

    API integration

    Custom report generation

🆘 Troubleshooting
Common Issues

    Development server won't start
    bash

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

Styles not loading
bash

# Check Tailwind configuration
npm run build:css

    Charts not rendering

        Ensure Recharts is installed

        Check data format matches expected structure

    Theme not persisting

        Clear localStorage and refresh

        Check ThemeContext implementation

Debug Tips

    Check browser console for errors

    Use React DevTools for component inspection

    Verify context providers are properly wrapped

    Check network tab for failed requests

📚 Learning Resources

    React Documentation

    Tailwind CSS Docs

    Recharts Documentation

    Vite Documentation

🙏 Acknowledgements

    WGER API for exercise data

    Heroicons for beautiful icons

    date-fns for modern date handling

    Recharts for elegant chart components

📞 Support

For support, email support@fitlog.app or create an issue in the GitHub repository.