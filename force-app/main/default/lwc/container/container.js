import { LightningElement, track } from 'lwc';
const APEX_DELAY = 300;

export default class Container extends LightningElement {
    
    @track selectedOption_1 ={}
    @track selectedOption_2 ={}

    @track sObject_1 = {
        name        : '',
        fields      : '',
        mainField   : '',
        clause      : '',
    };

    @track sObject_2 = {
        name        : '',
        fields      : '',
        mainField   : '',
        clause      : '',
    };

    showSelectedOptions = true;

    handleChange_1(event) {
        this.populate(this.selectedOption_1, event);
        this.blink();
    }

    handleChange_2(event) {
        this.populate(this.selectedOption_2, event);
        this.blink();
    }

    populate (obj, event) {
        const keys = Object.keys(event.detail);
        keys.forEach(key => {
            obj[key] = event.detail[key];
        });
    }

    blink() {
        this.showSelectedOptions = false;
        this.showSelectedOptions = true;
    }


    handleKeyChange_1_name(event) {         
            this.delayInput(event, this.sObject_1, 'name');
    }

    handleKeyChange_1_fields(event) {         
        this.delayInput(event, this.sObject_1, 'fields');
    }

    handleKeyChange_1_mainField(event) {         
        this.delayInput(event, this.sObject_1, 'mainField');
    }

    handleKeyChange_1_clause(event) {         
        this.delayInput(event, this.sObject_1, 'clause');
    }

    
    handleKeyChange_2_name(event) {         
        this.delayInput(event, this.sObject_2, 'name');
    }

    handleKeyChange_2_fields(event) {         
        this.delayInput(event, this.sObject_2, 'fields');
    }

    handleKeyChange_2_mainField(event) {         
        this.delayInput(event, this.sObject_2, 'mainField');
    }

    handleKeyChange_2_clause(event) {         
        this.delayInput(event, this.sObject_2, 'clause');
    }

    delayInput(event, obj, fieldName) {
        window.clearTimeout(this.delayTimeout);
        const inputString = event.target.value;
        this.delayTimeout = setTimeout (()=>{
            obj[fieldName] = inputString;         
        }, APEX_DELAY)
    }

    sObjectToString (obj) {
        const keys = Object.keys(obj);
        let result = '';
        keys.forEach(key => {
            result = result + ' ' + key + '=' + obj[key] + ', '
        });
        return result;
    }

    get sObjectToString_1 () {
        return this.sObject_1.name + ' ' + this.sObjectToString(this.selectedOption_1);
    }

    get sObjectToString_2 () {
        return this.sObject_2.name + ' ' + this.sObjectToString(this.selectedOption_2);
    }

    get label_1 () { 
        return this.sObject_1.name + " Name";
    }

    get label_2 () { 
        return this.sObject_2.name + " Name";
    }

    get placeholder_1() {
        return "Search " + this.sObject_1.name + "s..."
    }

    get placeholder_2() {
        return "Search " + this.sObject_2.name + "s..."
    }

}