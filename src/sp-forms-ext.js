/**
* name    : SPFormsExt
* version : 0.0.1
* author  : Allan kimmer Jensen
* website : https://github.com/Saturate/sharepoint-forms-ext
*/
define(['jquery'], function($) {
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
        getField: function(field) {
            if (field in this.settings.fieldNames) {
                return this.settings.fieldNames[field];
            }
            
            return field;
        },

        /*
            Find a field body from a field name
        */
        findBodyFromFieldName: function (fieldname) {
            var self = this;
            // Make sure we only get a match where all of the text is the field name via the filter function
            return $('.ms-formlabel .ms-standardheader:contains("' + self.getField(fieldname) + '")')
                .filter(function(i,elm) {
                    var elmTxt = $(elm).text().replace('*','').trim();
                    if (elmTxt === self.getField(fieldname)) {
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
            
            var self = this;
            var $formBody = self.findBodyFromFieldName(fieldname);

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

        /*
            Sets a select box
        */
        setSelect:  function (fieldname, value){
            if (!value) { return false; }

            var self = this;
            var $formBody = self.findBodyFromFieldName(fieldname);

            $formBody.find('select option').filter(function() {
                return $(this).text() === value;
            }).attr('selected', true);
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
            var uuid = $(entityData).find('Key:contains("' + key + '")').parent().find('Value').text();

            return uuid;
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

    return SPFormsExt;
});