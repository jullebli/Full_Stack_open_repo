import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  let createBlog

  beforeEach(() => {
    createBlog = jest.fn()
    render(<BlogForm createBlog={createBlog} />)
  })

  test('correct parameters are given to createBlog when adding a new blog', async () => {

    const user = userEvent.setup()
    const createButton = screen.getByText('create')

    const title = screen.getByTestId('Title')
    const author = screen.getByTestId('Author')
    const url = screen.getByTestId('Url')

    await user.type(title, 'Cakes cakes cakes')
    await user.type(author, 'Toffee cat')
    await user.type(url, 'www.toffeecat.net')
    await user.click(createButton)

    expect(createBlog.mock.calls[0][0]).toEqual({
      'newAuthor': 'Toffee cat',
      'newTitle': 'Cakes cakes cakes',
      'newUrl': 'www.toffeecat.net'
    })
  })
})