var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const readline = require('readline');
var s3alp = require('s3-access-log-parser');


async function processLineByLine(fileName) {
    const fileStream = fs.createReadStream(fileName);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    var myData = [];
     // add at the end
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      //console.log(`Line from file: ${line}`);
      myData.push(line);
    }
    convert_to_csv(myData);
  }

    function convert_to_csv(Data){
    //console.log(Data);
    var i;
    for(i=0;i<=Data.length;i++)
    {
        console.log(s3alp(Data[i]));
    }

    };

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      processLineByLine(oldpath);
      fs.readFile(oldpath, function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    //   var newpath = 'C:/Users/pksin/' + files.filetoupload.name;
    //   fs.rename(oldpath, newpath, function (err) {
    //     if (err) throw err;
    //     res.write('File uploaded and moved!');
    //     res.end();
    //   });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);

