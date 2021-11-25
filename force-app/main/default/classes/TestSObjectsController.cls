@isTest
public with sharing class TestSObjectsController {

    @isTest
    public static void testGetObjectsDescription() {
        Test.startTest();
        List<String> sObjectStringList =  SObjectsController.getObjectsDescription(new List<String>());
        Test.stopTest();

        System.assertNotEquals(0, sObjectStringList.size(), 'sObjects List is Empty');

        Map<String, Map<String, Object>> SObjectDTOMap = new Map<String, Map<String, Object>>();

        for (String s : sObjectStringList) {
            Map<String, Object> dto = (Map<String, Object>) JSON.deserializeUntyped(s);
            String key = (String) dto.get('Id');
            SObjectDTOMap.put(key, dto);
        }

        Map<String, Object> accountDTO = SObjectDTOMap.get('account');
        System.assertNotEquals(null, accountDTO, 'Account sObject not found');
        System.assertEquals('Account', accountDTO.get('Name'), 'Name error');
        System.assertEquals('name', accountDTO.get('nameFieldApiName'), 'name Field Api Name error');
        System.assertEquals('Account Name', accountDTO.get('nameFieldLabel'), 'name Field Label error');

        Map<String, Object> caseDTO = SObjectDTOMap.get('case');
        System.assertNotEquals(null, caseDTO, 'Case sObject not found');
        System.assertEquals('Case', caseDTO.get('Name'), 'Name error');
        System.assertEquals('casenumber', caseDTO.get('nameFieldApiName'), 'name Field Api Name error');
        System.assertEquals('Case Number', caseDTO.get('nameFieldLabel'), 'name Field Label error');
    }
}
