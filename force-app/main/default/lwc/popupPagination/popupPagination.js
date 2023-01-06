import { api, LightningElement, track } from 'lwc';

export default class PopupPagination extends LightningElement {
    currentPage = 1;
    pageSizeOptions = [5,10,25,50,100];
    phoneList;
    recordSize = 5;
    totalPage = 0;
    @api
    set records(data) {
        if (data) {
            this.phoneList = data;
            this.totalPage = Math.ceil(data.length / this.recordSize)
            this.updateRecord()
        }
    }
    get records() {
        return this.visibleRecord;
    }
    get disablePrevious() {
        return this.currentPage <= 1;
    }
    get disableNext() {
        return this.currentPage >= this.totalPage;
    }
    previousHandler() {
        if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.updateRecord();
        }
    }

    nextHandler() {
        if (this.currentPage < this.totalPage) {
            this.currentPage = this.currentPage + 1;
            this.updateRecord();
        }
    }
    updateRecord() {
        if (this.currentPage > this.totalPage){
            this.currentPage = this.totalPage;
        }
        const start = (this.currentPage - 1) * this.recordSize;
        const end = this.recordSize * this.currentPage;
        this.visibleRecord = this.phoneList.slice(start, end);
        this.dispatchEvent(new CustomEvent('update', {
            detail: {
                records: this.visibleRecord
            }
        }))
    }
    handleRecordsPerPage(event){
        this.recordSize = event.target.value;
        this.updateRecord();
    }
}