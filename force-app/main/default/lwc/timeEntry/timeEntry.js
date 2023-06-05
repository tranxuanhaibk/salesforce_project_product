import { LightningElement } from 'lwc';

export default class TimeEntry extends LightningElement {
    weekdays = [];

  connectedCallback() {
    this.getWeekDays();
  }

  getWeekDays() {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - currentDay);
    let nameDay = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
      this.weekdays.push(nameDay[i] + '\n' + day.getDate() + '/' + day.getMonth());
    }
  }
}