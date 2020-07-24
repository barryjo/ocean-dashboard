let text = `/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/`


var path = require('path');
var appDir = path.dirname(require.main.filename);
console.log(appDir)
const replace = require('replace-in-file');

const results = replace.sync({
    files: `${appDir}/../../client/src/**/*.*`,
    from: text,
    to: '',
});

console.log(results)