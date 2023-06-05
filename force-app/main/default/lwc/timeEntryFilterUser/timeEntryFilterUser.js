import { LightningElement, track  } from 'lwc';

export default class TimeEntryFilterUser extends LightningElement {
    @track firstName = 'First';
    @track lastName = 'Last';
    @track selectRecordId;
    @track selectRecordName;

    handleChange(event) {
        const field = event.target.name;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        }
    }

    get uppercasedFullName() {
        let s = `${this.firstName} ${this.lastName}`.trim().toUpperCase();
         //this.template.querySelector('lightning-input').value = '';
        return s;
    }

    selectedRecords(event) {
        console.log('selected record--------------');
    }
}