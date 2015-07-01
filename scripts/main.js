import {bootstrap} from './es-mod';
import cjs from './common-mod';
bootstrap();
var cjsImport = cjs();
console.log(cjsImport, 'CommonJS');
//console.log( 'The area of a circle of radius 4 is ' + s);