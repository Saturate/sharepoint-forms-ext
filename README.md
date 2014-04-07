sharepoint-forms-ext
====================
[![Build Status](https://travis-ci.org/Saturate/sharepoint-forms-ext.png)](https://travis-ci.org/Saturate/sharepoint-forms-ext)

A little library to work with SharePoint NewForm and EditForm.

## Features
- Listen for change on `SPBusinessData` fields.
- Find a input based on row name
- More

## TODO
-	See GitHub Issues

## Usage

	require(['sp-forms-ext'], function(SPFormsExt) {
		var foo = new SPFormsExt();

		// Set a SPBusinessDataField
		foo.setBusinessDataField('FIELD_NAME', 'TEST');
	})