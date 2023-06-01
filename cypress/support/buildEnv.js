const buildEnv = () => {
    cy.server();
    cy.route({
        method: 'POST',
        url: '/signin',
        response: {
            id: 1000,
            nome: 'Usuario falso',
            token: 'Uma string muito grande que nao deveria ser mas é'
        }
    }).as('signin');

    cy.route({
        method: 'GET',
        url: '/saldo',
        response: [
            {
                conta_id: 1000,
                conta: 'Conta falsa 1',
                saldo: '100.00'
            },
            {
                conta_id: 1000,
                conta: 'Conta falsa 2',
                saldo: '100000.00'
            }
        ]
    }).as('saldo');

    cy.route({
        method: 'GET',
        url: '/contas',
        response: [
            { id: 1, nome: 'Conta falsa 1', visivel: true, usuario_id: 1 },
             {id: 2, nome: 'Conta falsa 2', visivel: true, usuario_id: 1 },
        ]
    }).as('contas');

    cy.route({
        method: 'GET',
        url: '/extrato/**',
        response: [
            {"conta":"Conta para movimentacoes","id":1645450,"descricao":"Movimentacao para exclusao","envolvido":"AAA","observacao":null,"tipo":"DESP","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":1757163,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null},
            {"conta":"Conta com movimentacao","id":1645451,"descricao":"Movimentacao de conta","envolvido":"BBB","observacao":null,"tipo":"DESP","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":1757164,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null},
            {"conta":"Conta para saldo","id":1645452,"descricao":"Movimentacao 1, calculo saldo","envolvido":"CCC","observacao":null,"tipo":"REC","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"3500.00","status":false,"conta_id":1757165,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null},
            {"conta":"Conta para saldo","id":1645453,"descricao":"Movimentacao 2, calculo saldo","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"-1000.00","status":true,"conta_id":1757165,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null},
            {"conta":"Conta para saldo","id":1645454,"descricao":"Movimentacao 3, calculo saldo","envolvido":"EEE","observacao":null,"tipo":"REC","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"1534.00","status":true,"conta_id":1757165,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null},
            {"conta":"Conta para extrato","id":1645455,"descricao":"Movimentacao para extrato","envolvido":"FFF","observacao":null,"tipo":"DESP","data_transacao":"2023-06-01T03:00:00.000Z","data_pagamento":"2023-06-01T03:00:00.000Z","valor":"-220.00","status":true,"conta_id":1757166,"usuario_id":39049,"transferencia_id":null,"parcelamento_id":null}
        ]
    });
}

export default buildEnv;