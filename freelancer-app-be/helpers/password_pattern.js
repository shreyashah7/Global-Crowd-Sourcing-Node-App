/**
	The regular expression to validate if the submitted password
	adherers our standard before we even try to match it with what we
	have in the database.

	- 1 lower case char
	- 1 upper case char
	- 1 special char
	- 1 number
	- 8 char min length
**/

let patern = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=?!~|()<>{}:;,"'`\[\]\\\/.\-_*])([a-zA-Z0-9@#$%^&+=?!~|()<>{}:;,“’`\[\]\\\/*.\-_]){8,}$/;

module.exports = patern;