import { LightningElement, track } from 'lwc';
const FIELD_NAME = 'Name';
const FIELD_ID = 'Id';

export default class BoxForLookup extends LightningElement {

    @track selectedSObject ={
        [FIELD_NAME] : '',
        [FIELD_ID]   : '',
    }
    @track selectedField = {
        [FIELD_NAME] : '',
        [FIELD_ID]   : '',
    }
    @track selectedOption ={}

    showSelectedOptions = true;
        
    handleChangeSObject(event) {
        this.populate(this.selectedSObject, event);
    }

    handleChangeField(event) {
        this.populate(this.selectedField, event);
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
        if (this.selectedSObject[FIELD_ID]) name = this.selectedSObject[FIELD_ID];
        return name;
    }

    get selectedFieldName() {
        let name = '';
        if (this.selectedField[FIELD_ID]) name = this.selectedField[FIELD_ID];
        return name;
    }

    get selectedOptionToString () {
        return this.sObjectToString(this.selectedOption);
    }

    get selectedSObjectToString() {
        return this.sObjectToString(this.selectedSObject);
    }

    get selectedFieldToString() {
        return this.sObjectToString(this.selectedField);
    }



    get label () {
        let label ='.'; 
        if (this.selectedSObject[FIELD_NAME]) label = label + this.selectedSObject[FIELD_NAME];
        if (this.selectedField[FIELD_NAME]) label = label + ' ' + this.selectedField[FIELD_NAME];
        return label;
    }

    get placeholder() {
        let placeholder = 'Search ';
        if (this.selectedSObject[FIELD_NAME]) placeholder = placeholder + this.selectedSObject[FIELD_NAME] + 's';
        placeholder = placeholder + '...';
        return placeholder;
    }

}