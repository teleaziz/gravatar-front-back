var express = require("express");

var router = express.Router();
var utility = require("mdhelper")
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOHQ_URL);

var questionSchema = new mongoose.Schema({
  code: String,
  email: String,
  question: String
});

var answerSchema = new mongoose.Schema({
  code: String,
  email: String,
  questionCode: String,
  answer: String
});

var Question = mongoose.model('Question', questionSchema);
var Answer = mongoose.model('Answer', answerSchema);

router.get("/test", function(req, res) {
  res.json({method: 'GET', serverTime: new Date()});
});

router.post("/test", function(req, res) {
  var output = req.body;
  output['postDataNumberOfKeys'] = Object.keys(req.body).length;
  output['method'] = 'POST';
  output['serverTime'] = new Date();
  res.json(output);
});

router.post("/questions", function(req, res) {
  var question = new Question({
    code: (new Date()).getTime().toString(),
    email: req.body.email,
    question: req.body.question
  });

  question.save(function(err, postedQuestion) {
    res.json(postedQuestion);
  });
});

router.get("/questions", function(req, res) {
  Question.find({}).exec(function(err, result) {
    res.json(result);
  });
});

router.delete("/questions/:questionCode", function(req, res) {
  Question.findOne({ code: req.params.questionCode }).remove().exec(function(err) {
    if (err) {
      res.json(500, { error: 'we suck' });
    }
    res.json({ message: 'document delete' });
  });
});

router.put('/questions/:questionCode', function(req, res) {
  Question.findOne({ code: req.params.questionCode }, function(err, question) {
    if (err) {
      console.log('Error on lookup!', err);
      return res.json(500, { error: 'could not process request'});
    }
    if (question) {
      if (req.body.email) {
        question.email = req.body.email;
      }
      if (req.body.question) {
        question.question = req.body.question
      }
      question.save(function (err, question) {
        if (err) {
          console.log('Error on save!', err);
          return res.json(500, { error: 'could not process request'});
        }
        res.json(question);
      });
    } else {
      res.json(404, { error: 'not found' });
    }
  });
});

router.get("/questions/:questionCode", function(req, res) {
  Question.findOne({ code: req.params.questionCode }).exec(function(err, question) {
    if (question) {
      res.json(question);
    } else {
      res.json(404, { error: 'no question found for that id' } );
    }
  });
});


router.get("/gravatar/:email", function(req, res) {
  // Return the gravatar url as text
  res.end("https://www.gravatar.com/avatar/" + utility.md5(req.params.email));
});


router.get("/avatar", function(req, res) {
  // Return the gravatar url as text
  res.end(process.env.ISCLIENT);
});

module.exports = router;
