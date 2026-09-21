import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SubjectService } from '../../core/services/api.services';
import { Subject } from '../../core/models/models';

interface PlanBlock { subjectName: string; color: string; startHour: number; duration: number; topic: string; }

@Component({
  selector: 'app-study-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './study-planner.component.html',
})
export class StudyPlannerComponent {
  subjects = signal<Subject[]>([]);
  selectedDay = signal('Mon');
  generatedPlan = signal<Record<string, PlanBlock[]> | null>(null);
  aiMessage = signal('');
  form: FormGroup;
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  constructor(private subjectSvc: SubjectService, private fb: FormBuilder) {
    this.form = this.fb.group({
      hoursPerDay: [4, [Validators.required, Validators.min(1), Validators.max(12)]],
      startTime: ['08:00', Validators.required],
      examDate: ['']
    });
    this.subjectSvc.getAll().subscribe(s => this.subjects.set(s));
  }

  generatePlan() {
    const subjects = this.subjects();
    if (!subjects.length) return;
    const hours = this.form.value.hoursPerDay;
    const plan: Record<string, PlanBlock[]> = {};
    this.days.forEach(day => {
      const blocks: PlanBlock[] = [];
      let currentHour = parseInt(this.form.value.startTime.split(':')[0]);
      subjects.forEach((s, i) => {
        const dur = i === 0 ? Math.ceil(hours * 0.4) : Math.floor(hours * 0.6 / Math.max(subjects.length - 1, 1));
        blocks.push({ subjectName: s.name, color: s.color, startHour: currentHour, duration: Math.max(1, dur), topic: 'Core concepts & practice' });
        currentHour += Math.max(1, dur);
      });
      plan[day] = blocks;
    });
    this.generatedPlan.set(plan);
    this.aiMessage.set(`Based on your priorities, ${subjects[0].name} gets 40% more study time this week.`);
  }

  formatHour(h: number): string {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:00 ${period}`;
  }

  currentDayBlocks(): PlanBlock[] {
    return this.generatedPlan()?.[this.selectedDay()] ?? [];
  }
}
