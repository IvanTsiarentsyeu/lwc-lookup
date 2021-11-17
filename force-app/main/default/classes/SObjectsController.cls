public with sharing class SObjectsController {

    @AuraEnabled
    public static List<String> getFields(String sObjectName){
        try {
            return makeFieldsList(sObjectName);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<String> getObjectsDescription(Boolean full){
        try {
            return makeObjectsDescription(full);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static List<String> makeObjectsDescription(Boolean full) {
        List<String> result = new List<String>();
        Map<String, SObjectType> sObjectMap = Schema.getGlobalDescribe();
        Set<String> sObjectsNameSet = sObjectMap.keySet();

        for (String sObjectName : sObjectsNameSet) {
            Schema.SObjectType sObj= sObjectMap.get(sObjectName);
            SObjectDTO dto = new SObjectDTO();

            dto.Id = sObjectName;
            dto.Name = sObj.getDescribe().getLabel();
            dto.isCustomSetting = sObj.getDescribe().isCustomSetting();
            dto.isCreateable = sObj.getDescribe().isCreateable();
            dto.hasRecordTypes = sObj.getDescribe().getRecordTypeInfos().size() > 0;
            dto.isAccessible = sObj.getDescribe().isAccessible();
            dto.isQueryable = sObj.getDescribe().isQueryable();
            dto.isSearchable = sObj.getDescribe().isSearchable();

            dto.fields = new Set<FieldDTO>();
            Map<String, Schema.SObjectField> fieldMap = sObj.getDescribe().fields.getMap();
            System.debug(fieldMap);
            Set<String> fieldKeySet = fieldMap.keySet();

            for (String key : fieldKeySet) {
                SObjectField fieldObj = fieldMap.get(key);
                FieldDTO newFieldDTO = new FieldDTO();
                newFieldDTO.Name = fieldObj.getDescribe().getLabel();
                newFieldDTO.Id = key;
                newFieldDTO.type = fieldObj.getDescribe().getType();
                newFieldDTO.isNameField = fieldObj.getDescribe().isNameField();
                dto.fields.add(newFieldDTO);
            }
            result.add(JSON.serialize(dto));
        }
        return result;
    }    

    private class SObjectDTO {
        String Name;
        String Id;
        Boolean isCustomSetting;
        Boolean isCreateable;
        Boolean hasRecordTypes;
        Boolean isAccessible;
        Boolean isQueryable;
        Boolean isSearchable;
        Set<FieldDTO> fields;
    }

    private class FieldDTO {
        String Name;
        String Id;
        DisplayType type;
        Boolean isNameField;
    }
    

    // private static List<String> makeSObjectsList() {
    //     return new List<String>(Schema.getGlobalDescribe().keySet());
    // }

    private static List<String> makeFieldsList(String sObjectName) {
        Schema.DescribeSobjectResult[] results = Schema.describeSObjects(new String[]{sObjectName});
        Map<String, Schema.SObjectField> fieldMap = results[0].fields.getMap();
        return new List<String>(fieldMap.keySet());
    }

}
