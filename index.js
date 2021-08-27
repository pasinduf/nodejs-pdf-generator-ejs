const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");

const app = express();
app.use(cors())

app.use(bodyParser.json());
app.use(express.static('public'))
app.listen(3001, () => { console.log('server started') });



app.post('/data', (req, res) => {
    const record = req.body;
    var status = asyncCall(record);
    const url = "http://45.32.109.196:7000";
    const result = {
        status: status,
        url: status ? `${url}/reports/${fileName(record.date)}.pdf` : ''
    }
    res.send(result);
})


function asyncCall(record) {
    let result = true;
    try {
        var options = {
            "format": "A3",
            "orientation": "landscape",
            "border": {
                "top": "0.2in",
                "right": "0.2in",
                "bottom": "0.2in",
                "left": "0.2in"
            },
            "timeout": "120000"
        };
        ejs.renderFile(path.join(__dirname, './templates/', "report.ejs"), { record: record }, (err, data) => {
            if (err) {
                result = false;
            } else {
                pdf.create(data, options).toFile(path.join(process.cwd(), 'public', 'reports', `${fileName(record.date)}.pdf`), function (err, data) {
                    if (err) {
                        result = false;
                    }
                });
            }
        });
        return result;
    } catch (e) {
        console.log('error', e);
        return false;
    }
}



const fileName = function (dateValue) {
    var date = new Date(dateValue);
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    return [date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('');
}


