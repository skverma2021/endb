const { validate } = require('../models/client');
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
    const result = await pool
      .request()
      .query(
        'SELECT client.id, client.shortName, client.longName, client.website, client.contactName, client.contactEMail, client.contactMobile, client.addLine1, client.street, client.cityId, cities.cityName FROM client INNER JOIN cities ON client.cityId = cities.id'
      );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to insert city data
router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const {
      shortName,
      longName,
      website,
      contactName,
      contactEMail,
      contactMobile,
      addLine1,
      street,
      cityId,
    } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('shortName', sql.NChar(10), shortName)
      .input('longName', sql.VarChar(100), longName)
      .input('website', sql.VarChar(100), website)
      .input('contactName', sql.VarChar(50), contactName)
      .input('contactEMail', sql.VarChar(100), contactEMail)
      .input('contactMobile', sql.BigInt, contactMobile)
      .input('addLine1', sql.VarChar(100), addLine1)
      .input('street', sql.VarChar(50), street)
      .input('cityId', sql.Int, cityId)
      .query(
        'INSERT INTO client (shortName, longName, website, contactName, contactEMail, contactMobile, addLine1, street, cityId) VALUES (@shortName, @longName, @website, @contactName, @contactEMail, @contactMobile, @addLine1, @street, @cityId)'
      );

    // res;
    res
      .status(201)
      .send(`client data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting client data:', err);
    res.status(500).send('Internal Server Error');
  }
});
// POST route to insert city data
router.put('/:id', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(`Invalid input: ${error.details[0].message}`);
    const { id } = req.params;
    const {
      shortName,
      longName,
      website,
      contactName,
      contactEMail,
      contactMobile,
      addLine1,
      street,
      cityId,
    } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('shortName', sql.NChar(10), shortName)
      .input('longName', sql.VarChar(100), longName)
      .input('website', sql.VarChar(100), website)
      .input('contactName', sql.VarChar(50), contactName)
      .input('contactEMail', sql.VarChar(100), contactEMail)
      .input('contactMobile', sql.BigInt, contactMobile)
      .input('addLine1', sql.VarChar(100), addLine1)
      .input('street', sql.VarChar(50), street)
      .input('cityId', sql.Int, cityId)
      .query(
        'UPDATE client SET shortName = @shortName, longName = @longName, website = @website, contactName = @contactName, contactEMail = @contactEMail, contactMobile = @contactMobile, addLine1 = @addLine1, street = @street, cityId = @cityId  WHERE id = @id'
      );

    res
      .status(201)
      .send(`client data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting client data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE route to delete a record from the client table
router.delete('/:id', async (req, res) => {
  console.log('Hi');
  try {
    const { id } = req.params;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Delete the record from the Client table
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM client WHERE id = @id');

    res.send('Record deleted successfully');
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).send('Internal Server Error');
  }
});

// GET one Client
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM client where id = @id');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
