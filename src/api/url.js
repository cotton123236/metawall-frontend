const { VITE_API_URL } = import.meta.env

const url = {
  user: `${VITE_API_URL}/users`,
  post: `${VITE_API_URL}/posts`
}

export default url