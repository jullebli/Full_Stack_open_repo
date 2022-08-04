import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
  let testUser
  let testBlog
  let updateBlog
  let deleteBlog
  let container

  beforeEach(() => {
    testUser = {
      username: 'tester2022',
      name: 'Test user',
      passwordHash: 'Not2A4Real7Hash9'
    }

    testBlog = {
      title: 'All about coding',
      author: 'Happy coders',
      url: 'www.happycoders.fi',
      likes: 5,
      user: testUser
    }

    updateBlog = jest.fn()
    deleteBlog = jest.fn()

    container = render(<Blog blog={testBlog} updateBlog={updateBlog}
      deleteBlog={deleteBlog} loggedInUser={testUser} />)
  })

  test('displays only title and author at start', () => {

    //render(<Blog blog={testBlog} updateBlog={updateBlog}
    //  deleteBlog={deleteBlog} loggedInUser={testUser} />)

    const titleText = screen.getByText(testBlog.title, { exact: false })
    const authorText = screen.getByText(testBlog.author, { exact: false })
    const moreInfoDiv = screen.getByTestId('showMoreBlogInfo')
    //moreInfoDiv contains likeLine, url, user.name and delete button
    const urlText = screen.getByText(testBlog.url, { exact: false })
    const likesLine = screen.getByTestId('likesLine')
    //likesLine is a div containing likes: 5 and like button

    expect(titleText).toBeDefined()
    expect(authorText).toBeDefined()
    expect(moreInfoDiv).toHaveStyle('display: none')
    expect(urlText).toBeDefined()
    expect(likesLine).toBeDefined()

  })

  //Tee testi, joka varmistaa että myös url ja likejen määrä 
  //näytetään kun blogin kaikki tiedot näyttävää nappia on painettu.
  test('displays also url and likes after clicking view button', async () => {

    
    const moreInfoDiv = screen.getByTestId('showMoreBlogInfo')
    //moreInfoDiv contains likeLine, url, user.name and delete button
    expect(moreInfoDiv).toHaveStyle('display: none')

    const user = userEvent.setup()
    const viewButton = screen.getByTestId('viewButton')
    await user.click(viewButton)

    const titleText = screen.getByText(testBlog.title, { exact: false })
    const authorText = screen.getByText(testBlog.author, { exact: false })
    
    const urlText = screen.getByText(testBlog.url, { exact: false })
    const likesLine = screen.getByTestId('likesLine')
    //likesLine is a div containing likes: 5 and like button

    expect(titleText).toBeDefined()
    expect(authorText).toBeDefined()
    expect(moreInfoDiv).not.toHaveStyle('display: none')
    expect(urlText).toBeDefined()
    expect(likesLine).toBeDefined()

  })
})