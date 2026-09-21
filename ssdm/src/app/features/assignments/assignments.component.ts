import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AssignmentService,
  SubjectService,
} from '../../core/services/api.services';
import { Assignment, Subject } from '../../core/models/models';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './assignments.component.html',
})
export class AssignmentsComponent implements OnInit {
  assignments = signal<Assignment[]>([]);
  subjects = signal<Subject[]>([]);
  loading = signal(true);
  showModal = signal(false);
  editingId = signal<number | null>(null);
  form: FormGroup;

  filterSubject = signal('');
  filterPriority = signal('');
  filterStatus = signal('');
  searchQuery = signal('');

  priorities = ['Low', 'Medium', 'High'];
  statuses = ['NotStarted', 'InProgress', 'Done'];
  statusLabels: Record<string, string> = {
    NotStarted: 'Not Started',
    InProgress: 'In Progress',
    Done: 'Done',
  };

  filtered = computed(() => {
    let list = this.assignments();
    if (this.filterSubject())
      list = list.filter((a) => a.subjectId === +this.filterSubject());
    if (this.filterPriority())
      list = list.filter((a) => a.priority === this.filterPriority());
    if (this.filterStatus())
      list = list.filter((a) => a.status === this.filterStatus());
    const q = this.searchQuery().toLowerCase();
    if (q)
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subjectName.toLowerCase().includes(q),
      );
    return list;
  });

  constructor(
    private svc: AssignmentService,
    private subjectSvc: SubjectService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subjectId: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['Medium', Validators.required],
      status: ['NotStarted', Validators.required],
    });
  }

  ngOnInit() {
    this.subjectSvc.getAll().subscribe((s) => this.subjects.set(s));
    this.load();
    // Pre-filter if navigated from Subjects → View Details
    const subjectId = this.route.snapshot.queryParamMap.get('subjectId');
    if (subjectId) this.filterSubject.set(subjectId);
  }

  load() {
    this.svc.getAll().subscribe((data) => {
      this.assignments.set(data);
      this.loading.set(false);
    });
  }

  openAdd() {
    this.editingId.set(null);
    this.form.reset({ priority: 'Medium', status: 'NotStarted' });
    this.showModal.set(true);
  }
  openEdit(a: Assignment) {
    this.editingId.set(a.id);
    this.form.patchValue({ ...a, dueDate: a.dueDate.split('T')[0] });
    this.showModal.set(true);
  }
  closeModal() {
    this.showModal.set(false);
  }

  save() {
    if (this.form.invalid) return;
    const id = this.editingId();
    const obs = id
      ? this.svc.update(id, this.form.value)
      : this.svc.create(this.form.value);
    obs.subscribe(() => {
      this.closeModal();
      this.load();
    });
  }

  delete(id: number) {
    if (!confirm('Delete this assignment?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }

  isOverdue(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }
  priorityClass(p: string) {
    return (
      (
        {
          High: 'badge-high',
          Medium: 'badge-medium',
          Low: 'badge-low',
        } as Record<string, string>
      )[p] ?? ''
    );
  }
  statusClass(s: string) {
    return (
      (
        {
          Done: 'badge-low',
          InProgress: 'badge-info',
          NotStarted:
            'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
        } as Record<string, string>
      )[s] ?? ''
    );
  }
  formatDate(d: string) {
    return new Date(d).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
