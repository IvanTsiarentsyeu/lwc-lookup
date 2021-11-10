import { LightningElement, api, track, wire } from 'lwc';
import getSObjectsDescription from '@salesforce/apex/dropdownLookupController.getSObjectsDescription';
const FIELD_TO_DISPLAY_NAME = 'fieldToDisplay';

export default class LookSObjects extends LightningElement {

    @api alreadySelectedSObjectName = '';
    @api label = 'Select SObject';
    @api placeholder = 'Search SObjects...';
    
    @track options = [];
    error;

    searchKey = '';

    connectedCallback () {
        this.loadSObjectsData();
    }

    loadSObjectsData () {
        getSObjectsDescription()
            .then (result => {
                this.options = result;
            })
            .catch(error => {
                console.error(error);
            })

    }





    // @wire(selectRecordsFromAnysObject, { sObjectName: '$sObjectName', 
    //                                      fields:'$commaSeparatedFields', 
    //                                      clause:'$sqlWhereClause', 
    //                                      searchKey: '$searchKey' })
    // wiredOptions ({ error, data }) {
    //     if (data) {
    //         this.error = undefined;
    //         let newOptions = [];
    //         data.forEach(option => {
    //             let newOption = {};
    //             const keys = Object.keys(option);
    //             keys.forEach(key => {
    //                 newOption[key] = option[key];
    //             });
    //             newOptions.push(newOption);
    //         });
    //         this.options = newOptions;

    //     } else if (error) {
    //         this.error = error;
    //         this.options = undefined;
    //         console.error(error);
    //     }
    // }

    handleKeyChange(event) {
            this.searchKey = event.detail;
    }

    handleChange(event) {
        let changeEvent = new CustomEvent('change', {
            detail: event.detail,
        });
        this.dispatchEvent(changeEvent);
    }



}