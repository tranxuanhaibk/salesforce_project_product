import { LightningElement, wire } from 'lwc';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getSearchListPhone from '@salesforce/apex/ListPhoneController.getSearchListPhone';
import deletePhones from '@salesforce/apex/ListPhoneController.deletePhone';

const columns=[  
    {label:'Phone Name',fieldName:'Name', type:'text'},  
    {label:'Image',fieldName:'Image__c', type:'url'},
    {label:'Color',fieldName:'Color__c'},
    {label:'Capacity',fieldName:'Capacity__c', type:'text'},  
    {label:'Price',fieldName:'Price__c'}, 
    {label:'Manufacturing Date',fieldName:'Manufacturing_Date__c', type:'date'},
    {label:'Expiration Date',fieldName:'Expiration_Date__c', type: 'date'},
    {label:'Remaining Date',fieldName:'Remaining_Date__c', type:'number'},
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
export default class ListPhone extends LightningElement {
    columns = columns;
    keyValue = '';
    refresh;
    recordId;
    listPaginationPhone;
    // SEARCH
    handleSearch(event){
        this.keyValue = event.target.value;
    }
    @wire(getSearchListPhone, { searchKey: '$keyValue' }) listPhone;

    updateListPhone(event){
        this.listPaginationPhone = [...event.detail.records];
    }
    createRecord(event){
        this.template.querySelector('c-popup-create-phone').showModal();
    }
    handleCreateSuccess(){
        refreshApex(this.listPhone);
    }

    // EDIT DETAIL
    handleRowAction(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.recordId = row.Id;
        switch (actionName) {
            case 'detail':
                this.template.querySelector('c-popup-edit-detail-phone').showDetailModal();
                break;
            case 'edit':
                this.template.querySelector('c-popup-edit-detail-phone').showEditModal();
                break;
            }
    }
    // DELETE
    deleteRecord(){  
        var selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
        console.log(JSON.stringify(selectedRecords));
        if (selectedRecords == ''){
            const toastEvent = new ShowToastEvent({
                title: "Please choice record you want to delete!",
                variant: "destructive"
            });
            this.dispatchEvent(toastEvent);
        } else {
            var result = confirm("Are you sure want to delete?");
            if (result){
                deletePhones({phoneList: selectedRecords})  
                .then(result=>{
                    return refreshApex(this.listPhone);  
                })  
                .catch(error=>{  
                    alert('Unable to delete the record due to'+JSON.stringify(error));  
                })
            }
        }
    }
}