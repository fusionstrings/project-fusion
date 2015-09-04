import {bootstrap} from './es-mod';
import cjs from './common-mod';
bootstrap();
var cjsImport = cjs();
console.log(cjsImport, 'CommonJS called from main.js');
