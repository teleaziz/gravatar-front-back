var expect = chai.expect;
var request = superagent;

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
