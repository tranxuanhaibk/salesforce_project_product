import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub'; 
import { CurrentPageReference } from 'lightning/navigation';
import getProjectAssignment from '@salesforce/apex/TimeEntryController.getProjectAssignment';
import createTimeCard from '@salesforce/apex/TimeEntryController.createTimeCard';
import createTimeCardSplit from '@salesforce/apex/TimeEntryController.createTimeCardSplit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TimeEntry extends LightningElement {
  weekdays = {};
  dateValue;
  userId = '';
  valueInput;
  valueStatus = 'inProgress';
  objectData = {};
  selectedValueRow = 3;
  showDatePicker = false;
  contentMessageArray = [];
  titleError = '';
  messageResult = false;
  weekDayKeys = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  weekDayForInsert = {};
  @track rows = [];

  projectAssignmentObject = [];

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
      { label: '5', value: 5 }
    ];
  }

  @wire(CurrentPageReference) pageRef;
  
  connectedCallback() {
    registerListener('parentPublisher', this.handleGetUserId, this);
    this.getWeekDays(new Date());
    this.dateValue = this.convertFormatDate(new Date());
    this.rows = [
      { id: 1, selectedValue: '', showSearchedValues: false, isNotData: false, isDisable: true},
      { id: 2, selectedValue: '', showSearchedValues: false, isNotData: false, isDisable: true},
      { id: 3, selectedValue: '', showSearchedValues: false, isNotData: false, isDisable: true}
    ];
    console.log('this.rows ',this.rows);
  }

  handleGetUserId(data) {
    this.userId = data;
  }

  handleBlur(event) {
    const rowIndex = event.target.dataset.rowIndex;
    const projectName = event.target.dataset.label;
    this.rows[rowIndex - 1].isNotData = false;
    this.rows[rowIndex - 1].showSearchedValues = false;
    this.rows[rowIndex - 1].selectedValue = projectName ? projectName : '';
    console.log('handleBlur ', this.rows);
  }

  handleFocus(event) {
    const rowIndex = event.target.dataset.rowIndex;
    getProjectAssignment({
      userId: this.userId
    }).then((result) => {
      if (result.length > 0) {
        this.projectAssignmentObject = result;
        this.rows.forEach((row, index) => {
          if ((index + 1) == rowIndex) {
            row.showSearchedValues = true;
          } else {
            row.showSearchedValues = false;
          }
        });
      } else {
        this.rows.forEach((row, index) => {
          if ((index + 1) == rowIndex) {
            row.isNotData = true;
          } else {
            row.isNotData = false;
          }
        });
      }
    });
    console.log('handleFocus ', this.rows);
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
      const dateOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
      this.weekdays[this.weekDayKeys[i]] = dateOfWeek.getDate() + '/' + dateOfWeek.getMonth() + '/' + dateOfWeek.getFullYear();
      this.weekDayForInsert[this.weekDayKeys[i]] = dateOfWeek.getFullYear() + '-' + dateOfWeek.getMonth() + '-' + dateOfWeek.getDate();
    }
  }

  get objectDataEntries() {
    console.log(Object.entries(this.weekdays).map(([key, value]) => ({ key, value })));
    return Object.entries(this.weekdays).map(([key, value]) => ({ key, value }));
  }

  convertFormatDate(date) {
    // date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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

  async handleSaveData() {
    const valid = this.checkValidateObjectData(this.objectData);
    if (!valid) {
      return;
    }

    const weeknumber = this.getWeekNumber(this.dateValue);
    await createTimeCard({
      objectTimeCard : this.objectData,
      weekNumber : weeknumber
    }).then((result) => {
      if (Object.keys(result).length > 0) {
        this.createTimeCardSplit(result);
        console.log('createTimeCard ', result);
      }
    }).catch((error) => {
      console.log('createTimeCard error ', error);
    });
  }

  async createTimeCardSplit(projectAssignmentMap) {
    await createTimeCardSplit({
      objectTimeCardSplit : this.objectData,
      weekDayForInsertObject : this.weekDayForInsert,
      projectAssignmentIdMap : projectAssignmentMap
    }).then((result) => {
      if (result.length > 0) {
        this.showToast('Thành Công', 'Bạn đã lưu thành công', 'success');
        console.log('createTimeCardSplit ', result);
      }
    }).catch((error) => {
      console.log('createTimeCardSplit error ', error);
    });
  }

  handleClickProjectAssignment(event) {
    console.log(' this.rows 12311 ');
    const projectName = event.target.dataset.label;
    const projectAssignmentId = event.target.dataset.value;
    const selectedIndex = event.target.dataset.rowIndex;
    console.log(' projectAssignmentId ',  projectAssignmentId);
    console.log(' selectedIndex ',  selectedIndex);
    this.rows[selectedIndex].selectedValue = projectName;
    this.rows[selectedIndex].showSearchedValues = false;
    this.rows[selectedIndex].isDisable = false;
    this.rows[selectedIndex].isNotData = false;
    this.updateObjectData(this.objectData, parseInt(selectedIndex) + 1, 'projectAssignmentId', projectAssignmentId);
    this.updateObjectData(this.objectData, parseInt(selectedIndex) + 1, 'projectName', projectName);
    console.log(' handleClickProjectAssignment ',  this.rows);
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
  }

  handleCalculateRowSum(rowIndex, objectOriginal) {
    let sum = 0.00;
    let keyDate = this.weekDayKeys;
    Object.keys(objectOriginal[rowIndex]).forEach(function(key) {
      if (keyDate.includes(key)) {
        sum += parseFloat(objectOriginal[rowIndex][key]);
      }
    });
    return sum;
  }

  handleChangeStatus(event) {
    this.valueStatus = event.detail.value;
  }

  handleChangeRow(event) {
    this.selectedValueRow = +event.detail.value;
    if (this.selectedValueRow == 3) {
      console.log(' handleChangeRow ', this.rows.length);
    } else {
      console.log(' handleChangeRow ', this.rows.length);
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

  getWeekNumber(dateInput) {
    let currentDate = new Date(dateInput);
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
    var weekNumber = Math.ceil(days / 7);
    return weekNumber;
  }

  showCustomToast(title, message, variant) {
    const toast = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
    });
    this.dispatchEvent(toast);
  }

  checkValidateObjectData(objectData) {
    console.log(' ============= ', objectData);
    if (this.checkDuplicateProjectName(objectData)) {
      this.showCustomToast('Lỗi', 'Không được trùng tên Project Assignment', 'error');
      return false;
    }

    let weekDayKeysRequired = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    let errorMessageArray = [];
    Object.keys(objectData).forEach(function(key) {
      // if (objectData[key].hasOwnProperty('SATURDAY')) {
      //   errorWarnningArray.push('Thứ 7 (' + objectData[key]['SATURDAY'] + ' giờ)');
      // }

      // if (objectData[key].hasOwnProperty('SUNDAY')) {
      //   errorWarnningArray.push('Chủ nhật (' + objectData[key]['SUNDAY'] + ' giờ)');
      // }

      Object.keys(objectData[key]).forEach(function(day) {
        if (weekDayKeysRequired.includes(day)) {
          weekDayKeysRequired = weekDayKeysRequired.filter(function(value) {
            return value != day;
          });
        }
      });

      if (weekDayKeysRequired.length > 0) {
        let errorMessage = 'Hàng thứ ' + key + ' : Mục ';
        errorMessage += weekDayKeysRequired.join(', ');
        errorMessageArray.push(errorMessage);
      }

      // if (errorWarnningArray.length > 0) {
      //   let errorMessage = 'Project Assigment: ' + objectData[key]['projectName'] + ' OT';
      //   errorMessage += errorWarnningArray.join(', ') + '?';
      //   errorWarnningArrayAll.push(errorMessage);
      // }
    });

    if (errorMessageArray.length > 0) {
      this.contentMessageArray = errorMessageArray;
      this.titleError = 'Vui lòng nhập'
      let custom = this.template.querySelector('c-show-custom-toast');
      custom.showErrorModal();
      return false;
    }

    // if (errorWarnningArrayAll.length > 0) {
    //   this.contentMessageArray = errorWarnningArrayAll;
    //   this.titleError = 'Nhắc nhở'
    //   let custom = this.template.querySelector('c-show-custom-toast');
    //   custom.showWarningModal();
    // }
    return true;
  }

  checkDuplicateProjectName(objectData) {
    let projectNameSet = new Set();
  
    for (let key in objectData) {
      if (objectData.hasOwnProperty(key)) {
        let project = objectData[key];
        let projectName = project.projectName;
  
        if (projectNameSet.has(projectName)) {
          return true;
        }
  
        projectNameSet.add(projectName);
      }
    }
  
    return false;
  }
}