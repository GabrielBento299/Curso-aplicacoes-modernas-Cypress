/// <reference types="cypress" />

describe('Work with basic elements', () => {
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html');
    });

    beforeEach(() => {
        cy.reload();
    });
    it('Text', () => {
        cy.get('body').should('contain', 'Cuidado onde clica, muitas armadilhas...');
        cy.get('span.facilAchar').should('have.text', 'Cuidado onde clica, muitas armadilhas...');
    });

    it('Links', () => {
        cy.get('#resultado').should('have.text', 'Status: Nao cadastrado');
        cy.get('a[href="#"]').click();
        cy.get('#resultado').should('have.text', 'Voltou!');

        cy.reload();
        cy.get('#resultado').should('have.text', 'Status: Nao cadastrado');
        cy.get('#resultado').should('not.have.text', 'Voltou!');
        cy.contains('Voltar').click();
        cy.get('#resultado').should('have.text', 'Voltou!');
    });

    it('TextFileds', () => {
        cy.get('input[name="formNome"]').type('Gabriel');
        cy.get('input[name="formNome"]').should('have.value', 'Gabriel');

        cy.get('[data-cy="dataSobrenome"]')
            .type('Bento')
            .and('have.value', 'Bento');

        cy.get('#elementosForm\\:sugestoes')
            .type('Teste Texto')
            .should('have.value', 'Teste Texto');

        cy.get(':nth-child(3) > :nth-child(6) > input')
            .type('Teste12345{backspace}{backspace}')
            .should('have.value', 'Teste123');

        cy.get('#elementosForm\\:sugestoes')
            .clear()
            .type('Erro{selectAll}Acerto', {delay: 100})
            .should('have.value', 'Acerto');
    });

    it('RadioButton', () => {
        cy.get('#formSexoFem')
            .click()
            .should('be.checked');

        cy.get('#formSexoMasc').should('not.be.checked');

        cy.get("[name='formSexo']").should('have.length', 2)
    });
    
    it('Checkbox', () => {
        cy.get('#formComidaPizza')
            .click()
            .should('be.checked');

        cy.get('[name="formComidaFavorita"]').click({multiple: true});

        cy.get('#formComidaPizza').should('not.be.checked');
        cy.get('#formComidaFrango').should('be.checked');
    });

    it('Combo', () => {
        cy.get('[data-test=dataEscolaridade]')
            .select('Doutorado')
            .should('have.value', 'doutorado');

        cy.get('[data-test=dataEscolaridade] option')
            .should('have.length', 8);

        cy.get('[data-test=dataEscolaridade] option').then($arr => {
            const values = [];
            $arr.each(function() {
                values.push(this.innerHTML);
            });
            expect(values).to.include.members(["Superior", "Mestrado"]);
        });
    });

    it.only('Combo multiplo', () => {
        cy.get('[data-testid=dataEsportes]')
            .select(['natacao', 'Corrida', 'nada']);

        // cy.get('[data-testid=dataEsportes]').should('have.value', ['natacao', 'Corrida', 'nada']);
        cy.get('[data-testid=dataEsportes]').then($el => {
            expect($el.val()).to.be.deep.equal(['natacao', 'Corrida', 'nada']);
            expect($el.val()).to.have.length(3);
        });

        cy.get('[data-testid=dataEsportes]')
            .invoke('val')
            .should('eql', ['natacao', 'Corrida', 'nada']);
    });
});