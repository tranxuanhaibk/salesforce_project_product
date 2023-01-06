import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import PHONE_OBJECT from '@salesforce/schema/Phone__c';
import NAME_FIELD from '@salesforce/schema/Phone__c.Name';
import IMAGE_FIELD from '@salesforce/schema/Phone__c.Image__c';
import COLOR_FIELD from '@salesforce/schema/Phone__c.Color__c';
import MANUFACTURING_DATE from '@salesforce/schema/Phone__c.Manufacturing_Date__c';
import EXPIRATION_DATE from '@salesforce/schema/Phone__c.Expiration_Date__c';
import REMAINING_DATE from '@salesforce/schema/Phone__c.Remaining_Date__c';
import CACPACITY_FIELD from '@salesforce/schema/Phone__c.Capacity__c';
import PRICE_FIELD from '@salesforce/schema/Phone__c.Price__c';

export default class PopupEditDetailPhone extends LightningElement {
    mode;
    objApiName = PHONE_OBJECT;
    fields = [NAME_FIELD, IMAGE_FIELD, MANUFACTURING_DATE, COLOR_FIELD, EXPIRATION_DATE, REMAINING_DATE, CACPACITY_FIELD, PRICE_FIELD];
    @api recordId;
    @track openModal = false;
    @api
    showEditModal() {
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