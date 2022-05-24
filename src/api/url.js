const { VITE_API_URL } = import.meta.env

const url  = {
  user: `${VITE_API_URL}/api/users`,
  post: `${VITE_API_URL}/api/posts`
}

export default url