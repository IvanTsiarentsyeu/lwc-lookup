import { LightningElement, api, track, wire } from 'lwc';
import selectRecordsFromAnysObject from '@salesforce/apex/dropdownLookupController.selectRecordsFromAnysObject';
const DELAY=300;

export default class DropdownLookup extends LightningElement {
    

    @api sObjectName;
    @api lookupLabel;
    @api nameLikeUsingSqlSyntax;
    options;
    error;

    selectedOption = {
        Id : 'Some Id',
        Name : 'Some Name',
    }
    searchKey = '';
    dropdownOpen = false;

    @wire(selectRecordsFromAnysObject, { sObjectName: '$sObjectName', nameLike: '$nameLikeUsingSqlSyntax', searchKey: '$searchKey' })
    wiredOptions ({ error, data }) {
        if (data) {
            this.options = data;
            this.error = undefined;      
        } else if (error) {
            this.error = error;
            this.options = undefined;
            console.log(this.error);
        }
    }

    connectedCallback() {}

    renderedCallback() {}

    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }

    handleListItemClick(event) {
        this.dropdownOpen = false;
        this.selectedOption.Id = event.target.closest('li').dataset.value;
        this.selectedOption.Name = event.target.closest('li').dataset.label;
        const newEvent = new CustomEvent('change', {
            detail: this.selectedOption,
        });
        this.dispatchEvent(newEvent);
    }

    handleInputClick(event) {
        this.dropdownOpen = true;
    }

    handleBlur(event) {
        // console.log('-------------');
        // console.log(event.target.className);
        // console.log(event.target.tagName);
        // console.log(event.currentTarget.className);
        // console.log(event.currentTarget.tagName);
        // console.log(event.relatedTarget);

        // ТУТ НАДО ДОРАБОТАТЬ, ЧТОБЫ СПИСОК НЕ ЗАКРЫВАЛСЯ ПРИ НАЖАТИИ НА НЕГО

        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.dropdownOpen = false; 
        }, DELAY);       
    }

    get labelClass () {
        if (this.lookupLabel && this.lookupLabel != '') {
            return "slds-form-element__label slds-show";
        } else {
            return "slds-form-element__label slds-hide";
        }       
    }

    get showDropdownClass () {
        if (this.dropdownOpen) {
            return "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open";
        } else {
            return "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
        }     
    }
}

