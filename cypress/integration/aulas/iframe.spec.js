/// <reference types="cypress" />

describe('Work with iframes', () => {
    it('Deve prencher campo de texto', () => {
        cy.visit('https://wcaquino.me/cypress/componentes.html');
        cy.get('#frame1').then(iframe => {
            const body = iframe.contents().find('body');
            cy.wrap(body).find('#tfield')
                .type('Teste')
                .should('have.value', 'Teste');
        });
    });
    
    it('Deve testar frame diretamente', () => {
        cy.visit('https://wcaquino.me/cypress/frame.html');
     
        cy.get('#otherButton').click();
        cy.on('window:alert', msg => {
            expect(msg).to.equal('Click OK!');
        });
    });
});