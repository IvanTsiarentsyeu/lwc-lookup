public with sharing class FiveMillionUpdatorBatch implements Database.Batchable<SObject>{
    final Integer LOWEST_RATING = 0;
    final Integer HIGHEST_RATING = 100;
    Map<Integer, String> placesMap;

    public FiveMillionUpdatorBatch(Map<Integer, String> placesMap) {
        this.placesMap = placesMap;
    }

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id, Rating__c, Place__c From Product2');
    }

    public void execute(Database.BatchableContext bc, List<Product2> products) {
        for(Product2 p : products) {
            if (p.Rating__c >= LOWEST_RATING && p.Rating__c <= HIGHEST_RATING) {
                p.Place__c = placesMap.get(p.Rating__c.intValue());
            }
        }
        update products;
    }

    public void finish(Database.BatchableContext bc) {
        System.debug('Products updated');
    }
}
