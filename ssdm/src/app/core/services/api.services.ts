import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Subject,
  Assignment,
  StudyBlock,
  Notification,
  DashboardStats,
} from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private base = `${environment.apiUrl}/subjects`;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Subject[]>(this.base);
  }
  getById(id: number) {
    return this.http.get<Subject>(`${this.base}/${id}`);
  }
  create(dto: Partial<Subject>) {
    return this.http.post<Subject>(this.base, dto);
  }
  update(id: number, dto: Partial<Subject>) {
    return this.http.put(`${this.base}/${id}`, dto);
  }
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private base = `${environment.apiUrl}/assignments`;
  constructor(private http: HttpClient) {}

  getAll(filters?: { subjectId?: number; priority?: string; status?: string }) {
    let params = new HttpParams();
    if (filters?.subjectId) params = params.set('subjectId', filters.subjectId);
    if (filters?.priority) params = params.set('priority', filters.priority);
    if (filters?.status) params = params.set('status', filters.status);
    return this.http.get<Assignment[]>(this.base, { params });
  }

  create(dto: Partial<Assignment>) {
    return this.http.post<Assignment>(this.base, dto);
  }
  update(id: number, dto: Partial<Assignment>) {
    return this.http.put(`${this.base}/${id}`, dto);
  }
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class StudyBlockService {
  private base = `${environment.apiUrl}/studyblocks`;
  constructor(private http: HttpClient) {}

  getAll(date?: string) {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http.get<StudyBlock[]>(this.base, { params });
  }

  create(dto: Partial<StudyBlock>) {
    return this.http.post<StudyBlock>(this.base, dto);
  }
  update(id: number, dto: Partial<StudyBlock>) {
    return this.http.put(`${this.base}/${id}`, dto);
  }
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private base = `${environment.apiUrl}/notifications`;
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Notification[]>(this.base);
  }
  markRead(id: number) {
    return this.http.put(`${this.base}/${id}/read`, {});
  }
  markAllRead() {
    return this.http.put(`${this.base}/read-all`, {});
  }
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}
  getStats() {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/dashboard`);
  }
}
