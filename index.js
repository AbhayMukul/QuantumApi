var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyparser = require('body-parser');
var app = express();

app.use(cors());
app.use(bodyparser.json());
app.listen('5000', () => {
    console.log('server running at port 5000');
});

var db = mysql.createConnection({
    host: "database-1.cxaqyyfsqya9.ap-south-1.rds.amazonaws.com",
    user: "admin",
    password: "admin1234",
    database: "Trail"
});

// check db connection
db.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("database conected");
    }
})

app.get('/api', (req, res) => {
    res.send("API working")
})

app.get('/student/AttendedAndGraded', (req, res) => {

    console.log("attended test for id = " + req.body.id);

    let sql = ` SELECT TEST_DETAILS.ID,TEST_DETAILS.NAME,TEST_DETAILS.DESCRIPTION,TEST_DETAILS.DAY,TEST_DETAILS.TIME,TEST_DETAILS.DURATION,TEST_DETAILS.LINK,TEST_STUDENT_DETAILS.STATUS,TEST_STUDENT_DETAILS.SCORE 
                FROM TEST_DETAILS,TEST_STUDENT_DETAILS
                WHERE TEST_DETAILS.ID = TEST_STUDENT_DETAILS.TEST_ID
                AND TEST_STUDENT_DETAILS.STUDENT_ID = ${req.body.id};    
                `;

    db.query(sql, (err, result) => {
        if (err) {
             console.log(err);
        }
         res.send(result);
     })
})

app.get('/student/Preparedness' , (req,res) => {

    console.log("preparedness for id = " + req.body.id);

    let sql = ` SELECT SUBJECT_DETAILS.ID,SUBJECT_DETAILS.NAME,SUBJECT_DETAILS.CHAPTER,SUBJECT_DETAILS.WEIGHTAGE,STUDENT_PREPAREDNESS.NCERT_TEXTBOOKS,STUDENT_PREPAREDNESS.REFERENCE_BOOKS
                FROM SUBJECT_DETAILS,STUDENT_PREPAREDNESS
                WHERE SUBJECT_DETAILS.ID = STUDENT_PREPAREDNESS.CHAPTER_ID
                AND STUDENT_PREPAREDNESS.STUDENT_ID = ${req.body.id};    
                `;


    db.query(sql, (err, result) => {
        if (err) {
             console.log(err);
        }
         res.send(result);
     })
})

app.get('/student/UnAttended' , (req,res) => {

    console.log("unattended test for id = " + req.body.id);

    let sql = `SELECT * FROM TEST_DETAILS
                WHERE ID NOT IN 
                (SELECT ID FROM TEST_STUDENT_DETAILS
                WHERE TEST_DETAILS.ID = TEST_STUDENT_DETAILS.TEST_ID
                AND STUDENT_ID = ${req.body.id})
                `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
            res.send(result);
    })
})