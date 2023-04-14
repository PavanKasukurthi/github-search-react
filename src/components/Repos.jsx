import React from 'react'
import styled from 'styled-components'
import { GithubContext } from '../context/context'
import {  Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts'
import { useContext } from 'react'
const Repos = () => {
  const { repos } = useContext(GithubContext)

  // console.log(repos)

  const languages = repos.reduce((total, item) => {
    // console.log(item)
    const { language, stargazers_count } = item
    if (!language) return total
    // console.log(language)
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count }
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      }
    }
    return total
  }, {})

  // console.log(languages);

  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value
    })
    .slice(0, 5) //converts Object into array

  //most stars per langugage

  const mostStars = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars
    })
    .map((item) => {
      return { ...item, value: item.stars }
    })
  // console.log(mostStars)

  //stars & forks

  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item
      total.stars[stargazers_count] = { label: name, value: stargazers_count }

      total.forks[forks] = { label: name, value: forks }
      return total
    },
    {
      stars: {},
      forks: {},
    }
  )

  // console.log(stars)

  stars = Object.values(stars).slice(-5).reverse()
  forks = Object.values(forks).slice(-5).reverse()

  // const chartData = [
  //   {
  //     label: 'HTML',
  //     value: '10',
  //   },
  //   {
  //     label: 'CSS',
  //     value: '20',
  //   },
  //   {
  //     label: 'JavaScript',
  //     value: '70',
  //   },
  // ]

  return (
    <section className="section">
      <Wrapper className="section-center">
        {/* <ExampleChart data={chartData} /> */}
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        {/* <div></div> */}
        <Doughnut2D data={mostStars} />
        {/* <div></div> */}
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  )
}

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`

export default Repos
