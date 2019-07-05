// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev dependencies
const dotenv = require('dotenv')
dotenv.config();

const Models = require('../models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');
const should = chai.should();
const responseStatus = require('../helpers/responseStatus.js');
const getToken = require('../helpers/token.js').getToken;

chai.use(chaiHttp);

describe('Users', ()=>{
	let rootJwtToken = '';
	// Delete the User with username 'bc1'
	before((done) => {
        Models.Users.destroy({
        	where:{
        		username: 'bc1'
        	}
        }).then(function(){
        	done();
        })
    });

    after((done)=>{
    	Models.Users.destroy({
        	where:{
        		username: 'bc1'
        	}
        }).then(function(){
        	done();
        })
    });

	describe('/Post Create User - Success', ()=>{
		it('should create a new user and return a jwt token', (done)=>{

			const user = {
              name: "BC",
              phone: "1234567890",
              email: "abc@gmail.com",
              username: "bc1",
              password: "test123"
          	}

			chai.request(server)
				.post('/user/register')
				.send(user)
				.end((err, res)=>{
					res.should.have.status(responseStatus.success.code);
					res.should.be.a('object');
					res.body.should.have.property('token');
					res.body.should.have.property('status');
					res.body.status.should.eql(true);
					rootJwtToken = `Bearer ${res.body.token}`;
					done();
				})
		})
	});

	describe('/Login User Success', ()=>{
		it('should login the user', (done)=>{
			const user = {
				username: 'bc1',
				password: 'test123'
			}

			chai.request(server)
				.post('/user/login')
				.send(user)
				.end((err, res)=>{
					res.should.have.status(responseStatus.success.code);
					res.should.be.a('object');
					res.body.should.have.property('token');
					res.body.should.have.property('status');
					res.body.status.should.eql(true);
					rootJwtToken = `Bearer ${res.body.token}`;
					done();
				})
		})
	});

	describe('/Login User wrong password', ()=>{
		it('should not login the user', (done)=>{
			const user = {
				username: 'bc1',
				password: 'test12'
			}

			chai.request(server)
				.post('/user/login')
				.send(user)
				.end((err, res)=>{
					res.should.have.status(responseStatus.authenticationFailure.code);
					res.should.be.a('object');
					res.body.should.not.have.property('token');
					res.body.should.have.property('status');
					res.body.status.should.eql(false);
					done();
				})
		})
	});


	describe('/Post Create User - wrong fields', ()=>{
		it('should give errors', (done)=>{
			const user = {
              name: "",
              phone: "abcdefghij",
              email: "abcgmail.com",
              username: "bc1",
              password: "123"
          	}

			chai.request(server)
				.post('/user/register')
				.send(user)
				.end((err, res)=>{
					res.should.have.status(responseStatus.fieldMissing.code);
					res.should.be.a('object');
					res.body.should.have.property('error');
					res.body.should.have.property('status');
					res.body.status.should.eql(false);
					res.body.error.should.be.a('array');
					res.body.error.length.should.not.equal(0);
					done();
				})
		})
	});

	describe('/Put Password - Correct', ()=>{
		it('should update password', (done)=>{
			const data = {
				oldPassword: "test123",
				newPassword: "test1234"
			}

			chai.request(server)
				.put('/user/updatePassword')
				.set('Authorization', rootJwtToken)
				.send(data)
				.end((err, res)=>{
					res.should.have.status(responseStatus.success.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(true);

					// Login with new Password
					const user = {
						username: 'bc1',
						password: 'test1234'
					}

					chai.request(server)
						.post('/user/login')
						.send(user)
						.end((err, res)=>{
							res.should.have.status(responseStatus.success.code);
							res.should.be.a('object');
							res.body.should.have.property('token');
							res.body.should.have.property('status');
							res.body.status.should.eql(true);
							done();
						});
				})

		})
	});


	describe('/Put Password - wrong password', ()=>{
		it('should not update password', (done)=>{
			const data = {
				oldPassword: "test123", // wrong old password
				newPassword: "test123"
			}

			chai.request(server)
				.put('/user/updatePassword')
				.set('Authorization', rootJwtToken)
				.send(data)
				.end((err, res)=>{
					res.should.have.status(responseStatus.authenticationFailure.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(false);

					// Login with new Password
					const user = {
						username: 'bc1',
						password: 'test123'
					}

					chai.request(server)
						.post('/user/login')
						.send(user)
						.end((err, res)=>{
							res.should.have.status(responseStatus.authenticationFailure.code);
							res.should.be.a('object');
							res.body.should.not.have.property('token');
							res.body.should.have.property('status');
							res.body.status.should.eql(false);
							done();
						});
				})

		})
	});

	describe('/Put Password - Short new password', ()=>{
		it('should not update password', (done)=>{
			const data = {
				oldPassword: "test1234", 
				newPassword: "123" // short password
			}

			chai.request(server)
				.put('/user/updatePassword')
				.set('Authorization', rootJwtToken)
				.send(data)
				.end((err, res)=>{
					res.should.have.status(responseStatus.fieldMissing.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.should.have.property('error');
					res.body.status.should.eql(false);
					res.body.error.should.be.a('array');
					res.body.error.length.should.not.equal(0);
					// Login with new Password
					const user = {
						username: 'bc1',
						password: '123'
					}

					chai.request(server)
						.post('/user/login')
						.send(user)
						.end((err, res)=>{
							res.should.have.status(responseStatus.authenticationFailure.code);
							res.should.be.a('object');
							res.body.should.not.have.property('token');
							res.body.should.have.property('status');
							res.body.status.should.eql(false);
							done();
						});
				})

		})
	});


	describe('/user/check/:username Users Existent', ()=>{
		it('should return conflict.', (done)=>{
			chai.request(server)
				.get('/user/check/bc1')
				.end((err, res)=>{
					res.should.have.status(responseStatus.conflict.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(false);
					done();
				})
		})
	});

	describe('/user/check/:username Users Non-Existent', ()=>{
		it('should return success.', (done)=>{
			chai.request(server)
				.get('/user/check/bc2')
				.end((err, res)=>{
					res.should.have.status(responseStatus.success.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(true);
					done();
				})
		})
	});

	describe('/Put Update User Details', ()=>{
		it('should return success.', (done)=>{

			const data = {
				name: "BHaratC",
				phone: "0123456789"
			}

			chai.request(server)
				.put('/user/update')
				.set('Authorization', rootJwtToken)
				.send(data)
				.end((err, res)=>{
					res.should.have.status(responseStatus.success.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(true);
					done();
				})
		})
	});

	describe('/Put Update User Details - Wrong Phone', ()=>{
		it('should return status false.', (done)=>{

			const data = {
				name: "BHaratC",
				phone: "0123456789ass"
			}

			chai.request(server)
				.put('/user/update')
				.set('Authorization', rootJwtToken)
				.send(data)
				.end((err, res)=>{
					res.should.have.status(responseStatus.fieldMissing.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(false);
					res.body.should.have.property('error');
					res.body.error.should.be.a('array');
					res.body.error.length.should.not.equal(0);
					done();
				})
		})
	});

	describe('/Get User Details', ()=>{
		it('should return user data', (done)=>{
			chai.request(server)
				.get('/user/profile')
				.set('Authorization', rootJwtToken)
				.end((err, res)=>{
					res.should.have.status(responseStatus.success.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(true);
					res.body.should.have.property('data');
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('name');
					res.body.data.should.have.property('email');
					res.body.data.should.have.property('phone');
					res.body.data.should.have.property('username');
					done();
				})
		})
	});

	// describe('/Get User Details - User does not exists', ()=>{
	// 	it('should return 404', (done)=>{

	// 		const wrongToken = getToken({userId: 0});
	// 		console.log(wrongToken);
	// 		chai.request(server)
	// 			.get('/user/profile')
	// 			.set('Authorization', wrongToken)
	// 			.end((err, res)=>{
	// 				res.should.have.status(responseStatus.noData.code);
	// 				res.should.be.a('object');
	// 				res.body.should.have.property('status');
	// 				res.body.status.should.eql(false);
	// 				done();
	// 			})
	// 	})
	// });	

	describe('/Get User Details - No Token', ()=>{
		it('should return 404', (done)=>{
			chai.request(server)
				.get('/user/profile')
				.end((err, res)=>{
					res.should.have.status(responseStatus.authenticationFailure.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(false);
					done();
				})
		})
	});	
});