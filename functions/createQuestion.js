const { client, q } = require("../src/lib/fauna");

exports.handler = async (event, context) => {
  try {
    let { question, answer, options } = JSON.parse(event.body);
    let results = await client.query(
      q.Create(q.Collection("questions"), {data: { question, answer, options },}),
    );
    return {statusCode: 200, body: JSON.stringify({ id: results.ref.id, data: results.data }),};
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.toString() }) };
  }
};
