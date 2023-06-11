import { LightningElement, wire, api, track } from 'lwc';
import getObjects from '@salesforce/apex/customLookupController.getResults';
export default class LwcCustomLookup extends LightningElement {
    valueInput = '';
    recordId;
    recordList = [];
    messageResult = false;
    isShowResult = true;   
    showSearchedValues = false;
    // isDisabled = true;

    @api objectName;
    @api filterField;
    @api rowNumber;
    @api isUser;
    // @api projectAssignment = [];

    // connectedCallback() {
    //     if (this.isUser == 'true') {
    //         this.isDisabled =false;
    //     }
    // }

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
        let number =  this.rowNumber ? this.rowNumber : '';
        const selectedEvent = new CustomEvent('selected', {
            rowNumber: number,
            detail: this.recordId });
        this.dispatchEvent(selectedEvent);
    }

    handleFocus() {
        // let arrayNew = [];
        // if (this.projectAssignment) {
        //     console.log('this.projectAssignment ', Object.keys(this.projectAssignment).length);
        //     console.log('this.projectAssignment ', arrayNew[this.projectAssignment]);
        //     // this.showSearchedValues = true;
        //     // Object.keys(this.projectAssignment).forEach(function(key) {
        //     //     console.log('this.projectAssignmentkey ', key);
        //     // });
        //     // console.log('this.projectAssignment ', this.projectAssignment);
        //     // this.recordList = this.projectAssignment;
        // }
    }

    handleBlur(){
        // this.recordList = [];
        // this.showSearchedValues = false;
    }
}