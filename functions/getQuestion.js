const { client, q } = require("../src/lib/fauna");

exports.handler = async (event, context) => {
  try {
    let {id} = event.queryStringParameters
    let results = await client.query(q.Get(q.Ref(q.Collection("questions"), id )));
    return { statusCode: 200, body: JSON.stringify({ id: results.ref.id, data: results.data }),};
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.toString() }) };
  }
};