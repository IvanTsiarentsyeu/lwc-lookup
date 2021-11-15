import { LightningElement, api, track } from 'lwc';
import getFields from '@salesforce/apex/SObjectsController.getFields';
const FIELD_NAME = 'Name';
const FIELD_ID = 'Id';


export default class LookSObjects extends LightningElement {

    @api alreadySelectedFieldName = '';
    @api label = 'Select field';
    @api placeholder = 'Search fields...';
    @api inputClass = 'standalone';
    
    loadedOptions;
    error;
    options = [];

    searchKey = '';
    _sObjectName='';


    @api 
    get sObjectName() {
        return this._sObjectName;
    }
    set sObjectName(value) {
        if (value) {
            this._sObjectName = value;
            this.loadSObjectsData(this._sObjectName);
        }
    }

    loadSObjectsData (sObjName) {
        getFields({sObjectName : sObjName})
            .then (result => {
                this.loadedOptions = [];
                let index = 0;
                result.forEach(option => {
                    index = index + 1;
                    let newOption ={};
                    newOption[FIELD_NAME] = option;
                    newOption[FIELD_ID] = option;
                    this.loadedOptions.push(newOption); 
                })
                this.loadedOptions = this.loadedOptions.sort((a, b) => {
                    let name_a = a[FIELD_NAME].toLowerCase(),
                        name_b = b[FIELD_NAME].toLowerCase();
                    if (name_a < name_b) return -1;
                    if (name_a > name_b) return 1;
                    return 0;
                })
                this.options = this.loadedOptions;
            })
            .catch(error => {
                console.error(error);
            })
    }

    handleKeyChange(event) {
        this.searchKey = event.detail.toLowerCase();
        this.options = this.loadedOptions.filter (option => {
            return option[FIELD_NAME].toLowerCase().includes(this.searchKey);
        }) 
    }

    handleChange(event) {
        let changeEvent = new CustomEvent('change', {
            detail: event.detail,
        });
        this.dispatchEvent(changeEvent);
    }



}