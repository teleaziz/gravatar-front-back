var expect = chai.expect;
var request = superagent;
var testingCode ; 
describe("Array.length", function() {
   it("returns number of elements in an array", function(){
      expect([2,3].length).to.equal(2);
      expect([2,3,-1,0].length).to.equal(4);
      expect([].length).to.equal(0);
   });
});   
describe("NaN is not equal to itself" , function() {
  it("does not equal itself", function () {
    expect(NaN==NaN).to.equal(false);
    
  });

  
});
describe("test api ", function() {
  it("Get Questions" , function() {
    request.get("api/questions").end(function(err,res){
    expect(res.body.length).to.be.at.least(1);
  });
  });
});


describe("API creates a question ", function() {
  it("Accepts email and question and creates a Question object" , function(done) {
    request.post("api/questions")
    .send({email:"test@test.com" , question: "test question"})
    .end(function(err,res){
      expect(res.status).to.equal(200);
      expect(res.body.email).to.equal("test@test.com");
      expect(res.body.question).to.equal("test question");
      testingCode = res.body.code ; 
      done();
  });
  });
});


describe("API lists all questions ", function() {
  it("Returns a list of all questions" , function(done) {
    request.get("api/questions")
    .end(function(err,res){
      expect(res.status).to.equal(200);
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0]).to.have.property("question");
      done();
  });
  });
});




describe("API fetch a single question ", function() {
  it("Returns a 404 for a non existing question" , function(done) {
    request.get("api/questions/12930123123")
    .end(function(err,res){
      expect(res.status).to.equal(404);
      done();
  });
  });
  
  it("Returns a questions object for valid question" , function(done) {
    request.get("api/questions/"+testingCode)
    .end(function(err,res){
      expect(res.status).to.equal(200);
      expect(res.body.question).to.equal("test question")
      done();
  });
  });
  
});

describe("API update a valid question ", function() {
  it("Returns a 404 for a non existing question" , function(done) {
    request.put("api/questions/12930123123")
    .send({question:"hello I'm an updated question?"})
    .end(function(err,res){
      expect(res.status).to.equal(404);
      done();
  });
  });
  
  it("Returns a questions object with the updated field" , function(done) {
    request.put("api/questions/"+testingCode)
    .send({question:"hello I am an updated question?"})
    .end(function(err,res){
      expect(res.status).to.equal(200);
      expect(res.body.question).to.equal("hello I am an updated question?");
      expect(res.body.email).to.equal("test@test.com");
      done();
  });
  });
  
});
