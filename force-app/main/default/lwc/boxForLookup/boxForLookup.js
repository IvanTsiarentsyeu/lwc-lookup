// COMPLEX COMPONENT, USES ONE CHILD TO CHOOSE SOBJECTS AND ANOTHER TO SELECT RECORDS IN IT

import { LightningElement, track } from 'lwc';
const FIELD_NAME = 'Name';
const FIELD_ID = 'Id';
const FIELD_NAME_API_NAME = 'nameFieldApiName';
const FIELD_NAME_API_LABEL = 'nameFieldLabel';

export default class BoxForLookup extends LightningElement {

    @track selectedSObject ={
        [FIELD_NAME] : '',
        [FIELD_ID]   : '',
    }
    @track selectedOption ={}

    showSelectedOptions = true;
    disableLookup = false;
        
    handleChangeSObject(event) {
        this.populate(this.selectedSObject, event);
        if (this.selectedSObject[FIELD_NAME]) {
            this.disableLookup = false;
        } else {
            this.disableLookup = true;
        }
    }

    handleChangeLookup(event) {
        this.populate(this.selectedOption, event);
        this.blink();
    }

    populate (obj, event) {
        this.clear(obj);
        const keys = Object.keys(event.detail);
        keys.forEach(key => {
            obj[key] = event.detail[key];
        });
    }

    clear (obj) {
        const keys = Object.keys(obj);
        keys.forEach(key => {
            delete obj[key];
        });
    }

    blink() {
        this.showSelectedOptions = false;
        this.showSelectedOptions = true;
    }


    sObjectToString (obj) {
        const keys = Object.keys(obj);
        let result = '';
        keys.forEach(key => {
            result = result + ' ' + key + '=' + obj[key] + ', '
        });
        return result;
    }

    get selectedSObjectName() {
        let name = '';
        if (this.selectedSObject[FIELD_ID]) {
            name = this.selectedSObject[FIELD_ID];
        }
        return name;
    }

    get selectedFieldName() {
        let name = '';
        if (this.selectedSObject[FIELD_NAME_API_NAME]) {
            name = this.selectedSObject[FIELD_NAME_API_NAME];
        }
        return name;
    }

    get selectedOptionToString () {
        return this.sObjectToString(this.selectedOption);
    }

    get selectedSObjectToString() {
        return this.sObjectToString(this.selectedSObject);
    }

    get label () {
        let label ='Name'; 
        if (this.selectedSObject[FIELD_NAME_API_LABEL]) {
            label = this.selectedSObject[FIELD_NAME_API_LABEL] ;
        }
        return label;
    }

    get placeholder() {
        let placeholder = 'Search ';
        if (this.selectedSObject[FIELD_NAME]) placeholder = placeholder + this.selectedSObject[FIELD_NAME] + 's';
        placeholder = placeholder + '...';
        return placeholder;
    }

}