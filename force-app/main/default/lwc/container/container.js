import { LightningElement, track } from 'lwc';

export default class Container extends LightningElement {
    
    @track selectedOption ={
        Id : '',
        Name : '',
    }
    
    handleChange(event) {
        this.selectedOption.Id = event.detail.Id;
        this.selectedOption.Name = event.detail.Name;
    }
}