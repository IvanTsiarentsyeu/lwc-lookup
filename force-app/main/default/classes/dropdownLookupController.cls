public with sharing class dropdownLookupController {

    @AuraEnabled (cacheable=true)
    public static List<sObject> selectRecordsFromAnysObject(String sObjectName, String nameLike, String searchKey) {

        if (nameLike == null) nameLike='';
        if (searchKey == null) searchKey='';
        if (sObjectNameIsBad(sObjectName)) return new List<sObject>();

        String search = '%' + searchKey + '%';
        String query = 'SELECT Id, Name FROM '+ sObjectName + ' WHERE Name LIKE :search';

        if (nameLike.length() >0) {
            query = query + ' AND Name LIKE :nameLike';
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
        // ЗАГЛУШКА
        Set<String> validSObjectNames = new Set<String>();
        validSObjectNames.add('ACCOUNT');
        validSObjectNames.add('CONTACT');
        
        return ! validSObjectNames.contains(sObjectName.toUpperCase());
    }

}
