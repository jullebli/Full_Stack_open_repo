//Tee testi, joka varmistaa että blogin näyttävä komponentti renderöi
//blogin titlen, authorin mutta ei renderöi oletusarvoisesti 
//urlia eikä likejen määrää.

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component', () => {
  let testUser
  let testBlog
  let updateBlog
  let deleteBlog

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
  })

  test('displays only title and author at start', () => {

    render(<Blog blog={testBlog} updateBlog={updateBlog}
      deleteBlog={deleteBlog} loggedInUser={testUser} />)

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
})