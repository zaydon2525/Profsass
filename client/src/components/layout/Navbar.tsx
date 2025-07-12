import { Link, useLocation } from 'wouter';
import { Bell, ChevronDown, Users, BookOpen, FileText, BarChart3, Home, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getNavigation = () => {
    const baseNavigation = [
      { name: 'Tableau de bord', href: '/dashboard', icon: Home, roles: ['admin', 'professor', 'student', 'parent'] },
      { name: 'Emploi du temps', href: '/schedule', icon: Calendar, roles: ['admin', 'professor', 'student', 'parent'] },
      { name: 'Messages', href: '/messages', icon: MessageSquare, roles: ['admin', 'professor', 'student', 'parent'] },
      { name: 'Supports', href: '/materials', icon: FileText, roles: ['admin', 'professor', 'student', 'parent'] },
      { name: 'Notes', href: '/grades', icon: BarChart3, roles: ['admin', 'professor', 'student', 'parent'] },
      { name: 'Utilisateurs', href: '/users', icon: Users, roles: ['admin', 'professor'] },
      { name: 'Groupes', href: '/groups', icon: BookOpen, roles: ['admin', 'professor'] },
    ];
    
    return baseNavigation.filter(item => 
      user?.role && item.roles.includes(user.role)
    );
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">École Connect</h1>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {getNavigation().map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <span className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400 hover:text-primary'
                    }`}>
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white text-sm font-medium">
                      {user ? getInitials(user.firstName, user.lastName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {user?.role === 'admin' ? 'Administrateur' : 
                     user?.role === 'professor' ? 'Professeur' : 
                     user?.role === 'student' ? 'Élève' : 'Utilisateur'}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
