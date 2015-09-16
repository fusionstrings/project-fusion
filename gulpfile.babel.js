// Load custom tasks from the `tasks` directory
try { require('require-dir')('gulp/tasks'); } catch (err) { console.error(err); }
