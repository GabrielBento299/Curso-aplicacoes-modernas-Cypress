/// <reference types="cypress" />

describe('Work with alerts', () => {
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html');
    });

    beforeEach(() => {
        cy.reload();
    });

    it('Alert', () => {
        cy.get('#alert').click();
        cy.on('window:alert', msg => {
            expect(msg).to.equal('Alert Simples');
        });
    });
    it('Alert com mock', () => {
        const stub = cy.stub().as('alerta');
        cy.on('window:alert', stub);
        cy.get('#alert').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Alert Simples');
        });
    });

    it('Confirm', () => {
        cy.on('window:confirm', msg => {
            expect(msg).to.equal('Confirm Simples');
        });
        cy.on('window:alert', msg => {
            expect(msg).to.equal('Confirmado');
        });

        cy.get('#confirm').click();
    });
    it('Deny', () => {
        cy.on('window:confirm', msg => {
            expect(msg).to.equal('Confirm Simples');
            return false;
        });
        cy.on('window:alert', msg => {
            expect(msg).to.equal('Negado');
        });

        cy.get('#confirm').click();
    });

    it('Prompt', () => {
        const numb = 77;
        cy.window().then(win => {
            cy.stub(win, 'prompt').returns(numb);
        });

        cy.on('window:prompt', msg => {
            expect(msg).to.equal(`Era ${numb}`);
        });
        cy.on('window:alert', msg => {
            expect(msg).to.equal(':D');
        });

        cy.get('#prompt').click();
    }); 

    it('Validando mensagens', () => {
        const stub = cy.stub().as('alerta');
        cy.on('window:alert', stub);
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio');
        });

        cy.get('#formNome').type('Gabriel')
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio');
        });

        cy.get('[data-cy=dataSobrenome]').type('Bento')
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio');
        });

        cy.get('#formSexoMasc').click();
        cy.get('#formCadastrar').click();

        cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado');
     });
});