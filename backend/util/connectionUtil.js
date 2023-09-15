class ConnectionUtil{
    static path = require('path');
    static yaml = require('js-yaml');
    static fs = require('fs');
    static getYaml(){
        const yamlData = this.fs.readFileSync('./application.yml', 'utf8');
        return this.yaml.load(yamlData);
    }
}

module.exports = ConnectionUtil;