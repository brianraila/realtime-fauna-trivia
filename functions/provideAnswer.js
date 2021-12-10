// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { client, q } = require("../src/lib/fauna");

exports.handler = async (event, context) => {
  try {
    let { question_id, answer, user_id } = JSON.parse(event.body);

    // ensure no missing values
    if (!(question_id && answer && user_id)) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Fields question_id & answer & user_id required ",
        }),
      };
    }

    let results = await client.query(
      q.Get(q.Ref(q.Collection("questions"), question_id)),
    );
    let question = results.data;
    let isCorrect = false;
    if (question.answer === answer) isCorrect = true;
    try {
      let query = await client.query(
        q.Create(q.Collection("answers"), {
          data: {
            question_id,
            user_id,
            isCorrect: isCorrect,
            response: answer,
          },
        }),
      );
      query.data.correct = question.correct_answer;
      if (isCorrect) {
        // update the user's score if correct
        try {
          let score = await client.query(
            q.Get(q.Ref(q.Collection("scores"), process.env.LEADERBOARD_ID)),
          );
          console.log("S", score,)
          let req = await client.query(
            q.Update(q.Ref(q.Collection("scores"), process.env.LEADERBOARD_ID), {
              data: { [user_id]: ( (user_id in score.data) ? (score.data[user_id] + 10) : 10) },
            }),
          );
        } catch (error) {
            console.log(error)
            return {
                statusCode: 500, body: JSON.stringify({ error: error.toString() }),};
        }
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ ref: query.ref.id, data: query.data }),
      };
    } catch (error) {
      if (error.message === "instance not unique") {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Question is already answered" }),
        };
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.toString() }),
      };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.toString() }) };
  }
};
