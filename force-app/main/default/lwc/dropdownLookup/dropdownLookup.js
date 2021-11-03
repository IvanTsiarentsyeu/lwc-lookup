import { LightningElement, api, track, wire } from 'lwc';
import ICONS from "@salesforce/resourceUrl/icons"
import selectRecordsFromAnysObject from '@salesforce/apex/dropdownLookupController.selectRecordsFromAnysObject';
const APEX_DELAY=300;
const BLUR_DELAY=100;


export default class DropdownLookup extends LightningElement {

    @api sObjectName;
    @api commaSeparatedFields;
    @api displayFieldName;
    @api sqlWhereClause;
    @api label;
    @api placeholder;

    wired;
    options;
    error;

    @track selectedOption;

    @track searchKey = '';
    mouseOverDropdown = false;
    dropdownOpen = false;
    highlight = false;

    @wire(selectRecordsFromAnysObject, { sObjectName: '$sObjectName', 
                                         fields:'$commaSeparatedFields', 
                                         mainField: '$displayFieldName',
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
                newOption['fieldToDisplay'] = option[this.displayFieldName];
                this.options.push(newOption);
            });


            // this.wired = data;
            // this.error = undefined;
            // this.options = [];
            // this.wired.forEach(option => {
            //     let newOption = {};
            //     newOption['fieldToDisplay'] = option[this.displayFieldName];
            //     newOption.Name = option.Name;
            //     newOption.Id = option.Id;
            //     this.options.push(newOption);
            // });
        } else if (error) {
            this.error = error;
            this.wired = undefined;
            this.options = undefined;
            console.error(error);
        }
    }

    connectedCallback() {
        this.selectedOption={};
    }

    renderedCallback() {
        const searchInput = this.template.querySelector('.searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, APEX_DELAY);
    }

    handleListItemClick(event) {
        const selectedId = event.target.closest('li').dataset.value;
        this.options.forEach(option => {
            if (selectedId === option.Id) {
                const keys = Object.keys(option)
                keys.forEach (key => {
                    this.selectedOption[key] = option[key];
                })
            }
        })
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
        if (this.selectedOption.Id) {
            const keys = Object.keys(this.selectedOption);
            keys.forEach (key => {
                this.selectedOption[key] = ''
            })
            const newEvent = new CustomEvent('change', {
                detail: this.selectedOption,
            });
        this.dispatchEvent(newEvent);
        }
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

    get selectedOptionDisplayField () {
        if (this.selectedOption[this.displayFieldName]) {
            return this.selectedOption[this.displayFieldName];
        } else {
            return '';
        }
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

    get showSpinner() {
        // ПОКА НЕ ПОНИМАЮ, К ЧЕМУ ЕГО ПРИЦЕПИТЬ
        return true;
    }

    get showUndoAndDelete() {
        if (this.selectedOption.Id) {
            return true;
        } else {
            return false;
        }
    }
}

