var fs = require('fs');

fs.readdir('../docs', (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});

fs.readdir('./docs', (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});
