/// <reference types="cypress" />

import '../../support/contasCommands';
describe('Should test at a functional level', () => {
    before(() => {
        cy.login();
        cy.resetApp();
    });

    it('Should create an account', () => {
        cy.accessMenuAccount();

        cy.get('[data-test=nome]').type('Conta criada');
        cy.get('.btn').click();
        cy.get('.toast-message').should('contain', 'Conta inserida com sucesso')
    });

    it('Should update an account', () => {
        cy.accessMenuAccount();
        
        cy.get('tbody tr .fa-edit')
            .last()
            .click();

        cy.incertMenuAccount('Conta editada');

        cy.get('.toast-message').should('contain', 'Conta atualizada com sucesso')
    });

    it('Should not crate an account with some name', () => {
        cy.accessMenuAccount();
        cy.incertMenuAccount('Conta editada');
        cy.get('.toast-message').should('contain', 'code 400');
    });

    it('Should create a transction', () => {
        cy.get('[data-test=menu-movimentacao]').click();
        cy.get('[data-test=descricao]').type('Comida japonesa');
        cy.get('[data-test=valor]').type('250');
        cy.get('[data-test=envolvido]').type('Inter');
        cy.get('[data-test=conta]').select('Conta editada')
        cy.get('[data-test=status]').click();

        cy.get('.btn-primary').click();

        cy.get('.toast-message').should('contain', 'sucesso');
        cy.get('.list-group li').should('have.length', 7);
        cy.get('.list-group li')
            .last()
            .should('contain', 'Comida japonesa');
    });

    it('Should get balance', () => {
        cy.get('[data-test=menu-home]').click();
        cy.get('tbody tr td').should('contain', 'Conta editada')
    });

    it('Should remove a transcation', () => {
        cy.get('[data-test=menu-extrato]').click();
        cy.get('.list-group li .fa-trash-alt')
            .last()
            .click();
        cy.get('.toast-message').should('contain', 'Movimentação removida com sucesso');
    });
});

