/// <reference types="cypress" />

import '../../support/contasCommands';
import buildEnv from '../../support/buildEnv';
describe('Should test at a functional level', () => {
    after(() => {
        cy.clearLocalStorage();
    });

    beforeEach(() => {
        buildEnv();    
        cy.login('a@a', 'Senha errada', 'Usuario falso');
    });

    it('Should test the responsiveness', () => {
        cy.get('[data-test=menu-home]')
            .should('exist')
            .and('be.visible');

        cy.viewport(500, 700);
        cy.get('[data-test=menu-home]')
            .should('exist')
            .and('not.visible');

        cy.viewport('iphone-5');
        cy.get('[data-test=menu-home]')
            .should('exist')
            .and('not.visible');

        cy.viewport('ipad-2');
        cy.get('[data-test=menu-home]')
            .should('exist')
            .and('be.visible');
    });

    it('Should create an account', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: 'Conta falsa 1', visivel: true, usuario_id: 1 },
            
        }).as('saveConta');

        cy.accessMenuAccount();
        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                 { id: 1, nome: 'Conta falsa 1', visivel: true, usuario_id: 1 },
                 { id: 2, nome: 'Conta falsa 2', visivel: true, usuario_id: 1 },
                 { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            ]
        }).as('contaSave');
        cy.incertMenuAccount('Conta de teste');
        cy.get('.toast-message').should('contain', 'Conta inserida com sucesso')
    });

    it('Should update an account', () => {
        cy.route({
            method: 'PUT',
            url: '/contas/**',
            response: [
                { id: 2, nome: 'Conta falsa Alterada', visivel: true, usuario_id: 1 },
            ]
        });

        cy.accessMenuAccount();
        
        cy.get('tbody tr .fa-edit')
            .first()
            .click();

        cy.incertMenuAccount('Conta falsa 2');

        cy.get('.toast-message').should('contain', 'Conta atualizada com sucesso')
    });

    it('Should not crate an account with some name', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { error: 'Já existe uma conta com esse nome!' },
            status: 400
        }).as('saveContaMesmoNome');

        cy.accessMenuAccount();
        cy.incertMenuAccount('Conta mesmo nome');
        cy.get('.toast-message').should('contain', 'code 400');
    });

    it('Should create a transction', () => {
        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: { "id": 1645449, "descricao": "teste", "envolvido": "5aawer", "observacao": null, "tipo": "REC",  "data_transacao": "2023-06-01T03:00:00.000Z", "data_pagamento": "2023-06-01T03:00:00.000Z", "valor": "500.00", "status": true, "conta_id": 1756338, "usuario_id": 39049, "transferencia_id": null, "parcelamento_id": null}
        });
        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: 'fixture:movimentacaoSalva'
        });

        cy.get('[data-test=menu-movimentacao]').click();
        cy.get('[data-test=descricao]').type('Comida japonesa');
        cy.get('[data-test=valor]').type('250');
        cy.get('[data-test=envolvido]').type('Inter');
        cy.get('[data-test=conta]').select('Conta falsa 1');
        cy.get('[data-test=status]').click();

        cy.get('.btn-primary').click();

        cy.get('.toast-message').should('contain', 'sucesso');

        cy.get('.list-group li').should('have.length', 7);
        cy.get('.list-group li')
            .last()
            .should('contain', 'Comida japonesa');
    });

    it('Should get balance', () => {
        cy.route({
            method: 'GET',
            url: '/transacoes/**',
            response:  {
                "conta": "Conta para saldo",
                "id": 1645452,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2023-06-01T03:00:00.000Z",
                "data_pagamento": "2023-06-01T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 1757165,
                "usuario_id": 39049,
                "transferencia_id": null,
                "parcelamento_id": null
              },
        });
        
        cy.route({
            method: 'PUT',
            url: '/transacoes/**',
            response:  {
                "conta": "Conta para saldo",
                "id": 1645452,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2023-06-01T03:00:00.000Z",
                "data_pagamento": "2023-06-01T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 1757165,
                "usuario_id": 39049,
                "transferencia_id": null,
                "parcelamento_id": null
              },
        })
        cy.get('[data-test=menu-home]').click();
        cy.contains('Conta falsa 1')
            .siblings()
            .should('contain', '100,00');

        cy.get('[data-test=menu-extrato]').click();
        cy.get('.receitaPendente')
            .find('.fa-edit')
            .click();

        cy.get('[data-test=descricao]').should('have.value', 'Movimentacao 1, calculo saldo');
        cy.get('[data-test=status]').click();
        cy.get('.btn-primary').click();

        cy.route({
            method: 'GET',
            url: '/saldo',
            response: [
                {
                    conta_id: 1000,
                    conta: 'Conta falsa 1',
                    saldo: '4034.00'
                },
                {
                    conta_id: 1000,
                    conta: 'Conta falsa 2',
                    saldo: '100000.00'
                }
            ]
        }).as('saldoFinal');

        cy.wait(1000);
        cy.get('[data-test=menu-home]').click();
        cy.contains('Conta falsa 1')
            .siblings()
            .should('contain', '4.034,00');
    });

    it('Should remove a transcation', () => {
        cy.route({
            method: 'DELETE',
            url: 'transacoes/**',
            response: {},
            status: 204,
        }).as('delete');
        
        cy.get('[data-test=menu-extrato]').click();
        cy.get('.list-group li .fa-trash-alt')
            .first()
            .click();
        cy.get('.toast-message').should('contain', 'Movimentação removida com sucesso');
    });

    it('Should validade data send to create an account', () => {
        const reqStub = cy.stub();
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { id: 3, nome: 'Conta falsa 1', visivel: true, usuario_id: 1 },
            // onRequest: req => {
            //     expect(req.body.nome).to.empty
            //     expect(req.request.headers).to.have.property('Authorization')
            // },
            onRequest: reqStub
        }).as('saveConta');

        cy.accessMenuAccount();
        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                 { id: 1, nome: 'Conta falsa 1', visivel: true, usuario_id: 1 },
                 { id: 2, nome: 'Conta falsa 2', visivel: true, usuario_id: 1 },
                 { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            ]
        }).as('contaSave');
       
        cy.incertMenuAccount('{CONTROL}');
        // cy.wait('@saveConta').its('request.body.nome').should('not.be.empty');
        cy.wait('@saveConta').then(() => {
           expect(reqStub.args[0][0].request.body.nome).to.empty
           expect(reqStub.args[0][0].request.headers).to.have.property('Authorization')
        });
        
        cy.get('.toast-message').should('contain', 'Conta inserida com sucesso')
    });

    it('Should test colors', () => {
        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                {"conta":"Conta para movimentacoes","id":1645450,"descricao":"Receita paga","envolvido":"AAA","observacao":null,"tipo":"REC","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":1757163,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta com movimentacao","id":1645451,"descricao":"Receita pendente","envolvido":"BBB","observacao":null,"tipo":"REC","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"-1500.00","status":false,"conta_id":1757164,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":1645452,"descricao":"Despesa paga","envolvido":"CCC","observacao":null,"tipo":"DESP","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"3500.00","status":true,"conta_id":1757165,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":1645453,"descricao":"Despesa pendente","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"-1000.00","status":false,"conta_id":1757165,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null},
            ]
        });

        cy.get('[data-test=menu-extrato]').click();
        cy.get('.list-group li')
            .first()
            .should('contain', 'Receita paga')
            .and('have.class', 'receitaPaga');

         cy.get('.list-group li')
            .eq(1)
            .should('contain', 'Receita pendente')
            .and('have.class', 'receitaPendente');

         cy.get('.list-group li')
            .eq(2)
            .should('contain', 'Despesa paga')
            .and('have.class', 'despesaPaga');

         cy.get('.list-group li')
            .last()
            .should('contain', 'Despesa pendente')
            .and('have.class', 'despesaPendente');
    });
});

