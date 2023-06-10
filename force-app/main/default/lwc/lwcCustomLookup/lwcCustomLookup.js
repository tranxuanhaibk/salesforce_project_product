import { LightningElement, wire, api } from 'lwc';
import getObjects from '@salesforce/apex/customLookupController.getResults';
export default class LwcCustomLookup extends LightningElement {
    valueInput = '';
    recordId;
    recordList = [];
    messageResult = false;
    isShowResult = true;   
    showSearchedValues = false;

    @api objectName;
    @api filterField;
    @api rowNumber;

    @wire(getObjects, {objectName:'$objectName', fieldName:'$filterField', value:'$valueInput'})
    retrieveAccounts ({error, data}) {
        this.messageResult = false;
        if (data) {
            if (data.length > 0 && this.isShowResult) {
                console.log('data ', data);
                this.recordList = data;                
                this.showSearchedValues = true; 
                this.messageResult = false;
            } else if (data.length == 0) {
                this.recordList = [];     
                this.showSearchedValues = false;
                if (this.valueInput != '')
                   this.messageResult = true;
           }
        } else if (error) {
            this.recordId = '';
            this.valueInput = '';
            this.recordList = [];  
            this.showSearchedValues = false;
            this.messageResult=true;
       }
   }

    handleClick(event) {
        this.isShowResult = true;
        this.messageResult = false;
    }

    handleKeyChange(event) {       
        this.messageResult = false;
        this.valueInput = event.target.value;
    }

    handleParentSelection(event) {      
        this.showSearchedValues = false;
        this.isShowResult = false;
        this.messageResult = false;
        this.recordId =  event.target.dataset.value;
        this.valueInput =  event.target.dataset.label;   
        const selectedEvent = new CustomEvent('selected', {
            rowNumber: this.rowNumber,
            detail: this.recordId });
        this.dispatchEvent(selectedEvent);
    }
}