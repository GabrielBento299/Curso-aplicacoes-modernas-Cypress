/// <reference types="cypress" />

describe('Fixtures tests', () => {
    it('Get data with ficture file', () => {
        cy.visit('https://wcaquino.me/cypress/componentes.html');

        cy.fixture('userData').as('usuario').then(user => {
            cy.get('#formNome').type(user.nome);
            cy.get('[data-cy=dataSobrenome]').type(user.sobrenome);
            cy.get(`[name=formSexo][value=${user.sexo}]`).click();
            cy.get(`[name=formComidaFavorita][value=${user.comida}]`).click();
            cy.get('[data-test=dataEscolaridade]').select(user.escolaridade);
            cy.get('[data-testid=dataEsportes]').select(user.esportes);
        });

        cy.get('#formCadastrar').click();
        cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado');
    });
});