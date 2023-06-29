const { validate } = require('../models/emp');
const express = require('express');
const router = express.Router();
const sql = require('mssql');

const config = {
  server: 'VERMARNCDBG',
  database: 'CJIS',
  user: 'apiUserLogin',
  password: 'theApiUser',
  trustServerCertificate: true,
};

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM emp');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to insert employee data
router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const {
      uId,
      fName,
      mName,
      sName,
      title,
      dob,
      gender,
      addLine1,
      cityId,
      mobile,
      eMailId,
      passwd,
    } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert employee data into the Employees table
    await pool
      .request()
      .input('uId', sql.BigInt, uId)
      .input('fName', sql.VarChar(50), fName)
      .input('mName', sql.VarChar(50), mName)
      .input('sName', sql.VarChar(50), sName)
      .input('title', sql.NChar(3), title)
      .input('dob', sql.Date, dob)
      .input('gender', sql.NChar(1), gender)
      .input('addLine1', sql.VarChar(100), addLine1)
      .input('cityId', sql.Int, cityId)
      .input('mobile', sql.BigInt, mobile)
      .input('eMailId', sql.VarChar(150), eMailId)
      .input('passwd', sql.VarChar(150), passwd)

      .query(
        'INSERT INTO emp (uId,fName,mName,sName,title,dob,gender,addLine1,cityId,mobile,eMailId,passwd) VALUES (@uId,@fName,@mName,@sName,@title,@dob,@gender,@addLine1,@cityId,@mobile,@eMailId,@passwd)'
      );

    res.status(201).send('Employee data inserted successfully');
  } catch (err) {
    console.error('Error inserting employee data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// router.post('/', (req, res) => {
//   const { error } = validate(req.body);
//   if (error)
//     return res.status(400).send(`Invalid input: ${error.details[0].message}`);

//   var sql = `INSERT INTO customers (name, isGold, phone) VALUES ('${req.body.name}', '${req.body.isGold}', '${req.body.phone}')`;
//   con.query(sql, function (err, result) {
//     if (err)
//       return res
//         .status(400)
//         .send(`record could not be inserted: ${err.message}`);
//     console.log('1 record inserted');
//     res.send(`a customer created with ID:${result.insertId}`);
//   });
// });

// //  Update user with id
// router.put('/:id', function (req, res) {
//   if (!(parseInt(req.params.id) > 0))
//     return res.status(400).send(`invalid parameter: ${req.params.id}`);
//   const { error } = validate(req.body);
//   if (error)
//     return res.status(400).send(`Invalid input: ${error.details[0].message}`);
//   con.query(
//     'UPDATE customers SET name = ?, isGold = ?, phone = ? WHERE id = ?',
//     [req.body.name, req.body.isGold, req.body.phone, req.params.id],
//     function (err, result, fields) {
//       if (err)
//         return res
//           .status(400)
//           .send(`record could not be updated: ${err.message}`);
//       if (result.changedRows !== 0) {
//         console.log('1 record updated');
//       }
//       res.send(`Rows changed:${result.changedRows}`);
//     }
//   );
// });

// //  Delete user
// router.delete('/:id', function (req, res) {
//   if (!(parseInt(req.params.id) > 0))
//     return res.status(400).send(`invalid parameter: ${req.params.id}`);
//   con.query(
//     'DELETE FROM customers WHERE id = ?',
//     [req.params.id],
//     function (err, result, fields) {
//       if (err)
//         return res
//           .status(400)
//           .send(`record could not be deleted: ${err.message}`);
//       if (result.affectedRows !== 0) console.log('1 record deleted');
//       res.send(`Affected Rows: ${result.affectedRows}`);
//     }
//   );
// });

// // Retrieve user with id
// router.get('/:id', function (req, res) {
//   if (!(parseInt(req.params.id) > 0))
//     return res.status(400).send(`invalid parameter: ${req.params.id}`);
//   con.query(
//     'SELECT * FROM customers where id=?',
//     req.params.id,
//     function (err, result, fields) {
//       if (err)
//         return res
//           .status(400)
//           .send(`record could not be retrieved: ${err.message}`);
//       console.log('1 record retrieved');
//       res.send(result);
//     }
//   );
// });

module.exports = router;
