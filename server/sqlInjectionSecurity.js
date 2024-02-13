/*
 * File: sqlInjectionSecurity.js
 * Description: Just some simple checks using validator to make sure dangerous sql characters aren't present in forms submissions.
 *              
 * Author: Lilith Ashbury 
 * Date: 2/13/2024
 */

const validator = require('validator');

const checkForSqlCharacters = (string) => {
  console.log("checkForSqlCharacters() in sqlInjectionSecurity.js")
  if (validator.contains(string, ';') || validator.contains(string, "--") || validator.contains(string, "'")) {
    return true;
  } else { return false; }
}

module.exports = {
  checkForSqlCharacters
}