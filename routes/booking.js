// const { validate } = require('../models/emp');
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

router.get('/:empId/:wpId/:dtId', async (req, res) => {
  try {
    const { empId, wpId, dtId } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('wpId', sql.Int, wpId)
      .input('dtId', sql.BigInt, dtId).query(`
    SELECT booking FROM     bookings WHERE  (empId = @empId) AND (workPlanId = @wpId) AND (dateId = @dtId)
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
