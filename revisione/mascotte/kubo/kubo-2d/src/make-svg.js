const R=require('./rig.js');const fs=require('fs');
fs.writeFileSync(__dirname+'/../kubo.svg',R.build());console.log('ok');
