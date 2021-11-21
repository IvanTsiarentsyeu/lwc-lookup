@isTest
public with sharing class TestDropdownLookupController {

    static final Integer ACCOUNTS_COUNT = 100;
    static final String  ACCOUNT_NAME_PREFIX = 'TEST_';
    static final String  ACCOUNT_NUMBER = 'Some Number';
    static List<String> sObjectStringList =  SObjectsController.getObjectsDescription();


    @testSetup
    static void makeData() {
        List<Account> accounts = new List<Account>();
        for(Integer i=1; i <= ACCOUNTS_COUNT; i++) {
            Account newAccount = new Account();
            newAccount.Name = ACCOUNT_NAME_PREFIX + String.valueOf(i);
            newAccount.AccountNumber = ACCOUNT_NUMBER;
            accounts.add(newAccount); 
        }
        insert accounts;
    }

    @isTest
    static void testSelectRecordsFromAnysObject() {
        List<Account> result;

        result = DropdownLookupController.selectRecordsFromAnysObject('account', 'name', '', '');
        System.assertNotEquals(0, result.size(), 'Test 1 list size error');
        System.assert(result[0].Name.contains(ACCOUNT_NAME_PREFIX), 'Test 1 name error');

        result = DropdownLookupController.selectRecordsFromAnysObject('account', 'id, name, accountnumber', '', '');
        System.assertNotEquals(0, result.size(), 'Test 2 list size error');
        System.assert(result[0].Name.contains(ACCOUNT_NAME_PREFIX), 'Test 2 name error');
        System.assert(result[0].AccountNumber == ACCOUNT_NUMBER, 'Test 2 account number error');

        String searchString = ACCOUNT_NAME_PREFIX + string.valueOf(ACCOUNTS_COUNT);
        result = DropdownLookupController.selectRecordsFromAnysObject('account', 'name', '', searchString);
        System.assertEquals(1, result.size(), 'Test 3 list size error');
        System.assert(result[0].Name == searchString, 'Test 3 name error');

        String whereString = 'Name=' + '\'' + searchString + '\'';
        result = DropdownLookupController.selectRecordsFromAnysObject('account', 'name', whereString, '');
        System.assertEquals(1, result.size(), 'Test 4 list size error');
        System.assert(result[0].Name == searchString, 'Test 4 name error');
    }

    @isTest
    static void runTestForSobjects_0_90() {
        runTestForSobjectsByNumber(0, 00);
    }

    @isTest
    static void runTestForSobjects_91_180() {
        runTestForSobjectsByNumber(91, 180);
    }

    @isTest
    static void runTestForSobjects_181_270() {
        runTestForSobjectsByNumber(181, 270);
    }

    @isTest
    static void runTestForSobjects_271_360() {
        runTestForSobjectsByNumber(271, 360);
    }

    @isTest
    static void runTestForSobjects_361_450() {
        runTestForSobjectsByNumber(361, 450);
    }


    static void runTestForSobjectsByNumber(Integer first, Integer Last) {
        Test.startTest();
        System.assertNotEquals(0, sObjectStringList.size(), 'sObjects List is Empty');
        for (Integer i = first; i <= last && i < sObjectStringList.size(); i++) { 
            System.debug('i = ' + i);
            System.debug('sObjectStringList.size()' + sObjectStringList.size());
            Map<String, Object> dto = (Map<String, Object>) JSON.deserializeUntyped(sObjectStringList[i]);
            String sObjectName = (String) dto.get('Id');
            String fieldName = (String) dto.get('nameFieldApiName');
            String whereString = fieldName + ' LIKE \'%%\'';
            List<sObject> result = DropdownLookupController.selectRecordsFromAnysObject(sObjectName, fieldName, whereString, ACCOUNT_NAME_PREFIX);
            System.assertNotEquals(null, result);
        }
        Test.stopTest();
    }


}
