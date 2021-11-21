public with sharing class SObjectsController {

    static final String DEFAULT_NAME = 'name';

    static List<String> sObjectsToShow = new List<String>();
    static List<Excluded_sObject__c> sObjectsToExclude = new List<Excluded_sObject__c>();
    static Set<String> alreadyExcludedSObjects = new Set<String>();

    private class SObjectDTO {
        String Name;
        String Id;
        String nameFieldApiName;
        String nameFieldLabel;
    }

    private class FieldDTO {
        String nameFieldApiName;
        String nameFieldLabel;
        FieldDTO () {
            this.nameFieldApiName = '';
            this.nameFieldLabel = '';
        }
    }

    @AuraEnabled
    public static List<String> getObjectsDescription() {
        try {
            populateAlreadyExcludedSObjects();
            makeListsToShowAndExclude();
            if (sObjectsToExclude.size()>0) {
                insert sObjectsToExclude;
            }
            return sObjectsToShow;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static void populateAlreadyExcludedSObjects() {        
            List<Excluded_sObject__c> excludedList = [SELECT Name FROM Excluded_sObject__c];
            for (Excluded_sObject__c excludedSObject : excludedList) {
                alreadyExcludedSObjects.add(excludedSObject.Name);
            }
    }

    private static void makeListsToShowAndExclude() {
        Map<String, SObjectType> sObjectMap = Schema.getGlobalDescribe();
        Set<String> sObjectsNameSet = sObjectMap.keySet();

        sObjectsNameSet.removeAll(alreadyExcludedSObjects);

        for (String sObjectName : sObjectsNameSet) {
            Schema.SObjectType sObj= sObjectMap.get(sObjectName);
            SObjectDTO dto = new SObjectDTO();
            dto.Id = sObjectName;
            dto.Name = sObj.getDescribe().getLabel();
            FieldDTO nameFieldInfo = getNameFieldApiName(sObj);
            if (nameFieldInfo.nameFieldApiName.length() > 0 && sObj.getDescribe().isQueryable()) {
                dto.nameFieldApiName = nameFieldInfo.nameFieldApiName;
                dto.nameFieldLabel = nameFieldInfo.nameFieldLabel;
                sObjectsToShow.add(JSON.serialize(dto));
            } else {
                addSobjectToExcludedList(sObjectName);
            }
        }
    }    
    
    private static void addSobjectToExcludedList(String sObjectName) {
        Excluded_sObject__c newElement = new Excluded_sObject__c();
        newElement.Name = sObjectName;
        sObjectsToExclude.add(newElement);
    }

    private static FieldDTO getNameFieldApiName(Schema.SObjectType sObj) {
        Map<String, Schema.SObjectField> fieldMap = sObj.getDescribe().fields.getMap();
        Set<String> fieldKeySet = fieldMap.keySet();
        FieldDTO result = new FieldDTO();

        if (fieldKeySet.contains(DEFAULT_NAME) && fieldMap.get(DEFAULT_NAME).getDescribe().isNameField()) {
            result.nameFieldApiName = DEFAULT_NAME;
            result.nameFieldLabel = fieldMap.get(DEFAULT_NAME).getDescribe().getLabel();
            return result;
        }

        for (String key : fieldKeySet) {
            SObjectField fieldObj = fieldMap.get(key);
            if (fieldObj.getDescribe().isNameField()) {
                result.nameFieldApiName = key;
                result.nameFieldLabel = fieldObj.getDescribe().getLabel();
                return result;
            }
        }
        return result;
    }

}