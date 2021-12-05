public with sharing class FiveMillionDeleterRun {
    public static void deleteAllDummies() {
        Id jobId = Database.executeBatch(new FiveMillionDeleterBatch(), 2000);
    }
}

// FiveMillionDeleterRun.deleteAllDummies();
