import React from 'react'

const Header = ({course}) => {
  return (
    <div>
      <h1>{course.name}</h1>
    </div>
  )
}

const Course = ({course}) => {

  const Content = ({course}) => {
    return (
      <div>
        {course.parts.map(part => 
          <Part key={part.id} part={part} />
        )}
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p>
          {props.part.name} {props.part.exercises}
        </p>
      </div>
    )
  }

  const Total = ({course}) => {
    let total = 0

    for (let i = 0; i < course.parts.length; i++) {
      total += course.parts[i].exercises
    }
    
    return (
      <div>
        <p><b>total of {total} exercises</b></p>
      </div>
    )
  }
  

  /*
  const Total = ({course}) => {
    const total = course.parts.reduce((sum, parts) =>
      sum + parts.exercises, 0)

    return (
      <div>
        <p><b>total of {total} exercises</b></p>
      </div>
    )
  }

  */
  
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App