const validator = require('validator');

const checkForSqlCharacters = (string) => {
  if (validator.contains(string, ';') || validator.contains(string, "--") || validator.contains(string, "'")) {
    return true;
  } else { return false; }
}

module.exports = {
  checkForSqlCharacters
}