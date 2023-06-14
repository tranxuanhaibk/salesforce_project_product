import { LightningElement, api } from 'lwc';

export default class ShowCustomToast extends LightningElement {
    showModal = false;
    isConfirm = false;
    modalClass = '';
    modalTitle = '';
    @api errorMessages = [];
    @api modalTitle;

    @api
    showSuccessModal() {
        this.showModal = true;
        this.modalClass = 'modal modal-success slds-fade-in-open';
        this.modalIconName = 'utility:success';
    }

    @api
    showErrorModal() {
        this.showModal = true;
        this.modalClass = 'modal modal-error slds-fade-in-open';
        this.modalIconName = 'utility:error';
    }

    @api
    showWarningModal() {
        this.showModal = true;
        this.modalClass = 'modal modal-warning slds-fade-in-open';
        this.modalIconName = 'utility:warning';
        this.isConfirm = true;
    }

    @api
    closeModal() {
        this.showModal = false;
        this.modalClass = '';
        this.modalIconName = '';
        this.modalTitle = '';
        this.errorMessages = [];
    }
}