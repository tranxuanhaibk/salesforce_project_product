import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import PHONE_OBJECT from '@salesforce/schema/Phone__c';
import NAME from '@salesforce/schema/Phone__c.Name';
import IMAGE from '@salesforce/schema/Phone__c.Image__c';
import MANUFACTURING_DATE from '@salesforce/schema/Phone__c.Manufacturing_Date__c';

export default class PopupEditPhone extends LightningElement {
    mode;
    objApiName = PHONE_OBJECT;
    fields = [NAME, IMAGE, MANUFACTURING_DATE];
    @api recordId;
    @track openModal = false;
    @api
    showModal() {
        console.log(this.recordId);
        this.openModal = true;
        this.mode = 'edit';
    }
    @api
    showDetailModal() {
        this.openModal = true;
        this.mode = 'readonly';
    }
    closeModal() {
        this.openModal = false;
    }
    handleSubmit(event){
        this.template.querySelector('lightning-record-form').submit();
        const toastEvent = new ShowToastEvent({
            title: "Phone has been update successfully",
            message: "Certificate edited: "+this.recordId,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        this.dispatchEvent(new CustomEvent('success'))
    }
}