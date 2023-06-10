import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub'; 
import { CurrentPageReference } from 'lightning/navigation';
import getProjectList from '@salesforce/apex/TimeEntryController.getProjectList';

export default class TimeEntry extends LightningElement {
  weekdays = {};
  recordListParent = [];
  recordidListParent = [];
  dataValue;
  userId = '';
  valueInput;
  valueStatus = 'inProgress';
  objectData = {};
  selectedValueRow = 3;
  dayObject = {'1':'monday', '2':'tuesday', '3':'webnesday'};
  weekDayKeys = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  @track rows = [1, 2, 3];

  get optionsStatus() {
    return [
      { label: 'New', value: 'new' },
      { label: 'In Progress', value: 'inProgress' },
      { label: 'Finished', value: 'finished' },
    ];
  }

  get optionsRow() {
    return [
      { label: '3', value: 3 },
      { label: '5', value: 5 },
      { label: '10', value: 10 },
    ];
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
  }

  getWeekDays(today) {
    const currentDay = today.getDay();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - currentDay);
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
      this.weekdays[this.weekDayKeys[i]] = day.getDate() + '/' + day.getMonth();
      console.log('this.weekdays ', this.weekdays);
    }
  }

  get objectDataEntries() {
    console.log(Object.entries(this.weekdays).map(([key, value]) => ({ key, value })));
    return Object.entries(this.weekdays).map(([key, value]) => ({ key, value }));
  }

  convertFormatDate(date) {
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  }

  handleLookupProject(event) {
    let projectId = event.detail;
    const rowIndex = event.target.rowNumber;
    console.log('objectData ', rowIndex);

    this.updateObjectData(this.objectData, rowIndex, 'projectId', projectId);
  }

  handleSaveData() {
    // todo
  }

  handleOnchangeInput(event) {
    this.valueInput = event.detail.value;
    const {dataset} = event.target;
    const rowIndex = dataset.rowIndex;
    const tdElement = event.target.closest('td');
    const columnsLabel = tdElement.getAttribute('data-colums-label');
    const columnsDate = tdElement.getAttribute('data-colums-date');

    // const tableRows = this.template.querySelectorAll('tbody tr');
    // tableRows[0].childNodes[5].innerHTML = 3;
    // console.log('dataset.columnsLabel ',columnsLabel);
    // console.log('dataset.columnsDate ',columnsDate);
    // console.log('dataset.rowIndex ', rowIndex);
    // console.log('this.valueInput ', this.valueInput);

    this.updateObjectData(this.objectData, rowIndex, columnsLabel, this.valueInput);
    let totalRow = this.handleCalculateRowSum(rowIndex, this.objectData);
    const tableRows = this.template.querySelectorAll('tbody tr');
    const tableRowIndex = parseInt(rowIndex) - 1;
    tableRows[tableRowIndex].childNodes[8].innerHTML = totalRow;
  }

  handleCalculateRowSum(rowIndex, objectOriginal) {
    let sum = 0.00;
    let keyDate = this.weekDayKeys;
    Object.keys(objectOriginal[rowIndex]).forEach(function(key) {
      if (keyDate.includes(key)) {
        sum += parseFloat(objectOriginal[rowIndex][key]);
      }
    });
    // console.log('sum of ' + rowIndex + ' ' + sum);
    return sum;
  }

  handleChangeStatus(event) {
    this.valueStatus = event.detail.value;
  }

  handleChangeRow(event) {
    this.selectedValueRow = +event.detail.value;
    console.log('selectedValueRow ', selectedValueRow);
    if (selectedValueRow == 5) {
      this.rows = [1, 2, 3, 4, 5];
    }
  }

  updateObjectData(objectOriginal, rowIndex, columnsLabel, valueInput) {
    if (Object.keys(objectOriginal).length > 0) {
      if (objectOriginal.hasOwnProperty(rowIndex)) {
        if (Object.keys(objectOriginal[rowIndex]).length == 0) {
          this.objectData[rowIndex] = {};
        }
      } else {
        this.objectData[rowIndex] = {};
      }
    } else {
      this.objectData[rowIndex] = {};
    }

    this.objectData[rowIndex][columnsLabel] = valueInput;
  }
}