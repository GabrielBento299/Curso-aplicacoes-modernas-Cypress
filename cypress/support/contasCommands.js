Cypress.Commands.add('accessMenuAccount', () => {
    cy.get('[data-test=menu-settings]').click();
    cy.get('[href="/contas"]').click();
});

Cypress.Commands.add('incertMenuAccount', count => {
    cy.get('[data-test=nome]')
        .clear()
        .type(count);
    cy.get('.btn').click();
});