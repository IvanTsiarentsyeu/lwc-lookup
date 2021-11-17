public with sharing class dropdownLookupController {

    @AuraEnabled (cacheable=true)
    public static List<sObject> selectRecordsFromAnysObject(String sObjectName, String fields, String clause, String searchKey) {
        string query = makeQuery(sObjectName, fields, clause);  
        if (query.length()==0) return new List<sObject>();
        if (searchKey==null) searchKey = '';
        String search = '%'+ searchKey +'%';
        System.debug(query);
        try {
            return Database.query(query);
        } catch (Exception e) {
            System.debug(e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static String makeQuery(String sObjectName, String fields, String clause) {
        if (sObjectNameIsBad(sObjectName)) return '';

        List<String> fieldsList = makeListFromString(fields);
        List<String> validatedFieldsList = validateFields(sObjectName, fieldsList);
        if  (validatedFieldsList.size() == 0) return '';

        String validatedFieldsString = makeStringFromList(validatedFieldsList);

        String query = 'SELECT ' + validatedFieldsString + ' FROM '+ sObjectName + ' WHERE ' + validatedFieldsList[0] +' LIKE :search';
        if (!((clause == null) || (clause.length()==0))) {
            query = query + ' AND (' + clause +')';
        }
        query = query + ' ORDER BY '+ validatedFieldsList[0];
        return query;
    }

    private static List<String> validateFields(String sObjectName, List<String> fields) {

        Schema.DescribeSobjectResult[] results = Schema.describeSObjects(new String[]{sObjectName});
        Map<String, Schema.SObjectField> fieldMap = results[0].fields.getMap();
        Set<String> fieldSet = fieldMap.keySet();
        System.debug(fieldSet);

        List<String> newFieldsList = new List<String>();
        for(String f : fields){
            if (fieldSet.contains(f.toLowerCase())) {
                fieldSet.remove(f.toLowerCase());
                newFieldsList.add(f);
            } 
        } 

        if (newFieldsList.size()>0) {
            if (newFieldsList[0].toLowerCase() == 'id') {
                newFieldsList.remove(0);
            }
        }

        return newFieldsList;
    }

    private static List<String> makeListFromString(String fields) {
        fields = fields.deleteWhiteSpace();
        List<String> result = fields.split(',');
        return result;
    }

    private static String makeStringFromList(List<String> fields) {
        String result = '';
        for (String  s : fields) {
            result = result + ((result=='')?'':', ') + s;
        }
        return result;
    }

    private static Boolean sObjectNameIsBad(String sObjectName) {
        if (sObjectName==null) return true;
        if (sObjectName.length()==0) return true;
        Map<String, Schema.SObjectType> allSobjects = Schema.getGlobalDescribe();
        Set<String> validSObjectNames = allSobjects.keySet();
        return ! validSObjectNames.contains(sObjectName.toLowerCase());
    }

    private static String makeStringFromList(List<String> fields) {
        String result = '';
        for (String  s : fields) {
            result = result + ((result=='')?'':', ') + s;
        }
        return result;
    }

    private static Boolean sObjectNameIsBad(String sObjectName) {
        if (sObjectName==null) return true;
        if (sObjectName.length()==0) return true;
        Map<String, Schema.SObjectType> allSobjects = Schema.getGlobalDescribe();
        Set<String> validSObjectNames = allSobjects.keySet();
        return ! validSObjectNames.contains(sObjectName.toLowerCase());
    }



}
