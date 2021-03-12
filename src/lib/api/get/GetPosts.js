import { get, getId, getQuery, firestore } from 'firebase_config'
import _ from 'lodash'

export const getPosts = async (currentUser, type = 'all', data = {}) => {
  let posts = []
  if (type === 'id') {
    if (data.post) return data.post
    posts = await getId('posts', data.id)
    posts.id = data.id
    return posts
  }

  if (type === 'selectedUser') {
    posts = await getQuery(
      firestore.collection('posts').where('userId', '==', currentUser.id).get()
    )
  } else if (type === 'trending') {
    posts = await getQuery(
      firestore.collection('posts').where('followersCount', '>', 0).orderBy('followersCount', 'desc').limit(3).get()
    )
  } else {
    posts = await get('posts')
    // posts = posts.map(async (post) => {
    //   post["user"] = await getId("users", post.userId);
    //   return post;
    // });
  }

  if (data.sort === 'oldest') {
    posts = posts.sort((a, b) => a.createdAt - b.createdAt)
  } else if (data.sort === 'category_desc') {
    posts = _.sortBy(posts, [
      o => o.category.title,
      o => o.createdAt
    ]).reverse()
  } else if (data.sort === 'category_asc') {
    posts = _.sortBy(posts, [
      o => o.category.title,
      o => o.createdAt
    ])
  } else {
    // posts = posts.sort((a,b) => b.createdAt - a.createdAt);
  }
  return posts
}
