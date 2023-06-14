import { LightningElement, wire } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import getProjectAssignment from '@salesforce/apex/TimeEntryController.getProjectAssignment';

export default class TimeEntryFilterUser extends LightningElement {
    userId = '';

    @wire(CurrentPageReference) pageRef;
    handleFilter(event) {
        this.userId = event.detail;
        fireEvent(this.pageRef, 'parentPublisher', this.userId);
    }
}