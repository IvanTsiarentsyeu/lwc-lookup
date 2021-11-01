import { LightningElement, track } from 'lwc';
const APEX_DELAY = 300;

export default class Container extends LightningElement {
    
    @track selectedOption_1 ={
        Id : '',
        Name : '',
    }
    @track selectedOption_2 ={
        Id : '',
        Name : '',
    }
    sObjectName_1 = '';
    sObjectName_2 = '';

    handleChange_1(event) {
        this.selectedOption_1.Id = event.detail.Id;
        this.selectedOption_1.Name = event.detail.Name;
    }
    handleChange_2(event) {
        this.selectedOption_2.Id = event.detail.Id;
        this.selectedOption_2.Name = event.detail.Name;
    }

    handleKeyChange_1(event) {
        window.clearTimeout(this.delayTimeout);
        const sObjectName = event.target.value;
        this.delayTimeout = setTimeout (()=>{
            this.sObjectName_1 = sObjectName;
        }, APEX_DELAY)
    }

    handleKeyChange_2(event) {
        window.clearTimeout(this.delayTimeout);
        const sObjectName = event.target.value;
        this.delayTimeout = setTimeout (()=>{
            this.sObjectName_2 = sObjectName;
        }, APEX_DELAY)
    }

    // handleInputDelay(event) {
    //     window.clearTimeout(this.delayTimeout);
    //     const inputString = event.target.value;
    //     this.delayTimeout = setTimeout (()=>{
    //         return inputString;
    //     }, APEX_DELAY)
    // }


    get label_1 () { 
        return this.sObjectName_1 + " Name";
    }

    get label_2 () { 
        return this.sObjectName_2 + " Name";
    }

    get placeholder_1() {
        return "Search " + this.sObjectName_1 + "s..."
    }

    get placeholder_2() {
        return "Search " + this.sObjectName_2 + "s..."
    }

}