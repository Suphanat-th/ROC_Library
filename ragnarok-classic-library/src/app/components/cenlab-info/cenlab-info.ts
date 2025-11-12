import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DateCell } from './date-cell/date-cell';
import { FormsModule } from '@angular/forms';
import { eventNames } from 'process';

interface CalendarEvent {
  event_date: string;
  event_title: string;
  event_theme: string;
}

@Component({
  selector: 'app-cenlab-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './cenlab-info.html',
  styleUrl: './cenlab-info.scss',
})
export class CenlabInfo {
  month: number = 0;
  year: number = 0;
  no_of_days: number[] = [];
  blankdays: number[] = [];
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  events: CalendarEvent[] = [];
  today = new Date();
  selectedEvent: CalendarEvent | null = null;

  ngOnInit() {
    const date = new Date();
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.getNoOfDays();
  }
  getCodeCenlab(day: number): { base2: string; accesCode: string } {
    const code = (day + (this.month + 1)) * 5;
    const base2 = code.toString(2).padStart(8, '0'); // แปลงเป็นเลขฐาน 2 ยาว 8 บิต
    const spaced = base2.slice(0, 4) + ' ' + base2.slice(4); // แทรกช่องว่างตรงกลาง
    return { base2: spaced, accesCode: code.toString() };
  }
  getNoOfDays() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const dayOfWeek = new Date(this.year, this.month).getDay();

    this.blankdays = Array.from({ length: dayOfWeek }, (_, i) => i + 1);
    this.no_of_days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    this.events = Array.from({ length: daysInMonth }, (_, i) => ({
      event_date: new Date(this.year, this.month, i + 1).toISOString(),
      event_title:
        this.getCodeCenlab(i + 1).base2 +
        '<div class="text-lg text-gray-700">' +
        this.getCodeCenlab(i + 1).accesCode +
        '</div>',
      event_theme: 'bg-[#ec4899]',
    })) as CalendarEvent[];
  }

  isToday(date: number) {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString();
  }

  getEventsForDate(date: number): CalendarEvent[] {
    const d = new Date(this.year, this.month, date).toDateString();
    return this.events.filter((ev) => new Date(ev.event_date).toDateString() === d);
  }

  openEventModal(event: CalendarEvent) {
    this.selectedEvent = event;
  }

  closeModal() {
    this.selectedEvent = null;
  }
}
