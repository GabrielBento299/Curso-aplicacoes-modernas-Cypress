const locators = {
    login: {
        user: '[data-test=email]',
        password: '[data-test=passwd]',
        btn_login: 'button[type="submit"].btn'
    },
    menu: {
        settings: '[data-test=menu-settings]',
        contas: '[href="/contas"]',
    },
    contas: {
        nome: '[data-test=nome]',
        btn_salvar: '.btn',
        btn_editar: 'tbody tr .fa-edit'
    },
    message: '.toast-message'
}

export default locators;