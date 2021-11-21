// DATA-GATHERING COMPONENT TO SELECT RECORDS OF SPECIFIC SOBJECT, USES dropdown TO DISPLAY

import { LightningElement, api, track, wire } from 'lwc';
import selectRecordsFromAnysObject from '@salesforce/apex/DropdownLookupController.selectRecordsFromAnysObject';
const FIELD_TO_DISPLAY_NAME = 'fieldToDisplay';


export default class Lookup extends LightningElement {

    @api sObjectName;
    @api commaSeparatedFields = 'Name';
    @api sqlWhereClause = '';
    @api alreadySelectedOptionId = '';
    @api label = 'Name';
    @api placeholder = 'Search...';
    @api inputClass = 'standalone';

    options=[];
    error;

    @track searchKey = '';

    @wire(selectRecordsFromAnysObject, { sObjectName: '$sObjectName', 
                                         fields:'$commaSeparatedFields', 
                                         clause:'$sqlWhereClause', 
                                         searchKey: '$searchKey' })
    wiredOptions ({ error, data }) {
        if (data) {
            this.error = undefined;
            let newOptions = [];
            data.forEach(option => {
                let newOption = {};
                const keys = Object.keys(option);
                keys.forEach(key => {
                    newOption[key] = option[key];
                });
                newOptions.push(newOption);
            });
            this.options = newOptions;

        } else if (error) {
            this.error = error;
            this.options = undefined;
            console.error(error);
        }
    }

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