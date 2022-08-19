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

      cy.contains('Test user LOGGED IN')
      cy.get('#logOut').contains('logout')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('wrongUsername')
      cy.get('#password').type('wrongPassword')
      cy.get('#loggingIn').click()

      cy.get('#notification').contains('wrong username or password')
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
      cy.wait(300)
      cy.get('#createNewBlog').click()
      cy.get('#title').type('First added blog')
      cy.get('#author').type('Adam')
      cy.get('#url').type('www.paradise.net')
      cy.get('#create').click()

      cy.get('#notification').should(
        'contain',
        'a new blog First added blog by Adam'
      )
      cy.get('.blogLink').should('contain', 'First added blog').click()
      cy.get('#blogPageTitle').should('contain', 'First added blog')
      cy.get('#blogPageUrl').should('contain', 'www.paradise.net')
      cy.get('#blogPageLikesLine').should('contain', '0 likes')
      cy.get('#blogInformation').should('contain', 'added by Test user')
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

      cy.get('.blog').eq(0).should('contain', 'This will have least likes')

      cy.get('.blog').eq(1).should('contain', 'Second most liked blog')

      cy.get('.blog').eq(2).should('contain', 'Most liked blog')

      //clicking likes for blogs to be sorted differently

      cy.get('.blogLink').eq(2).should('contain', 'Most liked blog').click()

      cy.get('#blogPageTitle').should('contain', 'Most liked blog')
      cy.get('#likeButton').click()
      cy.wait(100)
      cy.get('#likeButton').click()
      cy.wait(100)
      cy.get('#blogPageLikesLine').contains('2 likes')
      cy.visit('http://localhost:3000')

      cy.get('.blogLink')
        .eq(2)
        .should('contain', 'Second most liked blog')
        .wait(100)
        .click()

      cy.get('#blogPageTitle').should('contain', 'Second most liked blog')
      cy.get('#likeButton').click()
      cy.wait(100)
      cy.get('#blogPageLikesLine').contains('1 likes')
      cy.visit('http://localhost:3000')

      cy.get('.blogLink')
        .eq(2)
        .should('contain', 'This will have least likes')
        .click()

      cy.get('#blogPageTitle').should('contain', 'This will have least likes')
      cy.get('#blogPageLikesLine').contains('0 likes')
      cy.visit('http://localhost:3000')

      //checking that the order has changed accordingly
      cy.get('.blog').eq(2).should('contain', 'This will have least likes')

      cy.get('.blog').eq(1).should('contain', 'Second most liked blog')

      cy.get('.blog').eq(0).should('contain', 'Most liked blog')
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
        cy.contains('Initially added blog')
        cy.contains('Cypress tester')
        cy.contains('Initially added blog').wait(100).click()

        cy.contains('Initially added blog')
        cy.get('#blogPageAuthor').should('contain', 'Cypress tester')
        cy.get('#blogPageLikesLine').should('contain', '0 likes')

        cy.get('#likeButton').click()
        cy.wait(100)
        cy.contains('you liked blog Initially added blog by Cypress tester')
        cy.get('#likeButton').click()
        cy.wait(100)
        cy.contains('you liked blog Initially added blog by Cypress tester')

        cy.get('#blogPageLikesLine').contains('2 likes')
      })

      it('own added blog can be deleted', function () {
        cy.wait(200)
        cy.get('#createNewBlog').click()
        cy.get('#title').type('Only to be removed blog')
        cy.get('#author').type('Removable')
        cy.get('#url').type('www.remove.com')
        cy.get('#create').click()

        cy.get('.blog')
          .should('contain', 'Only to be removed blog')
          .and('contain', 'Removable')

        cy.get('.blogLink').eq(1).contains('Only to be removed blog').click()

        cy.contains('button', 'remove').click()

        cy.get('#notification').should(
          'contain',
          'you deleted blog Only to be removed blog by Removable'
        )

        cy.visit('http://localhost:3000')
        cy.get('.blog')
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

        cy.get('#blogLink').contains('Initially added blog').click()

        cy.get('#blogInformation').should(
          'not.contain',
          'added by Blogless user'
        )
        cy.should('not.contain', 'remove')
      })
    })
  })
})
