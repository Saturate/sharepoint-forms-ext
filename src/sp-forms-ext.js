/**
* name    : SPFormsExt
* version : 0.1.1
* author  : Allan kimmer Jensen
* website : https://github.com/Saturate/sharepoint-forms-ext
*/
'use strict';

var SPFormsExt = function (options) {
    var self = this;

    var defaults = {
        fieldNames: {},
        changedCheckInterval: 1000
    };

    $.extend(this.settings, defaults, options);

    /*
        Listen to all BusinessData fields,
        We can't tell them apart.
        Then we will trigger a correct change event.
    */
    $('[id$="_Picker_OuterTable"]').each(function() {
        var $this = $(this);

        setInterval(function() {
            self.checkIfBusinessDataChanged($this);
        }, self.settings.changedCheckInterval);
    });

};

$.extend(SPFormsExt.prototype, {
    settings: {
        fieldNames: {}
    },
    checkIfBusinessDataChangedCache: {},
    /*
        Get field from settings, or just return it as-is.
        Useful for quick config when labels change.
    */
    lookupFieldName: function(field) {
        if (field in this.settings.fieldNames) {
            return this.settings.fieldNames[field];
        }
        
        return field;
    },

    setField: function(fieldName, fieldValue) {
        var fieldType = this.getFieldType(fieldName);

        switch(fieldType) {
            case 'checkbox':
                this.setCheckbox(fieldName, fieldValue);
                break;
            case 'peoplepicker':
                this.setPeoplePicker(fieldName, fieldValue);
                break;
            case 'select':
                this.setSelect(fieldName, fieldValue);
                break;
            case 'BusinessData':
                this.setBusinessDataField(fieldName, fieldValue);
                break;
            case 'taxonomy':
                this.setTaxonomy(fieldName, fieldValue);
                break;
            default:
                this.setInput(fieldName, fieldValue);
        }
    },

    /*
        Find a field body from a field name
    */
    findBodyFromFieldName: function (fieldName) {
        var self = this;
        // Make sure we only get a match where all of the text is the field name via the filter function
        return $('.ms-formlabel .ms-standardheader:contains("' + self.lookupFieldName(fieldName) + '")')
            .filter(function(i,elm) {
                var elmTxt = $(elm).text().replace('*','').trim();
                if (elmTxt === self.lookupFieldName(fieldName)) {
                    return true;
                }
            })
            .closest('tr')
            .find('.ms-formbody');
    },
    
    /*
        Sets a BusinessData and validates it
    */
    setBusinessDataField: function (fieldname, value){
        if (!value) { return false; }

        var $formBody = this.findBodyFromFieldName(fieldname);

        // Set the club ID
        $formBody
            .find('[id$="Picker_upLevelDiv"]')
            .text(value);

        // Trigger the field check
        $formBody
            .find('[id$="Picker_checkNames"]')
            .click();
    },

    getBusinessDataField: function (fieldname){
        var $fieldBody = this.findBodyFromFieldName(fieldname);
        return $fieldBody.find('[id$="_Picker_OuterTable"]');
    },

    setInput: function(fieldName, value) {
        var $formBody = this.findBodyFromFieldName(fieldName);
        $formBody.find('input').val(value);
    },

    getFieldType: function(fieldName) {
        var $fieldBody = this.findBodyFromFieldName(fieldName);

        if(!$fieldBody) {
            throw new Error('fieldBody not found.');
        }

        if($fieldBody.find('.ms-taxonomy').length){
            return 'taxonomy';
        }

        if($fieldBody.find('[type="checkbox"]').length){
            return 'checkbox';
        }

        if($fieldBody.find('[id$="ClientPeoplePicker"]').length){
            return 'peoplepicker';
        }

        if($fieldBody.find('[id$="_Picker_OuterTable"]').length){
            return 'BusinessData';
        }

        if($fieldBody.find('select').length){
            return 'select';
        }

        return;
    },

    /*
        Sets a select box
    */
    setSelect:  function (fieldName, value){
        if (!value) { return false; }

        var $formBody = this.findBodyFromFieldName(fieldName);

        $formBody.find('select option').filter(function() {
            return $(this).text() === value;
        }).attr('selected', true);
    },

    setTaxonomy: function(fieldName, value){
        var self = this;
        var $formBody = self.findBodyFromFieldName(fieldName);

        $formBody.find('[id$="_$containereditableRegion"]').text(value);
    },

    /*
        Sets a checkbox
    */
    setCheckbox:  function (fieldname, value){
        var self = this;
        var $formBody = self.findBodyFromFieldName(fieldname);

        $formBody.find('[type="checkbox"]').prop('checked', value);
    },
    findPeoplePicker: function (fieldname) {
        var ppDiv = $('[id$="ClientPeoplePicker"][title="' + fieldname + '"]');
        var ppEditor = ppDiv.find('[title="' + fieldname + '"]');
        var spPP = SPClientPeoplePicker.SPClientPeoplePickerDict[ppDiv[0].id];

        return {
            div: ppDiv,
            editor: ppEditor,
            sp: spPP
        };
    },
    setPeoplePicker: function (fieldname, value){
        if (!value) { return false; }
        
        var pp = this.findPeoplePicker(fieldname);

        pp.editor.val(value);
        // Resolve the User if (!spPP.HasInputError) 
        pp.sp.AddUnresolvedUserFromEditor(true);
    },
    getPeoplePicker: function (fieldname) {
        var pp = this.findPeoplePicker(fieldname);

        return pp.sp.GetAllUserInfo();
    },

    /*
        Get the value from a key in a BusinessData
    */
    findBusinessDataValue: function (entityDataString, key) {
        var entityData = $.parseXML(entityDataString);
        var value = $(entityData).find('Key:contains("' + key + '")').parent().find('Value').text();

        return value;
    },

    /*
        Get a fields name, according to the .ms-formlabel
        Trims whitespace and removes "*"
    */
    getFieldName: function ($field) {
        return $field.closest('tr')
            .find('.ms-formlabel .ms-standardheader')
            .text()
            .replace('*','')
            .trim();
    },

    /* 
        Check for changes in a interval
    */
    checkIfBusinessDataChanged: function($fieldParent) {
        var current = $('#divEntityData div', $fieldParent).attr('data');
        var fieldId = $fieldParent.attr('id');

        if (current !== this.checkIfBusinessDataChangedCache[fieldId]) {
            this.checkIfBusinessDataChangedCache[fieldId] = current;
            $fieldParent.trigger('change', current);
        }
    }
});