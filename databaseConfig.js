const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'mykeyspace'
});

const init = async () => {
  try {
    await client.connect();
    console.log('Connected to Cassandra database');
  } catch (err) {
    console.error('Failed to connect to Cassandra database', err);
    process.exit(1);
  }
};

const executeQuery = async (query, params = []) => {
  try {
    const result = await client.execute(query, params, { prepare: true });
    return result.rows;
  } catch (err) {
    console.error('Failed to execute query', err);
    throw err;
  }
};

module.exports = {
  init,
  executeQuery
};
