
//        OUTDATED VERSION. THE COMPONENT WAS SPLITTED, PLEASE LOOK dropdown & lookup COMPONENTS

import { LightningElement, api, track, wire } from 'lwc';
import ICONS from "@salesforce/resourceUrl/icons"
import selectRecordsFromAnysObject from '@salesforce/apex/dropdownLookupController.selectRecordsFromAnysObject';
import {handleInputKeyUp} from './keyboard';
const APEX_DELAY=300;
const BLUR_DELAY=100;
const FIELD_TO_DISPLAY_NAME = 'fieldToDisplay';



export default class DropdownLookup extends LightningElement {

    @api sObjectName;
    @api commaSeparatedFields = 'Name';
    @api sqlWhereClause = '';
    @api alreadySelectedOptionId = '';
    @api label = 'Name';
    @api placeholder = 'Search...';

    options;
    error;

    @track selectedOption;

    @track searchKey = '';

    selectedOptionDisplayField;
    mouseOverDropdown = false;
    dropdownOpen = false;
    highlight = false;
    showSpinner = false;
    incomingOptionIsNotSelectedYet = true;
    focusOnReadonlyFlag = false;


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

                newOption[FIELD_TO_DISPLAY_NAME] = option[keys[0]];
                this.options.push(newOption);
            });
            if (this.incomingOptionIsNotSelectedYet){
                this.chooseIncomingOption();
            }
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
        if (this.dropdownOpen) {
            this.focusOnSearchInput();
        } else if (this.focusOnReadonlyFlag) {
            this.focusOnReadonlyFlag = false;
            this.focusOnReadonlyInput();
        }
    }

    chooseIncomingOption() { 
        if (this.alreadySelectedOptionId) {
                this.incomingOptionIsNotSelectedYet = false;
                this.options.forEach(option => {
                    if (option.Id == this.alreadySelectedOptionId) {
                        const keys = Object.keys(option);
                        this.clearObject(this.selectedOption);
                        keys.forEach (key => {
                            this.selectedOption[key] = option[key];
                        });
                        this.selectedOptionDisplayField = this.selectedOption[FIELD_TO_DISPLAY_NAME];
                    }
                });
        } else {
            this.incomingOptionIsNotSelectedYet = false;
        }
    }

    clearObject (obj) {
        const keys = Object.keys(obj);
        keys.forEach(key => {
            delete obj[key];
        });
    }

    clearSelectedOption() {
        this.selectedOptionDisplayField='';
        this.clearObject(this.selectedOption);
        const newEvent = new CustomEvent('change', {
            detail: this.selectedOption,
        });
        this.dispatchEvent(newEvent);
    }

    focusOnSearchInput() {
        const input = this.template.querySelector('.searchInput');
        if (input) {
            input.focus();
        }
    }

    focusOnReadonlyInput() {
        const input = this.template.querySelector('.readonlyInput');
        if (input) {
            input.focus();
        }
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
      
        this.selectedOptionDisplayField = this.selectedOption[FIELD_TO_DISPLAY_NAME];
        delete this.selectedOption[FIELD_TO_DISPLAY_NAME];

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
    }

    handleBlur(event) {
        if (this.mouseOverDropdown) {
            this.focusOnSearchInput();
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

    get closeIconUrl() {
        let iconUrl = ICONS + '/utility-sprite/svg/symbols.svg#close';
        return iconUrl;
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

    // Я СДЕЛАЛ ЭТО ТАК-ЖЕ, КАК В СТАНДАРТНОЙ КОМПОНЕНТЕ cBaseCombobox ДЛЯ ТОГО, ЧТОБЫ РАЗОБРАТЬСЯ, КАК ЭТО РАБОТАЕТ
    // НО ЗАЧЕМ ЭТО БЫЛО ТАК СДЕЛАНО, ПОМИМО ВОЗМОЖНОСТИ ВЫНЕСТИ ЧАСТЬ КОДА В ДРУГОЙ ФАЙЛ ? (keyboard.js)

    handleInputKeyUpEvent(event) {
        handleInputKeyUp({
            event               : event,
            currentIndex        : this.getHilightedIndex(),
            dropdownInterface   : this.dropdownKeyboardInterface
        });
    }

    getHilightedIndex() {
        // ЗАГЛУШКА
        return 0;
    }

    dropdownKeyboardInterface() {
        const that = this;
        return {
            closeDropdown() {
                console.log('closeDropdown()');
                that.dropdownOpen = false;
                that.focusOnReadonlyFlag = true;
            },

            openDropdown() {
                console.log('openDropdown()');
                that.dropdownOpen = true;
            },

            getIsDropdownOpen() {
                console.log('getIsDropdownOpen()');
                return that.dropdownOpen;
            },

            getSelectedOptionId() {
                console.log('getSelectedOptionId()');
                return that.selectedOption.Id;
            },

        }
    }

}

