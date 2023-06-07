import { LightningElement, wire } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation'; 

export default class TimeEntryFilterUser extends LightningElement {
    userId = '';

    @wire(CurrentPageReference) pageRef;
    handleFilter(event) {
        this.userId = event.detail;
        fireEvent(this.pageRef, 'parentPublisher', this.userId);
    }
}