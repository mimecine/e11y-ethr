
const parse = require('csv-parse/lib/sync');
const { default: got } = require('got');

const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQWaB87wRfOK2z-BlFHZfJ-kredTBHF9BMEcCT2918PbVQ2JGi26hcT1WG4uMJ0WpXXwW34Y-cbO6mq/pub?gid=1599755262&single=true&output=csv";

module.exports = async function(){
    try {
        return parse(await got(URL).text(),{columns:true,skip_empty_lines:true});
    } catch(e){
        throw Error('WTF')
    }
} 