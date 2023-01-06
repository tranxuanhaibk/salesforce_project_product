import { api, LightningElement, track } from 'lwc';
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

export default class PopupCreatePhone extends LightningElement {
    openModal = false;
    @api recordId;
    @api
    showModal() {
        this.openModal = true;
    }
    closeModal() {
        this.openModal = false;
    }
    objApiName = PHONE_OBJECT;
    fields = [NAME_FIELD, IMAGE_FIELD, MANUFACTURING_DATE, COLOR_FIELD, EXPIRATION_DATE, REMAINING_DATE, CACPACITY_FIELD, PRICE_FIELD];

    handleSuccess(event){
        const toastEvent = new ShowToastEvent({
            title: "Phone has been created successfully",
            message: "Phone Created: ",
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        this.dispatchEvent(new CustomEvent('success'))
    }
}