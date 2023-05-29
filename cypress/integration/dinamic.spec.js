/// <reference types="cypress" />

describe('Work with alerts', () => {
    beforeEach(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html');
    });

    const foods = ['carne', 'frango', 'pizza', 'vegetariano'];
    
    foods.forEach(food => {
        const capitalizedFood = food.charAt(0).toUpperCase() + food.slice(1);
        it(`Cadastro com comida variada com a comida "${food}"`, () => {
            cy.get('#formNome').type('Teste');
            cy.get('[data-cy=dataSobrenome]').type('Teste');
            cy.get(`[name=formSexo][value=F]`).click();

            cy.get(`[name=formComidaFavorita][value=${food}]`).click();
            cy.get('[data-test=dataEscolaridade]').select('doutorado');

            cy.get('[data-testid=dataEsportes]').select('Corrida');
    
            cy.get('#formCadastrar').click();
            cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado');
            cy.get('#descComida').should('contain', capitalizedFood);
        });
    });

    it('Deve aparecer mensagem de erro "Tem certeza que voce eh vegetariano?"', () => {
        cy.get('#formNome').type('Teste');
            cy.get('[data-cy=dataSobrenome]').type('Teste');
            cy.get(`[name=formSexo][value=F]`).click();

            cy.get(`[name=formComidaFavorita]`).click( {multiple: true} );

            cy.get('[data-test=dataEscolaridade]').select('doutorado');
            cy.get('[data-testid=dataEsportes]').select('Corrida');
    
            cy.get('#formCadastrar').click();
            cy.clickAlert('#formCadastrar', 'Tem certeza que voce eh vegetariano?');
            cy.get('#resultado').should('contain', 'Status: Nao cadastrado');
    });
    it('Deve selecionar todos usando o each', () => {
        cy.get('#formNome').type('Teste');
            cy.get('[data-cy=dataSobrenome]').type('Teste');
            cy.get(`[name=formSexo][value=F]`).click();

            cy.get(`[name=formComidaFavorita]`).each($el => {
                if($el.val() !== 'vegetariano')
                cy.wrap($el).click();
            });

            cy.get('[data-test=dataEscolaridade]').select('doutorado');
            cy.get('[data-testid=dataEsportes]').select('Corrida');
    
            cy.get('#formCadastrar').click();
            cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado');
            cy.get('#descComida').should('not.contain', 'Vegetariano');
    });
});