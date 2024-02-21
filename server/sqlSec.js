/*
 * File: sqlInjectionSecurity.js
 * Description: Just some simple checks using validator to make sure dangerous sql characters aren't present in forms submissions.
 *              
 * Author: Lilith Ashbury 
 * Date: 2/13/2024
 */

const validator = require('validator');

const checkForSqlCharacters = (strings) => {
  console.log("checkForSqlCharacters() in sqlInjectionSecurity.js");
  
  for (let i = 0; i < strings.length; i++) {
    const string = strings[i];
    if (validator.contains(string, ';') || validator.contains(string, "--") || validator.contains(string, "'")) {
      console.log("Dangerous sql character found");
      return true;
    }
  }
  console.log("No dangerous sql characters found");
  return false;
}

module.exports = {
  checkForSqlCharacters
}