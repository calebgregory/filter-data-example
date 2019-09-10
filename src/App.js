import React, { Component } from 'react';
import './App.css';

import List from './components/List'
import FilterPanel from './components/FilterPanel'

const DATA_URL = 'https://next.json-generator.com/api/json/get/4yTXodD4P'

// filter functions for each of the fields you want to filter on
function getDisplayItems(allItems, filterOptionValues) {
  return allItems
    .filter((item) => {
      const filterByName = filterOptionValues.name.toLowerCase()

      return item.first_name.toLowerCase().indexOf(filterByName) === 0 ||
        item.last_name.toLowerCase().indexOf(filterByName) === 0
    })
    .filter((item) => {
      const { schools } = filterOptionValues

      // if schools is empty object, pass through
      if (Object.keys(schools).length === 0) {
        return true
      }

      return item.education
        .map((edu) => edu.school)
        .reduce((acc, school) => acc || !!schools[school], false)
    })
}

// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

// dyuamically gets school options from items
function getSchoolOptions(allItems) {
  return allItems
    .map((item) => item.education)
    .reduce((acc, edu) => acc.concat(edu), [])
    .map((edu) => edu.school)
    .filter(onlyUnique)
}

class App extends Component {
  state = {
    isLoading: false,

    allItems: [],
    displayItems: [],

    dynamicFilterOptions: {
      schools: []
    },

    filterOptionValues: {
      name: '',
      schools: {}, // "set" { schoolName: true }
      registered: false,
      incognito: false,
    },
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    fetch(DATA_URL)
      .then((resp) => {
        return resp.json()
      })
      .then((allItems) => {
        const schools = getSchoolOptions(allItems)

        this.setState({
          isLoading: false,
          allItems,
          displayItems: allItems,
          dynamicFilterOptions: {
            schools,
          },
        })
      })
  }

  onChange = (field) => (event) => {
    // https://reactjs.org/docs/forms.html#controlled-components
    const { value } = event.target

    this.setState((state) => {
      const newFilterOptionValues = {
        ...state.filterOptionValues,
        [field]: value,
      }

      const newDisplayItems = getDisplayItems(state.allItems, newFilterOptionValues)

      return {
        filterOptionValues: newFilterOptionValues,
        displayItems: newDisplayItems,
      }
    })
  }

  onChangeSchools = (school) => (_event) => {
    this.setState((state) => {
      const { filterOptionValues: { schools } } = state
      const nextSchools = Object.apply(schools)

      if (schools[school]) {
        delete nextSchools[school]
      } else {
        nextSchools[school] = true
      }

      const newFilterOptionValues = {
        ...state.filterOptionValues,
        schools: nextSchools
      }

      const newDisplayItems = getDisplayItems(state.allItems, newFilterOptionValues)

      return {
        filterOptionValues: newFilterOptionValues,
        displayItems: newDisplayItems,
      }
    })
  }

  render() {
    const { isLoading } = this.state

    if (isLoading) {
      return <p>loading...</p>
    }

    const { displayItems, filterOptionValues, dynamicFilterOptions } = this.state

    return (
      <div className="App">
        <FilterPanel
          name={filterOptionValues.name}
          onChangeName={this.onChange('name')}
          schoolList={dynamicFilterOptions.schools}
          selectedSchools={filterOptionValues.schools}
          onChangeSchools={this.onChangeSchools}
          registered={filterOptionValues.registered}
          onChangeRegistered={this.onChange('registered')}
          incognito={filterOptionValues.incognito}
          onChangeIncognito={this.onChange('incognito')}
        />
        <List students={displayItems} />
      </div>
    )
  }
}

export default App
