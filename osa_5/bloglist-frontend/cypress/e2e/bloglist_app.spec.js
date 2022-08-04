describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.get('#loggingIn').contains('login')
    cy.get('#cancel').contains('cancel')
  })

  describe('Login', function () {
    beforeEach(function () {
      const testUser = {
        name: 'Test user',
        username: 'testuser',
        password: 'citron'
      }
      cy.request('POST', 'http://localhost:3003/api/users', testUser)
      cy.visit('http://localhost:3000')
    })
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testuser')
      cy.get('#password').type('citron')
      cy.get('#loggingIn').click()

      cy.contains('Test user logged in')
      cy.get('#logOut').contains('logout')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('wrongUsername')
      cy.get('#password').type('wrongPassword')
      cy.get('#loggingIn').click()

      cy.get('.error').should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })
})