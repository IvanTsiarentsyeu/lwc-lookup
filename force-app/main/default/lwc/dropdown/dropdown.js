// DROPDOWN WITH SEARCH, USES EXTERNAL DATA

import { LightningElement, api, track } from 'lwc';
import ICONS from "@salesforce/resourceUrl/icons";
import {handleInputKeyUp} from './keyboard';
const BLUR_DELAY=100;
const APEX_DELAY=300;
const FIELD_TO_DISPLAY_NAME = 'fieldToDisplay';


export default class Dropdown extends LightningElement {


    @api alreadySelectedOptionId = '';
    @api label = 'Name';
    @api placeholder = 'Search...';
    @api inputClass = 'standalone';

    @track selectedOption = {};
    @track searchKey = '';

    selectedOptionDisplayField='';
    mouseOverDropdown = false;
    dropdownOpen = false;
    highlight = false;
    showSpinner = false;
    incomingOptionIsNotSelectedYet = true;
    focusOnReadonlyFlag = false;

    _disabled = false;
    _options = [];

    @api
    get options(){
        return this._options;
    }
    set options(value){
        if (value) {
            if (this.selectedOptionDisplayField) {
                this.clearSelectedOption();
            }
            let newOptions = []
            value.forEach(option => {
                let newOption = {};
                const keys = Object.keys(option);
                keys.forEach(key => {
                    newOption[key] = option[key];
                })
                if (keys[0]) {
                    newOption[FIELD_TO_DISPLAY_NAME] = option[keys[0]];
                }
                newOptions.push(newOption);
            })
            this._options = newOptions;
            if (this.incomingOptionIsNotSelectedYet){
                this.chooseIncomingOption();
            }
            this.showSpinner = false;
        } else {
            console.warn('no value');
        }
    }

    @api
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        if (value == true) {
            this.searchKey = '';
            this.dropdownOpen = false;
            this.highlight = false;
            this._disabled = true;

        } else {
            this._disabled = false;
        }
    }


    connectedCallback() {
        this.showSpinner = true;
        this.clearSelectedOption;
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
                this._options.forEach(option => {
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
        this.searchKey = '';
        this.sendKeyChangeEvent(this.searchKey);
        this.selectedOptionDisplayField='';
        this.clearObject(this.selectedOption);
        this.sendChangeSelectedOptionEvent();
    }

    sendChangeSelectedOptionEvent() {
        let changeSelectedOptionEvent = new CustomEvent('change', {
            detail: this.selectedOption,
        });
        this.dispatchEvent(changeSelectedOptionEvent);
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
            this.sendKeyChangeEvent(this.searchKey);
            this.showSpinner = true;
        }, APEX_DELAY);
    }

    sendKeyChangeEvent(key) {
        let keyChangeEvent = new CustomEvent('keychange', {
            detail: key,
        });
        this.dispatchEvent(keyChangeEvent);
    }
  
    handleListItemClick(event) {
        const selectedId = event.target.closest('li').dataset.value;
        this._options.forEach(option => {
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
        this.sendChangeSelectedOptionEvent();
        this.highlight = true;
        this.dropdownOpen = false;
    }


    handleReadonlyInputClick(event) {
        if (! this.selectedOption.Id) {    
            this.dropdownOpen = true;
        }
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
        this.clearSelectedOption(); 
        this.highlight = false;
    }

    get closeIconUrl() {
        let iconUrl = ICONS + '/utility-sprite/svg/symbols.svg#close';
        return iconUrl;
    }

    get inputReadonlyClass() {
        return "slds-input slds-combobox__input readonlyInput " + this.inputClass;
    }

    get inputSearchClass() {
        return "slds-input slds-combobox__input searchInput " + this.inputClass;
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
            return this.inputClass + "Padding lgc-highlight";
        } else {
            return this.inputClass + "Padding";
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

    // далее ОБРАБОТКА РАБОТЫ С ВЫПАДАЮЩИМ СПИСКОМ С КЛАВИАТУРЫ (ПОКА НЕ РАБОТАЕТ)
    // ПО МОТИВАМ СТАНДАРТНОЙ КОМПОНЕНТЫ cBaseCombobox (часть кода вынесена в keyboard.js)

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
                console.log('KB closeDropdown()');
                that.dropdownOpen = false;
                that.focusOnReadonlyFlag = true;
            },

            openDropdown() {
                console.log('KB openDropdown()');
                that.dropdownOpen = true;
            },

            getIsDropdownOpen() {
                console.log('KB getIsDropdownOpen()');
                return that.dropdownOpen;
            },

            getSelectedOptionId() {
                console.log('KB getSelectedOptionId()');
                return that.selectedOption.Id;
            },

        }
    }
}
