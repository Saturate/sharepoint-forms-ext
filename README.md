sharepoint-forms-ext
====================
[![Build Status](https://travis-ci.org/Saturate/sharepoint-forms-ext.png)](https://travis-ci.org/Saturate/sharepoint-forms-ext)

A little library to work with SharePoint NewForm and EditForm. Only tested with SP 2013.


## Features
- Listen for change on `SPBusinessData` fields.
- Find a input based on row name.
- Get/Set SharePoint PeoplePicker.
- More (Look at the source, it's pretty simple).

## TODO & Bugs
-	[See GitHub Issues](https://github.com/Saturate/sharepoint-forms-ext/issues)

## Usage

	require(['sp-forms-ext'], function(SPFormsExt) {
		var foo = new SPFormsExt();

		// Set a SPBusinessDataField
		foo.setBusinessDataField('FIELD_NAME', 'TEST');
	})