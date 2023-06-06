import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const repositoryItemsStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

// Write your code here
class GithubPopularRepos extends Component {
  state = {
    apiStatus: repositoryItemsStatus.initial,
    repositoriesList: [],
    activeLanguageId: languageFiltersData[0].id,
  }

  componentDidMount() {
    this.getRepositories()
  }

  getRepositories = async () => {
    const {activeLanguageId} = this.state

    this.setState({apiStatus: repositoryItemsStatus.loading})
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageId}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.popular_repos.map(eachData => ({
        id: eachData.id,
        imageUrl: eachData.avatar_url,
        name: eachData.name,
        starsCount: eachData.stars_count,
        forksCount: eachData.forks_count,
        issuesCount: eachData.issues_count,
      }))
      this.setState({
        repositoriesList: updatedData,
        apiStatus: repositoryItemsStatus.success,
      })
    } else {
      this.setState({apiStatus: repositoryItemsStatus.failure})
    }
  }

  setActiveLanguageId = id => {
    this.setState({activeLanguageId: id}, this.getRepositories)
  }

  renderLanguageFilterItemsList = () => {
    const {activeLanguageId} = this.state

    return (
      <ul className="language-container">
        {languageFiltersData.map(eachData => (
          <LanguageFilterItem
            key={eachData.id}
            isActive={eachData.id === activeLanguageId}
            languageDetails={eachData}
            setActiveLanguageId={this.setActiveLanguageId}
          />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-containet">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-message">Something Went Wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderSuccessView = () => {
    const {repositoriesList} = this.state

    return (
      <ul className="repositories-list-container">
        {repositoriesList.map(eachRepository => (
          <RepositoryItem
            key={eachRepository.id}
            repositoryDetails={eachRepository}
          />
        ))}
      </ul>
    )
  }

  renderRepositories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case repositoryItemsStatus.loading:
        return this.renderLoadingView()
      case repositoryItemsStatus.failure:
        return this.renderFailureView()
      case repositoryItemsStatus.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1 className="heading">Popular</h1>
          {this.renderLanguageFilterItemsList()}
          {this.renderRepositories()}
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
