var fs = require('fs');

fs.readFile('./docs/index.html', (err, data) => {
  if (!data) return console.log(err);
  return console.log(data);
});
