const fs = require("fs");
const slugify = require("slugify");

module.exports = {
     fx(f){try{fs.accessSync(f);return true;}catch(e){return false}; return false},
     slug(str){ return slugify(str,{strict:true}).toLowerCase() },
     npad(n){ return n < 10 ? `0${n}`:`${n}`;}
 }