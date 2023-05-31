Cypress.Commands.add('getToken', (user, passwd) => {
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: user, 
            redirecionar: false,
            senha: passwd,
        }
    }).its('body.token').should('not.be.empty')
        .then(token => {
            return token;
        });
});

Cypress.Commands.add('resetApiRest', token => {
    cy.request({
        method: 'GET',
        url: '/reset',
        headers: { Authorization: `JWT ${token}` }
    }).its('status').should('be.equal', 200);
});

Cypress.Commands.add('getCountByName', (name, token) => {
    cy.request({
        method: 'GET',
        url: '/contas',
        headers: { Authorization: `JWT ${token}`},
        QS: { nome: name }
    }).then(response => {
        return response.body[0].id;
    });
});