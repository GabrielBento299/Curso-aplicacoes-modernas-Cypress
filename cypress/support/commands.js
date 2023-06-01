Cypress.Commands.add('clickAlert', (locator, message) => {
    cy.get(locator).click();
    cy.on('window:alert', msg => {
        expect(msg).to.equal(message);
    });
});

Cypress.Commands.add('login', (email, password, name) => {
    cy.visit('https://barrigareact.wcaquino.me/');

        cy.get('[data-test=email]').type(email);
        cy.get('[data-test=passwd]').type(password, { log: false });

        cy.get('button[type="submit"].btn').click();
        cy.get('.toast-message').should('contain',`Bem vindo, ${name}!`);
});

Cypress.Commands.add('resetApp', () => {
    cy.get('[data-test=menu-settings]').click();
    cy.get('[href="/reset"]').click();
});

