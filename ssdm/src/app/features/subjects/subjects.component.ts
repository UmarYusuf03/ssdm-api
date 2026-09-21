import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SubjectService } from '../../core/services/api.services';
import { Subject } from '../../core/models/models';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subjects.component.html',
})
export class SubjectsComponent implements OnInit {
  subjects = signal<Subject[]>([]);
  loading = signal(true);
  showModal = signal(false);
  editingId = signal<number | null>(null);
  form: FormGroup;

  colors = [
    '#4F46E5',
    '#0EA5E9',
    '#22C55E',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
  ];

  constructor(
    private svc: SubjectService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      lecturer: [''],
      color: ['#4F46E5'],
    });
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.getAll().subscribe((data) => {
      this.subjects.set(data);
      this.loading.set(false);
    });
  }

  openAdd() {
    this.editingId.set(null);
    this.form.reset({ color: '#4F46E5' });
    this.showModal.set(true);
  }

  openEdit(s: Subject) {
    this.editingId.set(s.id);
    this.form.patchValue(s);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  save() {
    if (this.form.invalid) return;
    const dto = this.form.value;
    const id = this.editingId();
    const obs = id
      ? this.svc.update(id, { ...dto, progress: 0 })
      : this.svc.create(dto);
    obs.subscribe(() => {
      this.closeModal();
      this.load();
    });
  }

  delete(id: number) {
    if (!confirm('Delete this subject?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }

  viewDetails(subjectId: number) {
    this.router.navigate(['/assignments'], { queryParams: { subjectId } });
  }
}
