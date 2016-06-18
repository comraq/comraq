import comraq from "../src";
const { ajax } = comraq.utils;

describe("utils:", () => {
  describe("ajax:", () => {
    let server;
    before(() => server = sinon.fakeServer.create());
    after(() => server.restore());

    it("should GET data", done => {
      ajax({
        method: "GET",
        url: "/"
      }).then(res => {
        res = JSON.parse(res);
        res.body.should
          .have.property("some key", "some value");

        done();
      })
      .catch(err => done(err));
    
      server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({
          "some key": "some value",
          "another key": "another value"
        })
      );
    });

    it("should POST data", done => {
      ajax({
        method: "POST",
        url: "/",
        body: {
          postkey: "post value"
        }
      }).then(res => {
        res = JSON.parse(res);
        expect(res.body.message).to.deep.equal("Success!");
        done();
      })
      .catch(done);
    
      let req = server.requests[1];
      JSON.parse(req.requestBody).should.have.property("postkey", "post value");

      req.respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({ message: "Success!" })
      );
    });
  });
});
