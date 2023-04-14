import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)

  const [requests, setRequests] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState({ show: false, msg: '' })

  const searchGithubUser = async (user) => {
    toggleError()

    setIsLoading(true)

    const response = await axios
      .get(`${rootUrl}/users/${user}`)
      .catch((err) => console.log(err))

    if (response) {
      setGithubUser(response.data)

      const {  followers_url, repos_url } = response.data

      await Promise.allSettled([
        axios.get(`${repos_url}?per_page=100`),
        axios.get(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results
          const status = 'fulfilled'
          if (repos.status === status) {
            setRepos(repos.value.data)
          }
          if (followers.status === status) {
            setFollowers(followers.value.data)
          }
        })
        .catch((err) => console.log(err))
    } else {
      toggleError(true, 'no user found with that username')
    }
    // console.log(response)
    checkRequests()
    setIsLoading(false)
  }

  //check rate
  const checkRequests = () => {
    axios
      .get(`${rootUrl}/rate_limit`)
      .then((response) => {
        let { remaining } = response.data.rate
        // console.log(remaining)
        setRequests(remaining)
        // console.log(response)
        if (remaining === 0) {
          // throw an error
          toggleError(true, 'Sorry, you have exceeded hourly rate limit')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const toggleError = (show = 'false', msg = '') => {
    setError({ show, msg })
  }

  useEffect(checkRequests, [])
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export { GithubProvider, GithubContext }
