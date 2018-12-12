// /**
//  * @author Maryam
//  * @description route end to end testing for run test refer to readme file
//  */
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../server');
// const db = require('../models');
// const expect = chai.expect;

// chai.use(chaiHttp);

// let request;


// describe('GET /api/user', function () {
//   // db.User.create([{ username: 'Sally', score: 10 }]);

//   beforeEach(function () {
//     request = chai.request(server);
//   });


// it('home page route', function(done) {
//     request
//     .get('/')
//     .end(function(err, res) {
//       expect(res).to.have.status(200);
//       expect(err).to.be.null;
//       done();                             
//     });
//   });

//   it('game page route', function(done) {
//     request
//     .get('/intro')
//     .end(function(err, res) {
//       expect(res).to.have.status(200);
//       expect(err).to.be.null;
//       done(); 
//     });
// });

//   it('game page route', function(done) {
//     request
//     .get('/landing')
//     .end(function(err, res) {
//       expect(res).to.have.status(200);
//       expect(err).to.be.null;
//       done(); 
//     });
//   });

//   it('game page route', function(done) {
//     request
//     .get('/game')
//     .end(function(err, res) {
//       expect(res).to.have.status(200);
//       expect(err).to.be.null;
//       done(); 
//     });
//   });

//   it('should find all examples', function (done) {
//       request.get('/api/user').end(function (err, res) {

//         expect(err).to.be.null;
//         expect(res.status).to.equal(200);
//         expect(res.body).to.be.an('array');
//         try{
//           expect(res.body[0]).to.be.an('object');//.that.includes({_id: 1234, username: 'Sally', score: 10 }); in second time test
//         }catch(e){
//           expect(res.body[0]).to.be.an('undefined');//if db is empty
//         }
        
//         done();
//     });
//   });


//   it('should create examples', function (done) {
//       request
//       .post('/api/user')
//       .type('form')
//       .send({
//       'username': 'sally',
//       'score': 0
//       })
//       .end(function (err, res) {
//         expect(err).to.be.null;
//         expect(res.status).to.equal(200);
//         expect(res.body).to.be.an('object');//.that.includes({_id: 1234..., username: 'Sally', score: 10 });
//         expect(res.body.username).to.be.equal('sally');
//         done();
//     });
//   });

//   it('should find selected field example of db', function (done) {
//     request
//     .get('/api/user/sally')//or  test 2: .get('/api/user/mag')
//     .end(function (err, res) {
//       expect(err).to.be.null;
//       expect(res.status).to.equal(200);
//       try{
//         expect(res.body).to.be.an('object');
//         expect(res.body.username).to.be.equal('sally');
//       }catch(e){
//         expect(res.body).to.be.null;
//       }
      
//       done();
//   });
// });

// it('should update selected examples', function (done) {
//   request
//   .put('/api/user/sally')//or  test 2: .get('/api/user/mag')
//   .end(function (err, res) {
//     expect(err).to.be.null;
//     expect(res.status).to.equal(200);
//     try{
//       expect(res.body).to.be.an('object');
//       expect(res.body.username).to.be.equal('sally');
//     }catch(e){
//       expect(res.body).to.be.null;
//     }
    
//     done();
// });
// });


// it('should delete selected examples', function (done) {
//   request
//   .delete('/api/user')
//   .type('form')
//   .send({
//   'username': 'sally'
//   })
//   .end(function (err, res) {
//     expect(err).to.be.null;
//     expect(res.status).to.equal(200);
//     expect(res.body).to.be.an('object').that.includes({ success: 'success' });
//     done();
//     });
//   });

// });