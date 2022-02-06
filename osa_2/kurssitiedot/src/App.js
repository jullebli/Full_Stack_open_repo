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

  
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
    </div>
  )
}


/*
const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.parts[0].exercises 
      + props.parts[1].exercises + props.parts[2].exercises}</p>
    </div>
  )
}
*/

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