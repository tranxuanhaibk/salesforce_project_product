import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub'; 
import { CurrentPageReference } from 'lightning/navigation';
import getProjectList from '@salesforce/apex/TimeEntryController.getProjectList';

export default class TimeEntry extends LightningElement {
  weekdays = [];
  recordListParent = [];
  recordidListParent = [];
  dataValue;
  userId = '';
  value = 'inProgress';

  get options() {
    return [
      { label: 'New', value: 'new' },
      { label: 'In Progress', value: 'inProgress' },
      { label: 'Finished', value: 'finished' },
    ];
  }

  handleChange(event) {
    this.value = event.detail.value;
  }

  @wire(CurrentPageReference) pageRef;
  
  connectedCallback() {
    registerListener('parentPublisher', this.handleGetUserId, this);
    this.getWeekDays(new Date());
    this.dataValue = this.convertFormatDate(new Date());
    console.log('dataValue , ', this.dataValue);
  }

  handleGetUserId(data) {
    this.userId = data;
    this.recordListParent = getProjectList({
      userId: this.userId
    }).then(data => {
      if (data) {
        return data;
      }
    }).catch(error => {
      console.log('error ', error);
    });

    console.log('recordListParent ', this.recordListParent);
  }

  getWeekDays(today) {
    const currentDay = today.getDay();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - currentDay);
    let nameDay = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
      this.weekdays.push(nameDay[i] + '\n' + day.getDate() + '/' + day.getMonth());
    }
  }

  convertFormatDate(date) {
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  }
}