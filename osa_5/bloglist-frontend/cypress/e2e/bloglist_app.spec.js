// material said that use function instead og () => to avoid problems
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
  describe('When logged in', function () {

    beforeEach(function () {
      const testUser = {
        name: 'Test user',
        username: 'testuser',
        password: 'citron'
      }
      cy.request('POST', 'http://localhost:3003/api/users', testUser)
      cy.visit('http://localhost:3000')

      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testuser', password: 'citron'
      }).then(response => {
        localStorage.setItem('loggedBloglistUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function () {
      cy.contains('blogs')
      cy.contains('create new blog').click()
      cy.get('#title').type('First added blog')
      cy.get('#author').type('Adam')
      cy.get('#url').type('www.paradise.nert')
      cy.get('#create').click()

      cy.get('#blogListing').should('contain', 'First added blog')
        .and('contain', 'Adam')

    })
    describe('And one blog added', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Initially added blog',
          author: 'Cypress tester',
          url: 'www.testingwithcypresscanbehard.com'
        })
      })

      it('A blog can be liked (two times)', function () {
        cy.contains('Initially added blog')
          .and('contain', 'Cypress tester')
        cy.get('#view').click()
        cy.contains('Initially added blog')
          .and('contain', 'Cypress tester')
          .and('contain', 'likes 0')
        cy.contains('Initially added blog').get('#likeButton').click()
        //click hide and view so that cypress manages to push same button twice
        cy.contains('Initially added blog').get('#hide').click()
        cy.contains('Initially added blog').get('#view').click()
        cy.contains('Initially added blog').get('#likeButton').click()

        cy.contains('Initially added blog').get('#likesLine').contains('likes 2')

      })
    })
  })
})