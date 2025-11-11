# Navigation Guide - Adding Profile Links

## Quick Start

To add navigation links to the new profile pages, update your Layout or Navigation component.

## Option 1: Add to Sidebar/Navigation Menu

If you have a `Layout.tsx` or navigation component, add these links:

```tsx
import { User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// In your navigation menu:
<Link to="/my-profile" className="nav-link">
  <User size={20} />
  <span>My Profile</span>
</Link>

<Link to="/directory" className="nav-link">
  <Users size={20} />
  <span>Directory</span>
</Link>
```

## Option 2: Add to Header Dropdown

If you have a user dropdown menu in the header:

```tsx
import { User, Users, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

// In your dropdown menu:
<DropdownMenu>
  <DropdownMenuTrigger>
    <Avatar>...</Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem asChild>
      <Link to="/my-profile">
        <User className="mr-2" size={16} />
        My Profile
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link to="/directory">
        <Users className="mr-2" size={16} />
        Directory
      </Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
      <Link to="/settings">
        <Settings className="mr-2" size={16} />
        Settings
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut className="mr-2" size={16} />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Option 3: Update Existing Layout Component

If you have a `src/components/Layout.tsx`, you can add the links to your existing navigation structure.

### Example Layout Update:

```tsx
// src/components/Layout.tsx
import { Link, Outlet } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  Bell, 
  MessageSquare,
  User,        // Add this
  UserCircle   // Add this
} from 'lucide-react';

const navigationItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/alumni', icon: Users, label: 'Alumni' },
  { path: '/events', icon: Calendar, label: 'Events' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs' },
  { path: '/donations', icon: DollarSign, label: 'Donations' },
  { path: '/announcements', icon: Bell, label: 'Announcements' },
  { path: '/mentorship', icon: UserCircle, label: 'Mentorship' },
  { path: '/chats', icon: MessageSquare, label: 'Chats' },
  { path: '/my-profile', icon: User, label: 'My Profile' },      // Add this
  { path: '/directory', icon: Users, label: 'Directory' },       // Add this
];

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <nav className="p-4">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

## Testing Navigation

After adding the links, test:

1. **Click "My Profile"**
   - Should navigate to `/my-profile`
   - Should show your profile in view mode
   - Should have an "Edit Profile" button

2. **Click "Directory"**
   - Should navigate to `/directory`
   - Should show all public profiles
   - Should have search and filter functionality

## Styling Tips

### Active Link Highlighting

To highlight the active link:

```tsx
import { NavLink } from 'react-router-dom';

<NavLink
  to="/my-profile"
  className={({ isActive }) => 
    isActive 
      ? "nav-link bg-[#90EE90] text-black" 
      : "nav-link hover:bg-gray-100"
  }
>
  <User size={20} />
  <span>My Profile</span>
</NavLink>
```

### Mobile Responsive Menu

For mobile, you might want to use a hamburger menu:

```tsx
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Mobile menu button
<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
</button>

// Mobile menu
{mobileMenuOpen && (
  <div className="mobile-menu">
    <Link to="/my-profile" onClick={() => setMobileMenuOpen(false)}>
      My Profile
    </Link>
    <Link to="/directory" onClick={() => setMobileMenuOpen(false)}>
      Directory
    </Link>
  </div>
)}
```

## Icons Used

The implementation uses Lucide React icons:
- `User` - For "My Profile"
- `Users` - For "Directory"

Make sure to import them:
```tsx
import { User, Users } from 'lucide-react';
```

## Routes Available

After implementation, these routes are available:

- `/my-profile` - User's own profile (view/edit)
- `/directory` - Browse all public profiles
- `/profile` - Original profile page (if you want to keep it)

## Next Steps

1. Add navigation links to your Layout component
2. Test the navigation
3. Customize styling to match your app's design
4. Consider adding breadcrumbs for better UX
5. Add tooltips or badges if needed

## Example Complete Navigation

```tsx
const MainNavigation = () => {
  return (
    <nav className="flex space-x-4">
      <NavLink to="/dashboard" className="nav-item">
        Dashboard
      </NavLink>
      <NavLink to="/my-profile" className="nav-item">
        My Profile
      </NavLink>
      <NavLink to="/directory" className="nav-item">
        Directory
      </NavLink>
      <NavLink to="/events" className="nav-item">
        Events
      </NavLink>
      <NavLink to="/jobs" className="nav-item">
        Jobs
      </NavLink>
    </nav>
  );
};
```

That's it! Your profile management system is now fully integrated and accessible via navigation.
