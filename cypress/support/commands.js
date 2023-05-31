Cypress.Commands.add('clickAlert', (locator, message) => {
    cy.get(locator).click();
    cy.on('window:alert', msg => {
        expect(msg).to.equal(message);
    });
});

Cypress.Commands.add('login', () => {
    cy.visit('https://barrigareact.wcaquino.me');

    cy.fixture('login').then(user => {
        cy.get('[data-test=email]').type(user.email);
        cy.get('[data-test=passwd]').type(user.password, { log: false });

        cy.get('button[type="submit"].btn').click();
        cy.get('.toast-message').should('contain',`Bem vindo, ${user.name}!`);
    });
});

Cypress.Commands.add('resetApp', () => {
    cy.get('[data-test=menu-settings]').click();
    cy.get('[href="/reset"]').click();
});

