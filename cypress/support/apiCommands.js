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
            Cypress.env('token', token);
            return token;
        });
});

Cypress.Commands.add('resetApiRest', () => {
    cy.getToken('gabriel123teste.com', 'teste123').then(token => {
        cy.request({
            method: 'GET',
            url: '/reset',
            headers: { Authorization: `JWT ${token}` }
        }).its('status').should('be.equal', 200);
    });
});

Cypress.Commands.add('getCountByName', (name) => {
    cy.getToken('gabriel123teste.com', 'teste123').then(token => {
        cy.request({
            method: 'GET',
            url: '/contas',
            headers: { Authorization: `JWT ${token}`},
            QS: { nome: name }
        }).then(response => {
            return response.body[0].id;
        });
    });
});

Cypress.Commands.overwrite('request', (originalFunction, ...options) => {
    if(options.length === 1) {
        if(Cypress.env('token')) {
            console.log(options)
            options[0].headers = {
                Authorization: `JWT ${Cypress.env('token')}`
            }
        }
    }
    return originalFunction(...options);
});