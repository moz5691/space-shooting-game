/* eslint-disable */

/**
 * @author Maryam
 * @description Login div test
 * @description Dom testing with mocha and chai for more information refer to readme file
 */

let alert;

function generateAlert(x) {
  if (!x) {
    return;
  }
  alert(x);
}
/**
 * @description it should test like react abd angular becase pages are dynamically rendering
 */
 describe('enter button click', function () { 

    it('should create login tag', function () {
  
      var e = $.Event("keydown");
      e.which = 13;
      $(document).trigger(e);
      expect($('#maindiv').length === 1).to.be.true;
    }); 
  });

describe("open welcome tag", function() {
  beforeEach(function() {
    alert = sinon.spy();
  });

  it('should create welcome tag', function () {
    $('.validate').val('someone');
    $('#submit-btn').trigger('click');
    expect($('#canvas').length === 1).to.be.true;
    expect($('#login-card').length === 1).to.be.false;
  }); 

  it("should create an alert when input is empty", function() {
    generateAlert(true);
    $(".validate").val("");
    $("#submit-btn").trigger("click");

    expect(alert.calledOnce).to.be.true;
    expect(alert.args[0][0]).to.equal(true);
  });
});

describe('open leaderbord tag', function () {

  it('should create leaderboard tag', function () {
    $('#leaderboard-btn').trigger('click');
    expect($('#canvas').length === 1).to.be.true;
    expect($('#login-card').length === 1).to.be.false;
  });
});

/**
 * @description Functional Tests with sinon for more information refer to readme
 */
describe("login submit click route", function() {
  let server;

  beforeEach(function() {
    server = sinon.fakeServer.create();
  });

  afterEach(function() {
    server.restore();
  });

  it("should search username on db on click", function() {
    $("#icon_prefix").val("sara");
    let username = $("#icon_prefix").val();

    server.respondWith('GET', `/api/user/sara`, [
      200, { 'Content-Type': 'application/json' }, JSON.stringify({username: 'sara', score: 5})
    ]);

    $("#submit-btn").trigger("click");

    server.respond();
    expect($('#canvas').length === 1).to.be.true;
    expect($('#login-page').length === 1).to.be.false;
  });

  it("should add new user to db and retrn it by 0 score", function() {
    server.respondWith("GET", "/api/user/david", [
      200,
      { "Content-Type": "application/json" },
      JSON.stringify({})
    ]);
    server.respondWith("POST", "/api/user", [
      200,
      { "Content-Type": "application/json" },
      JSON.stringify({ username: "david", score: 0 })
    ]);

    $("#submit-btn").trigger("click");
    server.respond();
    expect($('#canvas').length === 1).to.be.true;
    expect($('#login-card').length === 1).to.be.false;
  });
});
