import React, { Fragment } from 'react'

export default function FilterPanel(props) {
  const { name, onChangeName, schoolList, selectedSchools, onChangeSchools } = props

  return (
    <div>
      <div>
        <span>Name: </span>
        <input type="text" value={name} onChange={onChangeName} />
      </div>
      <div>
        <span>School: </span>
        <div className="scrollable-container">
          {schoolList.map((school) => (
            <Fragment>
              <input type='checkbox' value={selectedSchools[school]} onChange={onChangeSchools(school)} />
              {school} <br />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
