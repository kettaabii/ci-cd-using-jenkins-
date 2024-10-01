import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ChartData, ChartType, Chart, registerables } from 'chart.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, EventContentArg } from '@fullcalendar/core';
import { ProjectService } from '../../../../core/services/project.service';
import { UserService } from '../../../../core/services/user.service';
import { TaskService } from '../../../../core/services/task.service';
import { ResourceService } from '../../../../core/services/resource.service';

Chart.register(...registerables);

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {

  projectsPages: any;
  projects: any[] = [];
  page: number = 0;
  size: number = 10;
  sortField: string = 'name';
  sortDirection: string = 'asc';

  totalProjects: number = 0;
  totalResources: number = 0;
  totalUsers: number = 0;
  totalTasks: number = 0;

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Projects', 'Resources', 'Tasks'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF914C', '#FFBD59', '#D9D9D9']
      }
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Budget (in K)',
        data: [],
        backgroundColor: []
      }
    ]
  };
  public barChartType: ChartType = 'bar';

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventContent: this.eventContent.bind(this),
  };

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private taskService: TaskService,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    this.getProjects();
    this.getTotalUsers();
    this.getTotalTasks();
    this.getTotalResources();
  }

  getProjects(): void {
    this.projectService.getAllProjects(this.page, this.size, this.sortField, this.sortDirection).subscribe(
      (response: any) => {
        this.projectsPages = response;
        this.projects = response.content;
        this.totalProjects = response.totalElements;
        this.updateCharts();
        this.updateCalendarEvents();
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }

  getTotalUsers(): void {
    this.userService.getAllUsers(this.page, this.size, this.sortField, this.sortDirection).subscribe(
      (response: any) => {
        this.totalUsers = response.totalElements;
        this.updateCharts();
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  getTotalTasks(): void {
    this.taskService.getAllTasks(this.page, this.size, "title", this.sortDirection).subscribe(
      (response: any) => {
        this.totalTasks = response.totalElements;
        this.updateCharts();
      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
  }

  getTotalResources(): void {
    this.resourceService.getAllResources(this.page, this.size, "title", this.sortDirection).subscribe(
      (response: any) => {
        this.totalResources = response.totalElements;
        this.updateCharts();
      },
      (error) => {
        console.error('Error fetching resources', error);
      }
    );
  }

  generateRandomColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      colors.push(color);
    }
    return colors;
  }

  updateCalendarEvents() {
    const events = this.projects.map(project => ({
      title: project.name,
      start: project.dateStart,
      end: project.dateEnd,
      extendedProps: {
        contributors: [project.picture, "https://i.pinimg.com/originals/b7/df/a8/b7dfa8edeb817bcb1a13467bff00869b.jpg"],
        progress: project.progress
      }
    }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events: events
    };
  }

  eventContent(arg: EventContentArg) {
    const event = arg.event;
    const eventProps = event.extendedProps;

    const card = document.createElement('div');
    card.classList.add('fc-event-card');

    const title = document.createElement('div');
    title.classList.add('fc-title');
    title.textContent = event.title;
    card.appendChild(title);

    if (eventProps['contributors'] && Array.isArray(eventProps['contributors'])) {
      const contributorsContainer = document.createElement('div');
      contributorsContainer.classList.add('fc-contributors');

      eventProps['contributors'].forEach((url: string) => {
        const img = document.createElement('img');
        img.src = url;
        contributorsContainer.appendChild(img);
      });

      card.appendChild(contributorsContainer);
    }

    if (eventProps['progress'] !== undefined) {
      const progressContainer = document.createElement('div');
      progressContainer.classList.add('fc-progress');

      const progressBar = document.createElement('div');
      progressBar.classList.add('fc-progress-bar');
      progressBar.style.width = eventProps['progress'] + '%';

      progressContainer.appendChild(progressBar);
      card.appendChild(progressContainer);
    }

    return { domNodes: [card] };
  }

  updateCharts() {
    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [{
        data: [this.totalProjects, this.totalResources, this.totalTasks],
        backgroundColor: ['#FF914C', '#FFBD59', '#D9D9D9']
      }]
    };

    this.barChartData = {
      ...this.barChartData,
      labels: this.projects.map(project => project.name),
      datasets: [{
        label: 'Budget (in K)',
        data: this.projects.map(project => project.budget),
        backgroundColor: this.generateRandomColors(this.projects.length)
      }]
    };
  }
}