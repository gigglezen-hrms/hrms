# HRMS Pro - SaaS Human Resource Management System

A complete, visually appealing SaaS HRMS frontend built with React, TypeScript, Chakra UI, and Framer Motion.

## Features

### 🔐 Authentication & Authorization
- React Context-based authentication
- Role-based access control (5 roles: Super Admin, Tenant Admin, HR, Manager, Employee)
- localStorage persistence with demo data
- Protected routes with role-based redirects

### 👥 Role-Based Dashboards
- **Super Admin**: Tenant management, global analytics
- **Tenant Admin**: Department, employee, policy management
- **HR**: Employee, attendance, leave management with approvals
- **Manager**: Team management, team attendance/leaves tracking
- **Employee**: Personal attendance, leaves, payroll overview

### 📊 ME Section (Employee Dashboard)
- **Attendance Tab**: Check-in/out, attendance history, correction requests
- **Leaves Tab**: Leave balance tracking, apply for leaves, request history
- **Payroll Tab**: Monthly payslips, salary components, earnings/deductions

### 📱 Core Modules
- Dashboard Analytics (role-specific metrics)
- Employee Management
- Attendance Tracking
- Leave Management
- Payroll Processing
- Role & Permission Management
- Department & Designation Management
- Shift Management

### 🎨 UI/UX Features
- Gradient CTAs (purple to cyan)
- Glass-card design with blur effects
- Smooth Framer Motion animations
- Dynamic sidebar with role-based items
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Soft shadows and rounded corners

## Mock Data

Complete mock data structures for:
- 3 Tenants with multiple employees
- 8 Demo Employees across 5 departments
- 5 Leave Types with allocations & balances
- Attendance records with corrections
- Payroll components and payslips
- Teams, branches, locations

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **UI Library**: Chakra UI v2
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **State Management**: React Context
- **HTTP Client**: Axios (pattern only, no real API calls)

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   ├── TopNav.tsx
│   └── ProtectedRoute.tsx
├── contexts/            # React Context
│   └── AuthContext.tsx
├── pages/               # Page components
│   ├── dashboards/      # Role-based dashboards
│   ├── me/              # ME section tabs
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── PricingPage.tsx
│   └── ...
├── mock/                # Mock data
│   └── mockData.ts
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## API Integration Ready

Mock data uses `Promise.resolve()` with `setTimeout()` to simulate API latency. To replace with real API:

1. Update `mockApi` functions in `/src/mock/mockData.ts`
2. Replace with actual Axios calls
3. Update authentication to use httpOnly cookies
4. Implement real role-based permissions

## Sidebar Navigation

### Super Admin
- Dashboard
- Tenants

### Tenant Admin
- Dashboard
- Departments
- Designations
- Policies
- Shifts
- Employees
- Roles
- Settings
- ME

### HR
- Dashboard
- Employees
- Attendance
- Leaves
- Approvals
- ME

### Manager
- Dashboard
- My Team
- Team Attendance
- Team Leaves
- Approvals
- ME

### Employee
- Dashboard
- Attendance
- Leaves
- Profile
- Payroll
- ME

## Customization

### Colors
- Primary Gradient: `#6C5CE7` to `#00BFA6`
- Modify in component styles

### Mock Data
- Update `/src/mock/mockData.ts` for different data
- Add new entities following existing patterns
- Mock API functions support both resolved and rejected promises

### Styling
- Uses Chakra UI theming
- All components support light/dark mode
- Framer Motion for smooth transitions

## Performance Optimization

- Code splitting with React Router
- Lazy loading ready (prepare for dynamic imports)
- Optimized re-renders with proper memo usage
- Efficient form validation with React Hook Form

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please refer to the mock data structure in `/src/mock/mockData.ts` for understanding the data relationships.

---

**Note**: This is a demo application with mock data only. For production use, integrate with a real backend API and implement proper security measures including HTTPS, CSRF protection, and httpOnly cookies for authentication.
