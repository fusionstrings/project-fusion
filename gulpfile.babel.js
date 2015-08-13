// Load custom tasks from the `tasks` directory
try { require('require-dir')('build/tasks'); } catch (err) { console.error(err); }
