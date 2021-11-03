public with sharing class dropdownLookupController {

    @AuraEnabled (cacheable=true)
    public static List<sObject> selectRecordsFromAnysObject(String sObjectName, String fields,
            String mainField, String clause, String searchKey) {

        if (searchKey == null) searchKey='';
        if (clause == null) clause='';
        if (sObjectNameIsBad(sObjectName)) return new List<sObject>();
        if (fieldsAreBad(fields, mainField)) return new List<sObject>();
        String search = '%' + searchKey + '%';
        String query = 'SELECT ' + fields + ' FROM '+ sObjectName + ' WHERE Name LIKE :search';

        if (clause.length() >0) {
            query = query + ' AND ' + clause;
        }
        if (mainField.length() > 0) {
            query = query + ' ORDER BY '+ mainField;
        }

        System.debug(query);

        try {
            System.debug(Database.query(query));
            return Database.query(query);
        } catch (Exception e) {
            System.debug(e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static Boolean sObjectNameIsBad (String sObjectName) {
        if (sObjectName==null) return true;
        if (sObjectName.length()==0) return true;

        Map<String, Schema.SObjectType> allSobjects = Schema.getGlobalDescribe();
        Set<String> validSObjectNames = allSobjects.keySet();
        System.debug(validSObjectNames);

        return ! validSObjectNames.contains(sObjectName.toLowerCase());
    }

    private static Boolean fieldsAreBad(String fields, String mainField) {
        //  ЗАГЛУШКА
        return false;
    }

}
