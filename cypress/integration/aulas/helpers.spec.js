/// <reference types="cypress" />

describe('Helpers...', () => {
    it('Wrap', () => {
        const obj = { nome: 'Gabriel', idade: 22 };

        expect(obj).to.have.property('nome');
        cy.wrap(obj).should('have.property', 'nome');

        cy.visit('https://wcaquino.me/cypress/componentes.html');

        const promisse = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(12)
            }, 700);
        });

        cy.get('#buttonSimple').then(() => console.log('Encontrei o primeiro botão'));
        cy.wrap(promisse).then(result => console.log(result));
        cy.get('#buttonList').then(() => console.log('Encontrei o segundo botão'));

        cy.get('#formNome').then($el => {
            // $el.val('Funciona via cypress');
            cy.wrap($el).type('Funciona via cypress');
        });
    });

    it('Its..', () => {
        const obj = { nome: 'Gabriel', idade: 22 };
        cy.wrap(obj).should('have.property', 'nome', 'Gabriel');
        cy.wrap(obj).its('nome').should('be.equal', 'Gabriel');

        const obj2 = { nome: 'Gabriel', idade: 22, endereco: { rua: 'Teste' } };
        cy.wrap(obj2).its('endereco').should('have.property', 'rua');
        cy.wrap(obj2).its('endereco').its('rua').should('contain', 'Teste');
        cy.wrap(obj2).its('endereco.rua').should('contain', 'Teste');

        cy.visit('https://wcaquino.me/cypress/componentes.html');
        cy.title().its('length').should('be.equal', 20);
    });

    it.only('Invoke...', () => {
        const getValue = () => 1;
        const soma =( a, b )=> a + b;

        cy.wrap({fn: getValue}).invoke('fn').should('be.equal', 1);
        cy.wrap({fn: soma}).invoke('fn', 5, 5).should('be.equal', 10);

        cy.visit('https://wcaquino.me/cypress/componentes.html');
        cy.get('#formNome').invoke('val', 'Texto via invoke');
        cy.window().invoke('alert', 'Da pra ver?')
        cy.get('#resultado')
            .invoke('html', '<input type="button" value="Teste" />')
    });

});