import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/api.services';
import { Notification } from '../../core/models/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  loading = signal(true);
  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  constructor(private svc: NotificationService) {}

  ngOnInit() {
    this.svc.getAll().subscribe(data => { this.notifications.set(data); this.loading.set(false); });
  }

  markRead(id: number) {
    this.svc.markRead(id).subscribe(() =>
      this.notifications.update(list => list.map(n => n.id === id ? {...n, isRead: true} : n))
    );
  }

  markAllRead() {
    this.svc.markAllRead().subscribe(() =>
      this.notifications.update(list => list.map(n => ({...n, isRead: true})))
    );
  }

  delete(id: number) {
    this.svc.delete(id).subscribe(() =>
      this.notifications.update(list => list.filter(n => n.id !== id))
    );
  }

  typeClass(type: string): string {
    return ({ Info: 'badge-info', Warning: 'badge-warning', Urgent: 'badge-urgent' } as Record<string,string>)[type] ?? 'badge-info';
  }

  typeIcon(type: string): string {
    return ({ Info: '', Warning: '⚠️', Urgent: '🚨' } as Record<string,string>)[type] ?? '';
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}
