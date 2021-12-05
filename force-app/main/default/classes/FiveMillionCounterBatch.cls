public with sharing class FiveMillionCounterBatch implements Database.Batchable<SObject>, Database.Stateful {
    final Integer LOWEST_RATING = 0;
    final Integer HIGHEST_RATING = 100;
    List<Integer> ratingArray;


    public FiveMillionCounterBatch() {
        ratingArray = new Integer [HIGHEST_RATING - LOWEST_RATING +1];
        for (Integer i = LOWEST_RATING; i <= HIGHEST_RATING; i++) {
            ratingArray.add(i, 0);
        }
    }

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id, Rating__c From Product2');
    }

    public void execute(Database.BatchableContext bc, List<Product2> products){
        for (Product2 p : products){
            if (p.Rating__c >= LOWEST_RATING && p.Rating__c <= HIGHEST_RATING) {
                ratingArray[p.Rating__c.intValue()] ++;
            }
        }
    }

    public void finish(Database.BatchableContext bc){
        Map<Integer, String> placesMap = new Map<Integer, String>();
        Integer first = 1;
        for (Integer i = HIGHEST_RATING; i >= LOWEST_RATING; i--) {
            Integer last = first + ratingArray[i] - 1;
            String place = '';
            if (last == first) {
                place = String.valueOf(first);
            } else if (last > first) {
                place = String.valueOf(first) + '-' + String.valueOf(last);
            }
            placesMap.put(i, place);
            first = last + 1;
        }
        
        FiveMillionUpdatorBatch batchObject = new FiveMillionUpdatorBatch(placesMap);
        Id jobId = Database.executeBatch(batchObject, 2000);
        System.debug('FiveMillionUpdatorBatch Job Id = ' + jobId);     
    }

}
