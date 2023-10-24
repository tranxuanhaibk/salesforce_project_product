import { LightningElement, track, api, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getContactList from '@salesforce/apex/ContactBulkSendEmail.getContactList';

const columns=[
    {label:'FirstName', fieldName:'FirstName', type:'text'},  
    {label:'LastName', fieldName:'LastName', type:'text'},
    {label:'Email', fieldName:'Email', type:'email'},
    {label:'Phone', fieldName:'Phone', type:'phone'},
    {label: 'Detail', name:'detail',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'action:preview',
            name: 'detail',
            variant: 'border-filled',
            alternativeText: 'Detail'
        }
    },
    {label: 'Edit', name:'edit',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'action:edit',
            name: 'edit'
        }
    }
];

export default class SendBulkEmailContact extends LightningElement {
    @track contacts = [];
    @track contactData = [];
    @track searchTerm = '';
    @track selectAll = false;
    @track selectedRows = [];

    columns = columns;
    keyValue = '';
    refresh;
    recordId;
    listPaginationPhone;
    // SEARCH
    handleSearch(event){
        this.keyValue = event.target.value;
    }

    @wire(getContactList)
    wiredContactData({ data, error }) {
        if (data) {
            this.contactData = data;
        } else if (error) {
            const toastEvent = new ShowToastEvent({
                title: "Không có dữ liệu",
                variant: "destructive"
            });
            this.dispatchEvent(toastEvent);
        }
    }

    handleSendBulkMail() {
        console.log('selectedRows ' + this.selectedRows);
    }

    handleSelection(event) {
        this.selectedRows = event.detail.selectedRows.map(row => row.Id);
    }
}