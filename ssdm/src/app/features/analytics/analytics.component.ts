import { Component, OnInit, signal, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService, SubjectService } from '../../core/services/api.services';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('pieChart') pieRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineRef!: ElementRef<HTMLCanvasElement>;

  metrics = signal({ totalHours: 0, completionRate: 0, overdueTasks: 0, productivityScore: 0 });
  loading = signal(true);
  chartsBuilt = false;

  constructor(private assignSvc: AssignmentService, private subjectSvc: SubjectService) {}

  ngOnInit() {
    this.subjectSvc.getAll().subscribe(subjects => {
      this.assignSvc.getAll().subscribe(assignments => {
        const total = assignments.length;
        const done = assignments.filter(a => a.status === 'Done').length;
        const overdue = assignments.filter(a => a.status !== 'Done' && new Date(a.dueDate) < new Date()).length;
        this.metrics.set({
          totalHours: 42,
          completionRate: total > 0 ? Math.round(done / total * 100) : 0,
          overdueTasks: overdue,
          productivityScore: Math.min(100, Math.round((done / Math.max(total, 1)) * 80 + (overdue === 0 ? 20 : 0)))
        });
        this.loading.set(false);
        setTimeout(() => {
          if (!this.chartsBuilt) {
            this.buildCharts(subjects, assignments);
            this.chartsBuilt = true;
          }
        }, 150);
      });
    });
  }

  buildCharts(subjects: any[], assignments: any[]) {
    if (this.pieRef?.nativeElement) {
      new Chart(this.pieRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: subjects.map(s => s.name),
          datasets: [{ data: subjects.map(s => s.assignmentsCount || 1), backgroundColor: subjects.map(s => s.color), borderWidth: 2, borderColor: '#fff' }]
        },
        options: { responsive: true, plugins: { legend: { position: 'right' } }, cutout: '60%' }
      });
    }
    if (this.barRef?.nativeElement) {
      new Chart(this.barRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ label: 'Study Hours', data: [2.5, 3, 1.5, 4, 2, 5, 1], backgroundColor: '#4F46E5', borderRadius: 6 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 6 } } }
      });
    }
    if (this.lineRef?.nativeElement) {
      new Chart(this.lineRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          datasets: [{ label: 'Productivity', data: [40, 55, 60, 52, 75, 80], borderColor: '#4F46E5', backgroundColor: 'rgba(79,70,229,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#4F46E5' }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
      });
    }
  }
}
