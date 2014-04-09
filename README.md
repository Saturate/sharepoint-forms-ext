sharepoint-forms-ext
====================
[![Build Status](https://travis-ci.org/Saturate/sharepoint-forms-ext.png)](https://travis-ci.org/Saturate/sharepoint-forms-ext)

A little library to work with SharePoint NewForm and EditForm. Only tested with SP 2013.   
It will look for the correct rows in a `.ms-formtable` table.

## Features
- Set field values:
	- PeoplePicker
	- Checkbox
	- Select
	- SPBusinessData
	- Taxonomy
- Get field values.
- Listen for change on `SPBusinessData` fields.
- More (Look at the source, it's pretty simple).

## TODO & Bugs
-	[See GitHub Issues](https://github.com/Saturate/sharepoint-forms-ext/issues)

## Usage

	var form = new SPFormsExt();
	form.setField('FIELD_NAME', 'Wernstrom!');

or with RequireJS:

	require(['sp-forms-ext'], function(SPFormsExt) {
		var form = new SPFormsExt();
		form.setField('FIELD_NAME', 'Why not Zoidberg?');
	})