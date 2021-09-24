(() => {
  const plagiarismCheckerForm = document.querySelector('#plagiarismCheckerForm')
  const sensitivitySlider = document.querySelector('#sensitivity')
  const sensitivityPercentage = document.querySelector('#sensitivityPercentage')
  const resultsContainer = document.querySelector('#resultsContainer')
  const resultsTableBody = document.querySelector('#resultsTableBody')
  const noResultsContainer = document.querySelector('#noResults')

  const handleFormSubmission = event => {
    event.preventDefault()

    resultsContainer.style.display = 'none'

    fetch('/api/search', {
      method: 'POST',
      body: new FormData(plagiarismCheckerForm),
    })
      .then(response => response.json())
      .then(generateResultsTable)
      .catch((error) => {
        console.error(error)
        alert('Whoops! Something went wrong while searching.')
      })
  }

  const generateResultsTable = data => {
    const tableBodyContent = data.reduce((output, item) => {
      output += `<tr><td class="titleColumn">${item.title}</td><td class="publicationColumn">${item.publication}</td><td class="scoreColumn">${(item.score * 100).toFixed(2)}%</td></tr>`
      return output
    }, '')

    resultsTableBody.innerHTML = tableBodyContent

    const sliderValue = sensitivitySlider.value
    showTableRowsAboveSpecifiedPercentage(sliderValue)

    resultsContainer.style.display = 'block'
  }

  const handleSliderChange = event => {
    const sliderValue = event.target.value

    updateSliderDisplayValue(sliderValue)
    showTableRowsAboveSpecifiedPercentage(sliderValue)
  }

  const updateSliderDisplayValue = sliderValue => {
    sensitivityPercentage.textContent = sliderValue
  }

  const showTableRowsAboveSpecifiedPercentage = sliderValue => {
    const tableRowMatchScores = document.querySelectorAll('td.scoreColumn')

    tableRowMatchScores.forEach(
      scoreCell => showTableRowAboveSpecifiedPercentage(scoreCell, sliderValue)
    )

    const visibleTableRows = document.querySelectorAll('#resultsTableBody tr:not(.hidden)')

    if (visibleTableRows.length > 0) {
      noResultsContainer.classList.add('hidden')
    } else {
      noResultsContainer.classList.remove('hidden')
    }
  }

  const showTableRowAboveSpecifiedPercentage = (scoreCell, sliderValue) => {
    const score = Number(scoreCell.textContent.replace('%', ''))
    const tableRow = scoreCell.parentElement

    if (score > sliderValue) {
      tableRow.classList.remove('hidden')
    } else {
      tableRow.classList.add('hidden')
    }
  }

  plagiarismCheckerForm.addEventListener('submit', handleFormSubmission)
  sensitivitySlider.addEventListener('input', handleSliderChange)
})()
