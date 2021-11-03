import { LightningElement, api, track, wire } from 'lwc';
import ICONS from "@salesforce/resourceUrl/icons"
import selectRecordsFromAnysObject from '@salesforce/apex/dropdownLookupController.selectRecordsFromAnysObject';
const APEX_DELAY=300;
const BLUR_DELAY=100;


export default class DropdownLookup extends LightningElement {

    @api sObjectName;
    @api commaSeparatedFields;
    @api sqlWhereClause;
    @api label;
    @api placeholder;

    options;
    error;

    @track selectedOption;

    @track searchKey = '';
    selectedOptionDisplayField;
    mouseOverDropdown = false;
    dropdownOpen = false;
    highlight = false;
    showSpinner = false;

    @wire(selectRecordsFromAnysObject, { sObjectName: '$sObjectName', 
                                         fields:'$commaSeparatedFields', 
                                         clause:'$sqlWhereClause', 
                                         searchKey: '$searchKey' })
    wiredOptions ({ error, data }) {
        if (data) {
            this.error = undefined;
            this.options = [];
            data.forEach(option => {
                let newOption = {};
                const keys = Object.keys(option);
                keys.forEach(key => {
                    newOption[key] = option[key];
                });
                newOption['fieldToDisplay'] = option[keys[0]];
                this.options.push(newOption);
            });
            this.showSpinner = false;

        } else if (error) {
            this.error = error;
            this.options = undefined;
            console.error(error);
        }
    }

    connectedCallback() {
        this.selectedOption={};
        this.selectedOptionDisplayField='';
    }

    renderedCallback() {
        const searchInput = this.template.querySelector('.searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    clearObject (obj) {
        const keys = Object.keys(obj);
        keys.forEach(key => {
            delete obj[key];
        });
    }

    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
            this.showSpinner=true;
        }, APEX_DELAY);
    }

    handleListItemClick(event) {
        const selectedId = event.target.closest('li').dataset.value;
        this.options.forEach(option => {
            if (selectedId === option.Id) {
                const keys = Object.keys(option);
                this.clearObject(this.selectedOption);
                keys.forEach (key => {
                    this.selectedOption[key] = option[key];
                })
            }
        })
        this.selectedOptionDisplayField = this.selectedOption['fieldToDisplay'];
        delete this.selectedOption['fieldToDisplay'];
        const newEvent = new CustomEvent('change', {
            detail: this.selectedOption,
        });
        this.dispatchEvent(newEvent);
        this.searchKey = '';
        this.highlight = true;
        this.dropdownOpen = false;
    }


    handleReadonlyInputClick(event) {
        if (! this.selectedOption.Id) {    
            this.dropdownOpen = true;
        }
    }

    handleSearchClick () {
        console.warn('search pressed');
    }

    handleBlur(event) {
        if (this.mouseOverDropdown) {
            const searchInput = this.template.querySelector('.searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        } else {
            window.clearTimeout(this.delayTimeout);
            this.delayTimeout = setTimeout(() => {
                this.dropdownOpen = false; 
            }, BLUR_DELAY);
        }       
    }

    handleMouseOverDropdown(event) {
        this.mouseOverDropdown = true;
    }

    handleMouseOutDropdown(event) {
        this.mouseOverDropdown = false;
    }

    handleClearButton() {
        this.clearSelectedOption();         
        this.dropdownOpen = true;
    }

    handleUndoButton() {
        this.highlight = false;
        this.clearSelectedOption(); 
    }

    clearSelectedOption() {
            this.selectedOptionDisplayField='';
            this.clearObject(this.selectedOption);
            const newEvent = new CustomEvent('change', {
                detail: this.selectedOption,
            });
            this.dispatchEvent(newEvent);
        // }
    }

    get labelClass () {
        if (this.label && this.label != '') {
            return "slds-form-element__label slds-show";
        } else {
            return "slds-form-element__label slds-hide";
        }       
    }

    get mainDivClass() {
        if (this.highlight) {
            return "mainDiv lgc-highlight";
        } else {
            return "mainDiv";
        }
    }

    get closeIconUrl() {
        let iconUrl = ICONS + '/utility-sprite/svg/symbols.svg#close';
        return iconUrl;
    }

    get showDropdown(){
        return this.dropdownOpen;
    }

    get showDropdownClass () {
        if (this.dropdownOpen) {
            return "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open";
        } else {
            return "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
        }     
    }

    get showUndoAndDelete() {
        if (this.selectedOption.Id) {
            return true;
        } else {
            return false;
        }
    }
}

