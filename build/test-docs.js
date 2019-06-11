var fs = require('fs');

fs.readFile('../docs/index.html', (err, data) => {
  console.log(data);
});
