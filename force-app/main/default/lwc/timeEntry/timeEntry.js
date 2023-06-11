import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub'; 
import { CurrentPageReference } from 'lightning/navigation';
import getProjectList from '@salesforce/apex/TimeEntryController.getProjectList';

export default class TimeEntry extends LightningElement {
  weekdays = {};
  dateValue;
  userId = '';
  valueInput;
  valueStatus = 'inProgress';
  objectData = {};
  selectedValueRow = 3;
  showDatePicker = false;
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
      { label: '7', value: 7 },
    ];
  }

  @wire(CurrentPageReference) pageRef;
  
  connectedCallback() {
    registerListener('parentPublisher', this.handleGetUserId, this);
    this.getWeekDays(new Date());
    this.dateValue = this.convertFormatDate(new Date());
    console.log('this.dateValue ',this.dateValue);
    // console.log('dateValue , ', this.dateValue);
  }

  handleGetUserId(data) {
    this.userId = data;
  }

  getWeekDays(dateInput) {
    let currentDay = dateInput.getDay();
    if (currentDay == 0) {
      // indexOfSunday
      currentDay = 7;
    }
    console.log('currentDay ', currentDay);
    const startOfWeek = new Date(dateInput.getFullYear(), (dateInput.getMonth() + 1), dateInput.getDate() - (currentDay - 1));
    console.log('startOfWeek ', startOfWeek);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
      this.weekdays[this.weekDayKeys[i]] = date.getDate() + '/' + (date.getMonth());
    }
  }

  get objectDataEntries() {
    console.log(Object.entries(this.weekdays).map(([key, value]) => ({ key, value })));
    return Object.entries(this.weekdays).map(([key, value]) => ({ key, value }));
  }

  convertFormatDate(date) {
    // date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-`;
  }
  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  handleDatePickerSelect(event) {
    const selectedDate = event.detail.value;
    this.dateValue = selectedDate;
    this.showDatePicker = false;
  }
  
  handleDateChange(event) {
    this.dateValue = event.target.value;
    this.getWeekDays(new Date(this.dateValue));
  }

  handlePreviousWeek() {
    var dateInstance = new Date(this.dateValue);
    this.dateValue = new Date(dateInstance.setDate(dateInstance.getDate() - 7));
    console.log('dateInstance ', dateInstance);
    console.log('dateValue', this.dateValue);
    this.getWeekDays(this.dateValue);
    this.dateValue = this.convertFormatDate(this.dateValue);
  }

  handleNextWeek() {
    var dateInstance = new Date(this.dateValue);
    this.dateValue = new Date(dateInstance.setDate(dateInstance.getDate() + 7));
    console.log('dateInstance ', dateInstance);
    console.log('dateValue', this.dateValue);
    this.getWeekDays(this.dateValue);
    this.dateValue = this.convertFormatDate(this.dateValue);
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

  handleChangeInput(event) {
    this.valueInput = event.detail.value;
    const {dataset} = event.target;
    const rowIndex = dataset.rowIndex;
    const tdElement = event.target.closest('td');
    const columnsLabel = tdElement.getAttribute('data-colums-label');
    const columnsDate = tdElement.getAttribute('data-colums-date');
    const pattern = /^(([1-9]|1[0-5])(\.[0-9]{1,2})?)$|^16$/;
    console.log('pattern.test(inputValue) ', pattern.test(this.valueInput));
    if (pattern.test(this.valueInput)) {
      this.updateObjectData(this.objectData, rowIndex, columnsLabel, this.valueInput);
      let totalRow = this.handleCalculateRowSum(rowIndex, this.objectData);
      const tableRows = this.template.querySelectorAll('tbody tr');
      const tableRowIndex = parseInt(rowIndex) - 1;
      tableRows[tableRowIndex].childNodes[8].innerHTML = totalRow;
    }
    // const tableRows = this.template.querySelectorAll('tbody tr');
    // tableRows[0].childNodes[5].innerHTML = 3;
    // console.log('dataset.columnsLabel ',columnsLabel);
    // console.log('dataset.columnsDate ',columnsDate);
    // console.log('dataset.rowIndex ', rowIndex);
    // console.log('this.valueInput ', this.valueInput);

    // this.updateObjectData(this.objectData, rowIndex, columnsLabel, this.valueInput);
    // let totalRow = this.handleCalculateRowSum(rowIndex, this.objectData);
    // const tableRows = this.template.querySelectorAll('tbody tr');
    // const tableRowIndex = parseInt(rowIndex) - 1;
    // tableRows[tableRowIndex].childNodes[8].innerHTML = totalRow;
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
    if (this.selectedValueRow == 3) {
      this.rows = [1, 2, 3];
    } else if (this.selectedValueRow == 5){
      this.rows = [1, 2, 3, 4, 5];
    } else {
      this.rows = [1, 2, 3, 4, 5, 6, 7];
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