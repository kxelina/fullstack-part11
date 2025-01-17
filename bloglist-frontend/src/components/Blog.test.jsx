import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(blog.title)
  expect(element).toBeDefined()
})

test('clicking the view button shows blogs info', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://test.com',
    likes: 1,
    user: { name: 'Test', username: 'test' }
  }

  render(
    <Blog blog={blog}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element = screen.getByText(blog.title, blog.url, blog.likes)
  expect(element).toBeDefined()
})

test('clicking the like button 2 time returns right amount handler calls', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://test.com',
    likes: 1,
    user: { name: 'Test' }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler}/>
  )

  const user = userEvent.setup()
  const viewbutton = screen.getByText('view')
  await user.click(viewbutton)

  const likebutton = screen.getByText('like')
  await user.click(likebutton)
  await user.click(likebutton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('clicking the create new blog button creates new blog with right info', async () => {
  const newBlog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://test.com'
  }

  const createBlog = vi.fn()

  render(
    <BlogForm createBlog={createBlog}/>
  )

  const user = userEvent.setup()
  const titleinput = screen.getByPlaceholderText('write blog title here')
  const urlinput = screen.getByPlaceholderText('write blog url here')
  const submitButton = screen.getByText('create')

  await user.type(titleinput, newBlog.title)
  await user.type(urlinput, newBlog.url)
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe(newBlog.title)
  expect(createBlog.mock.calls[0][0].url).toBe(newBlog.url)
})

