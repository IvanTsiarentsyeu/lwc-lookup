public with sharing class FiveMillionDeleterBatch  implements Database.Batchable<SObject> {
    private static final String SEARCH_STRING = 'A';
    
        public Database.QueryLocator start(Database.BatchableContext bc) {
            return Database.getQueryLocator('SELECT Id, Name FROM Product2 WHERE Name LIKE :SEARCH_STRING');
        }
    
        public void execute(Database.BatchableContext bc, List<Product2> objectsToDelete){
            delete objectsToDelete;
        }

        public void finish(Database.BatchableContext bc){
            System.debug('Delete finished');
        }
    
}
