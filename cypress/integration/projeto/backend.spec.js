/// <reference types="cypress" />

import '../../support/apiCommands';
describe('Should test at a functional level', () => {
    // let token;
    before(() => {
        cy.getToken('gabriel123teste.com', 'teste123')
            // .then(tkn => token = tkn);
    });

    beforeEach(() => {
        cy.resetApiRest();
    });

    it('Should create an account', () => {
        cy.request({
            method: 'POST',
            url: '/contas',
            body: { nome: 'Conta criada via api' },
            // headers: { Authorization: `JWT ${token}` }
        }).as('response');

        cy.get('@response').then(response => {
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('nome', 'Conta criada via api');
        });
    });

    it('Should update an account', () => {
        cy.getCountByName('Conta para alterar').then(countId => {
            cy.request({
                method: 'PUT',
                url: `/contas/${countId}`,
                body: { nome: 'Conta editada via api' },
                // headers: { Authorization: `JWT ${token}`}
            }).as('response');
    
            cy.get('@response').then(response => {
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('nome', 'Conta editada via api');
            });
        });
    });

    it('Should not crate an account with some name', () => {
        cy.request({
            method: 'POST',
            url: '/contas',
            body: { nome: 'Conta mesmo nome' },
            // headers: { Authorization: `JWT ${token}`},
            failOnStatusCode: false
        }).as('response');

        cy.get('@response').then(response => {
            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal('Já existe uma conta com esse nome!');
        });
    });

    it('Should create a transction', () => {
        cy.getCountByName('Conta para movimentacoes').then(countId => {
                cy.request({
                    method: 'POST',
                    url: '/transacoes',
                    body: {
                        conta_id: countId,
                        data_pagamento: Cypress.moment().add({days: 1}).format('DD/MM/YYYY'),
                        data_transacao: Cypress.moment().format('DD/MM/YYYY'),
                        descricao: 'Pizza',
                        envolvido: 'Banco Inter',
                        status: true,
                        tipo: 'REC',
                        valor: '750'
                    },
                    // headers: { Authorization: `JWT ${token}`},
                }).as('response');

                cy.get('@response').its('status').should('be.equal', 201);
                cy.get('@response').its('body.id').should('exist');
            });
    });

    it('Should get balance', () => {
        cy.request({
            method: 'GET',
            url: '/saldo',
            // headers: { Authorization: `JWT ${token}`},
        }).then(response => {
                let souldCount = null;
                response.body.forEach(count => {
                    if(count.conta === "Conta para saldo") souldCount = count.saldo;
                });
                expect(souldCount).to.equal('534.00');
        });

        cy.request({
            method: 'GET',
            url: '/transacoes',
            // headers: { Authorization: `JWT ${token}`},
            qs: { descricao: 'Movimentacao 1, calculo saldo' },
        }).then(response => {
            cy.request({
                method: 'PUT',
                url: `/transacoes/${response.body[0].id}`,
                body: { 
                    conta_id: response.body[0].conta_id,
                    data_pagamento: Cypress.moment(response.body[0]).format('DD/MM/YYYY'),
                    data_transacao: Cypress.moment(response.body[0]).format('DD/MM/YYYY'),
                    descricao: response.body[0].descricao,
                    envolvido: response.body[0].envolvido,
                    status: true,
                    valor: response.body[0].valor
                 },
                // headers: { Authorization: `JWT ${token}`},
            }).its('status').should('be.equal', 200);
        });

        cy.request({
            method: 'GET',
            url: '/saldo',
            // headers: { Authorization: `JWT ${token}`},
        }).then(response => {
                let souldCount = null;
                response.body.forEach(count => {
                    if(count.conta === "Conta para saldo") souldCount = count.saldo;
                });
                expect(souldCount).to.equal('4034.00');
        });
    });

    it('Should remove a transaction', () => {
        cy.request({
            method: 'GET',
            url: '/transacoes',
            // headers: { Authorization: `JWT ${token}`},
            qs: { descricao: 'Movimentacao para exclusao' },
        }).then(response => {
            cy.request({
                method: 'DELETE',
                url: `/transacoes/${response.body[0].id}`,
                // headers: { Authorization: `JWT ${token}`},
            }).its('status').should('be.equal', 204);
        });
    });
});

