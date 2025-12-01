const pg = require('pg');
console.log('Type of pg:', typeof pg);
console.log('pg keys:', Object.keys(pg));
try {
    const { Pool } = require('pg');
    console.log('Pool:', Pool);
    new Pool();
} catch (e) {
    console.error('Error:', e);
}
