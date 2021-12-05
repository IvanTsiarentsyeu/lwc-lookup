public with sharing class FiveMillionScheduler implements Schedulable {
    final static Integer TWO_THOUSAND = 2000; 
    public void execute(SchedulableContext ctx) {
        FiveMillionCounterBatch batchObject = new FiveMillionCounterBatch();
        Id jobId = Database.executeBatch(batchObject, TWO_THOUSAND);
        System.debug('FiveMillionCounterBatch Job Id = ' + jobId);
    }
}

// System.schedule('Daily contacts rating/place update', '00 01 11 * * ?', new FiveMillionScheduler());