import React from 'react'

export default function List(props) {
  const { students } = props

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Education</th>
          <th>Registered</th>
          <th>Incognito</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => {
          return (
            <tr key={student.id}>
              <td>{student.last_name}, {student.first_name}</td>
              <td>{student.education.map((edu) => `${edu.school}, ${edu.year}`).join('; ')}</td>
              <td>{student.registered ? '✓' : 'ⅹ'}</td>
              <td>{student.incognito ? '✓' : 'ⅹ'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )


}
