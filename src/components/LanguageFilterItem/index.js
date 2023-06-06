// Write your code here

import './index.css'

const LanguageFilterItem = props => {
  const {languageDetails, isActive, setActiveLanguageId} = props
  const {id, language} = languageDetails
  const buttonStyle = isActive ? 'language-btn active-btn' : 'language-btn'

  const onClickButton = () => {
    setActiveLanguageId(id)
  }

  return (
    <li>
      <button type="button" onClick={onClickButton} className={buttonStyle}>
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
