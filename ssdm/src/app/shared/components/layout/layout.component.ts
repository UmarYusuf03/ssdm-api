import { Component, signal, computed, inject } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  auth = inject(AuthService);
  router = inject(Router);

  sidebarCollapsed = signal(false);
  darkMode = signal(localStorage.getItem('darkMode') === 'true');
  userMenuOpen = signal(false);
  mobileMenuOpen = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'home' },
    { label: 'Subjects', route: '/subjects', icon: 'book-open' },
    { label: 'Assignments', route: '/assignments', icon: 'clipboard-list' },
    { label: 'Study Planner', route: '/study-planner', icon: 'calendar-check' },
    { label: 'Calendar', route: '/calendar', icon: 'calendar' },
    { label: 'Analytics', route: '/analytics', icon: 'bar-chart-2' },
    { label: 'Notifications', route: '/notifications', icon: 'bell' },
    { label: 'Settings', route: '/settings', icon: 'settings' },
  ];

  pageTitle = computed(() => {
    const url = this.router.url;
    const item = this.navItems.find((n) => url.startsWith(n.route));
    return item?.label ?? 'Dashboard';
  });

  toggleSidebar() {
    this.sidebarCollapsed.update((v) => !v);
  }
  toggleDark() {
    this.darkMode.update((v) => !v);
    localStorage.setItem('darkMode', String(this.darkMode()));
    document.documentElement.classList.toggle('dark', this.darkMode());
  }
  toggleUserMenu() {
    this.userMenuOpen.update((v) => !v);
  }
  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  logout() {
    this.auth.logout();
  }

  getIcon(name: string): string {
    const icons: Record<string, string> = {
      home: '🏠',
      'book-open': '📚',
      'clipboard-list': '📝',
      'calendar-check': '🧠',
      calendar: '📅',
      'bar-chart-2': '📊',
      bell: '🔔',
      settings: '⚙️',
    };
    return icons[name] ?? '•';
  }
}
