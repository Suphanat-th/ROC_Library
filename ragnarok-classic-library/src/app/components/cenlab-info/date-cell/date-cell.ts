import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
interface Event {
  time: string;
  title: string;
  confirmed: boolean;
}

@Component({
  selector: 'app-date-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-cell.html',
  styleUrl: './date-cell.scss',
})
export class DateCell {
  @Input() day!: number;
  @Input() events: Event[] = [];
}
