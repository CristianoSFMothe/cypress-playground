describe('Cypress Playground', () => {

  beforeEach(() => {
    cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
  });

  it('shows a promotional banner', () => {
    cy.get('#promotional-banner').should('be.visible')
  })

  it('clicks the Subscribe button and show a success message', () => {
    cy.contains('button', 'Subscribe').should('be.visible').click()

    cy.contains('#success', "You've been successfully subscribed to our newsletter.")
      .should('be.visible')
  });

  it('types in an input which "signs" a form, the asserts it is signed', () => {
    cy.get('#signature-textarea').should('be.visible').type('Cristiano')

    cy.contains('#signature', 'Cristiano').should('be.visible')
  });

  it('types in the signature field, checks the checkbox to see preview, then unchecks it', () => {
    cy.get('#signature-textarea-with-checkbox').type('Cristiano')
    cy.get('#signature-checkbox').check()

    cy.contains('#signature-triggered-by-check', 'Cristiano').should('be.visible')

    cy.get('#signature-checkbox').uncheck()
    cy.contains('#signature-triggered-by-check', 'Cristiano').should('not.exist')
  });

  it('check both possible radios and asserts if it is "on" or "off"', () => {
    cy.contains('#on-off', 'ON').should('be.visible')

    cy.get('input[type="radio"][value="off"]').check()
    cy.contains('#on-off', 'OFF').should('be.visible')
    cy.contains('#on-off', 'ON').should('not.exist')

    cy.get('input[type="radio"][value="on"]').check()
    cy.contains('#on-off', 'ON').should('be.visible')
    cy.contains('#on-off', 'OFF').should('not.exist')
  });

  it('selects a type via the dropdown field and asserts on the selection', () => {
    cy.contains('p', "You haven't selected a type yet.").should('be.visible')

    cy.get('#selection-type').select('VIP')

    cy.contains('p', "You've selected: VIP").should('be.visible')
  });

  it('selects multiple fruits via the dropdown field and asserts on the selection', () => {
    cy.contains('p', "You haven't selected any fruit yet.").should('be.visible')

    cy.get('#fruit').select(['apple', 'banana', 'cherry'])

    cy.contains('p', "You've selected the following fruits: apple, banana, cherry")
      .should('be.visible')
  });

  it('uploads a file and asserts the correct file name appears as paragraph', () => {
    cy.get('input[type="file"]').selectFile('./cypress/fixtures/example.json')

    cy.contains('p', 'The following file has been selected for upload: example.json')
      .should('be.visible')

  });

  it('click a button and triggers a reques', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .as('getTodo')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@getTodo')
      .its('response.statusCode')
      .should('be.equal', 200)

    cy.contains('li', 'TODO ID: 1').should('be.visible')
    cy.contains('li', 'Title: delectus aut autem').should('be.visible')
    cy.contains('li', 'Completed: false').should('be.visible')
    cy.contains('li', 'User ID: 1').should('be.visible')
  });

  it('clicks a button and trigger a stubbier request', () => {
    const todo = require('../fixtures/todo')

    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { fixture: 'todo' }
    ).as('getTodo')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@getTodo')
      .its('response.statusCode')
      .should('be.equal', 200)

    cy.contains('li', `TODO ID: ${todo.id}`).should('be.visible')
    cy.contains('li', `Title: ${todo.title}`).should('be.visible')
    cy.contains('li', `Completed: ${todo.completed}`).should('be.visible')
    cy.contains('li', `User ID: ${todo.userId}`).should('be.visible')
  });

  it('clicks a button and simulates an API failure', () => {
    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { statusCode: 500 }
    ).as('serverFailure')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@serverFailure')
      .its('response.statusCode')
      .should('be.equal', 500)

    cy.contains(
      'span',
      'Oops, something went wrong. Refresh the page and try again'
    ).should('be.visible')
  });

  it('clicks a button and simulates a network failure', () => {
    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { forceNetworkError: 500 }
    ).as('networkError')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@networkError')

    cy.contains(
      'span',
      'Oops, something went wrong. Check your internet connection, refresh the page, and try again'
    ).should('be.visible')

  })

  it('makes an HTTP request and asserts on the returned status code', () => {
    cy.request({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
    })
      .its('status')
      .should('be.equal', 200)
  });

  Cypress._.times(10, index => {
    it(`selects ${index + 1} out of 10`, () => {
      cy.get('input[type="range"]')
        .invoke('val', index + 1)
        .trigger('change')
      cy.contains('p', `You're on level: ${index + 1}`)
        .should('be.visible')
    });


  })

  it('selects a date and asserts the correct date has bee displayed', () => {
    cy.get('#date').type('2025-04-21').blur()

    cy.contains('p', "The date you've selected is: 2025-04-21")
      .should('be.visible')
  });

  it('types a password based n a protected variable', () => {
    cy.log('PASSWORD:', Cypress.env('PASSWORD'))

    cy.get('#password').type(Cypress.env('PASSWORD'))
    cy.get('#show-password-checkbox').check()

    cy.get('#password-input input[type="password"]').should('not.exist')
    cy.get('#password-input input[type="text"]')
      .should('be.visible')
      .and('have.value', Cypress.env('PASSWORD'))

    cy.get('#show-password-checkbox').uncheck()
    cy.get('#password-input input[type="password"]').should('be.visible')
    cy.get('#password-input input[type="text"]')
      .should('not.exist')
  });

})