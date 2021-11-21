// DATA-GATHERING COMPONENT FOR SOBJECT SELECTION, USES dropdown TO DISPLAY

import { LightningElement, api, track, wire } from 'lwc';
import getObjectsDescription from '@salesforce/apex/SObjectsController.getObjectsDescription';
const FIELD_NAME = 'Name';
const FIELD_ID = 'Id';

export default class LookSObjects extends LightningElement {

    @api alreadySelectedSObjectName = '';
    @api label = 'Select SObject';
    @api placeholder = 'Search SObjects...';
    @api inputClass = 'standalone';
    
    loadedOptions;
    error;
    options=[];

    searchKey = '';

    connectedCallback () {
        this.loadSObjectsData();
    }

    loadSObjectsData () {
        getObjectsDescription()
            .then (result => {
                this.loadedOptions = [];
                result.forEach(optionString => {
                    let option = JSON.parse(optionString);
                    let newOption ={
                        Name :'',
                    };
                    let keys = Object.keys(option);
                    keys.forEach(key => {
                        newOption[key] = option[key];
                    })
                    if (this.everythingIsOkWith(newOption)) {
                        this.loadedOptions.push(newOption); 
                    }                    
                })
                this.loadedOptions = this.loadedOptions.sort((a, b) => {
                    let name_a = a[FIELD_NAME].toLowerCase(),
                        name_b = b[FIELD_NAME].toLowerCase();
                    if (name_a < name_b) return -1;
                    if (name_a > name_b) return 1;
                    return 0;
                })
                this.options = this.loadedOptions;
                console.log(this.options);
            })
            .catch(error => {
                console.error(error);
            })

    }

    everythingIsOkWith(option) {
        if (option.Name.includes('MISSING LABEL')) return false;
        // if (option.isCustomSetting) return false;
        // if (! option.isCreateable) return false;
        // if (! option.hasRecordTypes) return false;
        // if (! option.isAccessible)  return false;
        // if (! option.isQueryable)  return false;
        // if (! option.isSearchable)  return false;
        // if (option.Id.includes('history')) return false;
        // if (option.Id.includes('feed')) return false;
        // if (option.Id.includes('tag')) return false;
        // if (option.Id.includes('share')) return false;

        return true;
    }

    handleKeyChange(event) {
            this.searchKey = event.detail.toLowerCase();
            this.options = this.loadedOptions.filter (option => {
                return option[FIELD_NAME].toLowerCase().includes(this.searchKey);
            })
            console.log(this.options);
    }

    handleChange(event) {
        let changeEvent = new CustomEvent('change', {
            detail: event.detail,
        });
        this.dispatchEvent(changeEvent);
    }

}