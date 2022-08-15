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
        password: 'citron',
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

      cy.get('#notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      const testUser = {
        name: 'Test user',
        username: 'testuser',
        password: 'citron',
      }
      cy.request('POST', 'http://localhost:3003/api/users', testUser)
      cy.visit('http://localhost:3000')

      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testuser',
        password: 'citron',
      }).then((response) => {
        localStorage.setItem(
          'loggedBloglistUser',
          JSON.stringify(response.body)
        )
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function () {
      cy.contains('blogs')
      cy.contains('create new blog').click()
      cy.get('#title').type('First added blog')
      cy.get('#author').type('Adam')
      cy.get('#url').type('www.paradise.net')
      cy.get('#create').click()

      cy.get('#blogListing')
        .should('contain', 'First added blog')
        .and('contain', 'Adam')
    })

    it('And three blogs added, blogs will be sorted by likes', function () {
      cy.createBlog({
        title: 'This will have least likes',
        author: 'Unlikeable',
        url: 'www.unlikeable.com',
      })

      cy.createBlog({
        title: 'Second most liked blog',
        author: 'Traveler',
        url: 'www.second.com',
      })

      cy.createBlog({
        title: 'Most liked blog',
        author: 'Beloved',
        url: 'www.liked.com',
      })

      cy.get('.blog')
        .eq(0)
        .should('contain', 'This will have least likes')
        .contains('button', 'view')
        .click()

      cy.get('.blog')
        .eq(1)
        .should('contain', 'Second most liked blog')
        .contains('button', 'view')
        .click()

      cy.get('.blog')
        .eq(2)
        .should('contain', 'Most liked blog')
        .contains('button', 'view')
        .click()

      //clicking likes for blogs to be sorted differently
      cy.get('.blog').eq(2).contains('button', 'like').click()

      cy.wait(500)

      cy.get('.blog').eq(0).contains('button', 'like').click()

      cy.wait(500)

      cy.get('.blog').eq(2).contains('button', 'like').click()

      cy.wait(500)

      //checking that the order has changed accordingly
      cy.get('.blog')
        .eq(0)
        .should('contain', 'Most liked blog')
        .contains('likes 2')

      cy.get('.blog')
        .eq(1)
        .should('contain', 'Second most liked blog')
        .contains('likes 1')

      cy.get('.blog')
        .eq(2)
        .should('contain', 'This will have least likes')
        .contains('likes 0')
    })

    describe('And one blog added', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Initially added blog',
          author: 'Cypress tester',
          url: 'www.testingwithcypresscanbehard.com',
        })
      })

      it('A blog can be liked (two times)', function () {
        cy.contains('Initially added blog').and('contain', 'Cypress tester')
        cy.get('#viewButton').click()
        cy.contains('Initially added blog')
          .and('contain', 'Cypress tester')
          .and('contain', 'likes 0')
        cy.contains('Initially added blog').get('#likeButton').click()
        //click hide and view so that cypress manages to push same button twice
        cy.contains('Initially added blog').get('#hide').click()
        cy.contains('Initially added blog').get('#viewButton').click()
        cy.contains('Initially added blog').get('#likeButton').click()

        cy.contains('Initially added blog')
          .get('#likesLine')
          .contains('likes 2')
      })

      it('own added blog can be deleted', function () {
        cy.contains('create new blog').click()
        cy.get('#title').type('Only to be removed blog')
        cy.get('#author').type('Removable')
        cy.get('#url').type('www.remove.com')
        cy.get('#create').click()

        cy.get('#blogListing')
          .should('contain', 'Only to be removed blog')
          .and('contain', 'Removable')

        cy.get('.blog')
          .eq(1)
          .should('contain', 'Only to be removed blog Removable')
          .contains('button', 'view')
          .click()

        cy.get('.blog').eq(1).contains('button', 'remove').click()

        cy.get('#notification').should(
          'contain',
          'you deleted blog Only to be removed blog by Removable'
        )
        cy.get('#blogListing')
          .should('not.contain', 'Only to be removed')
          .and('not.contain', 'Removable')
      })

      it('remove button is not visible for user who did not add the blog', function () {
        cy.get('#logOut').click()

        const newUserWithoutBlogs = {
          name: 'Blogless user',
          username: 'blogless',
          password: 'cherry',
        }
        cy.request(
          'POST',
          'http://localhost:3003/api/users',
          newUserWithoutBlogs
        )

        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'blogless',
          password: 'cherry',
        }).then((response) => {
          localStorage.setItem(
            'loggedBloglistUser',
            JSON.stringify(response.body)
          )
          cy.visit('http://localhost:3000')
        })

        cy.get('.blog')
          .contains('Initially added blog')
          .contains('button', 'view')
          .click()

        cy.get('.blog')
          .should('contain', 'Test user')
          .and('not.contain', 'remove')

        cy.get('#blogListing').should('not.contain', 'remove')
      })
    })
  })
})
