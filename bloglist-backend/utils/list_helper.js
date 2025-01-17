const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    if (blogs.length === 0) {return 0}
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
    }

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {return 0}
    const mostlikes = Math.max(...blogs.map(blog => blog.likes))
    const favoriteBlog = blogs.find(blog => blog.likes === mostlikes)
    return {title: favoriteBlog.title, 
        author: favoriteBlog.author, 
        likes: favoriteBlog.likes}
    }

const mostBlogs = (blogs) =>  {
    if (blogs.length === 0) {return 0}
    const authorbyblogs = lodash.countBy(blogs, "author")
    const mostblogs = lodash.maxBy(lodash.keys(authorbyblogs).map(author =>({
        author,
        blogs: authorbyblogs[author],
    })), "blogs")
    
    return mostblogs
}

const mostLikes = (blogs) =>  {
    if (blogs.length === 0) {return 0}
    const likesbyauthor = lodash.mapValues(lodash.groupBy(blogs, "author"), a_blogs =>
        lodash.sumBy(a_blogs, "likes"))
    const mostlikes = lodash.maxBy(lodash.keys(likesbyauthor).map(author =>({
        author,
        likes: likesbyauthor[author],
    })), "likes")
    
    return mostlikes
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    }