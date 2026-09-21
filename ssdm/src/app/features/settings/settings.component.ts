import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  auth = inject(AuthService);
  profileForm: FormGroup;
  passwordForm: FormGroup;
  darkMode = signal(localStorage.getItem('darkMode') === 'true');
  notifPrefs = signal<Record<string, boolean>>({
    deadlineReminders: true,
    studyReminders: true,
    weeklyReport: false,
  });
  reminderFrequency = signal(1);
  saved = signal(false);

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [this.auth.user()?.name ?? '', Validators.required],
      email: [
        this.auth.user()?.email ?? '',
        [Validators.required, Validators.email],
      ],
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  saveProfile() {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2500);
  }

  toggleDark() {
    this.darkMode.update((v) => !v);
    localStorage.setItem('darkMode', String(this.darkMode()));
    document.documentElement.classList.toggle('dark', this.darkMode());
  }

  toggleNotif(key: string) {
    this.notifPrefs.update((n) => ({ ...n, [key]: !(n as any)[key] }));
  }

  get notifs() {
    return this.notifPrefs();
  }
}
