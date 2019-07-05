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

describe('Contacts', ()=>{
	let rootJwtToken = '';
	let userId = '';
	let contactId = '';
	// Delete the User with username 'bc1'
	before((done) => {
        Models.Users.create({
              name: "BC",
              phone: "1234567890",
              email: "abc@gmail.com",
              username: "bc1",
              password: "test123"
      	}).then(function(user){
      		userId = user.id; // Set userId
      		rootJwtToken = `Bearer ${getToken({userId: userId})}`; // Set Token
      		done()
        })
    });

    after((done)=>{
    	Models.Contacts.destroy({
    		where:{
    			createdBy: userId
    		}
    	}).then(function(){
    		Models.Users.destroy({
	        	where:{
	        		id: userId
	        	}
	        }).then(function(){
	        	done();
	        })
    	});
    });

	describe('/Post Create Contact - Success', ()=>{
		it('should create a new contact', (done)=>{

			const contact = {
				firstName: "Hi",
              	lastName: "BC",
              	phone: "1234567890",
          	}

			chai.request(server)
				.post('/contacts/create')
				.set('Authorization', rootJwtToken)
				.send(contact)
				.end((err, res)=>{
					res.should.have.status(responseStatus.success.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(true);
					contactId = res.body.data.id;
					done();
				})
		})
	});

	describe('/Post Create Contact - No Token', ()=>{
		it('should not create a new contact', (done)=>{

			const contact = {
				firstName: "Hi",
              	lastName: "BC",
              	phone: "1234567890",
          	}

			chai.request(server)
				.post('/contacts/create')
				.send(contact)
				.end((err, res)=>{
					res.should.have.status(responseStatus.authenticationFailure.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(false);

					done();
				})
		})
	});

	describe('/Post Create Contact - Wrong Fields', ()=>{
		it('should not create a new contact', (done)=>{

			const contact = {
				firstName: "",
              	lastName: "BC",
              	phone: "1234567890ass",
          	}

			chai.request(server)
				.post('/contacts/create')
				.set('Authorization', rootJwtToken)
				.send(contact)
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
		});
	});

	describe('/Get Contacts', ()=>{
		it('should get all contacts', (done)=>{

			chai.request(server)
				.get('/contacts/getContacts')
				.set('Authorization', rootJwtToken)
				.end((err, res)=>{
					res.should.have.status(responseStatus.success.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(true);
					res.body.should.have.property('data');
					res.body.data.should.be.a('array');
					done();
				})
		})
	});

	describe('/contacts/update/:contactId Update Contact Details', ()=>{
		it('should update contact details', (done)=>{

			const updateData = {
				firstName: "Ni",
				lastName: "hi",
				phone: "1234567890"
			}

			chai.request(server)
				.put(`/contacts/update/${contactId}`)
				.set('Authorization', rootJwtToken)
				.send(updateData)
				.end((err, res)=>{
					res.should.have.status(responseStatus.success.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(true);
					done();
				})
		})
	})

	describe('/contacts/update/:contactId Update Contact Details', ()=>{
		it('should not update contact details - wrong fields', (done)=>{

			const updateData = {
				firstName: "",
				lastName: "hi",
				phone: "123412567890"
			}

			chai.request(server)
				.put(`/contacts/update/${contactId}`)
				.set('Authorization', rootJwtToken)
				.send(updateData)
				.end((err, res)=>{
					res.should.have.status(responseStatus.fieldMissing.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(false);
					res.body.should.have.property('error');
					res.body.error.should.be.a('array');
					res.body.error.length.should.eql(2);
					done();
				})
		})
	});


	describe('/contacts/update/:contactId Update Contact Details', ()=>{
		it('should not update contact details - without token', (done)=>{

			const updateData = {
				firstName: "Ni",
				lastName: "hi",
				phone: "1234567890"
			}

			chai.request(server)
				.post(`/contacts/update/${contactId}`)
				.send(updateData)
				.end((err, res)=>{
					res.should.have.status(responseStatus.authenticationFailure.code);
					res.should.be.a('object');
					res.body.should.have.property('status');
					res.body.status.should.eql(false);
					done();
				})
		})
	})

	// describe('/contacts/update/:contactId no contact with contact Id exists', ()=>{
	// 	it('should not update contact details', (done)=>{

	// 		const updateData = {
	// 			firstName: "Ni",
	// 			lastName: "hi",
	// 			phone: "1234567890"
	// 		}

	// 		chai.request(server)
	// 			.post('/contacts/update/100')
	// 			.set('Authorization', rootJwtToken)
	// 			.send(updateData)
	// 			.end((err, res)=>{
	// 				console.log(res.body);
	// 				res.should.have.status(responseStatus.noData.code);
	// 				res.should.be.a('object');
	// 				res.body.should.have.property('status');
	// 				res.body.status.should.eql(false);
	// 				done();
	// 			})
	// 	})
	// })
});