import React from 'react'

const Course = ({course}) => {

  const Header = ({course}) => {
    return (
      <div>
        <font size="+2"><b>{course.name}</b></font>
    </div>
    )
  }
  
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
  
    /*
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
    */
  
  const Total = ({course}) => {
    const total = course.parts.reduce((sum, parts) =>
      sum + parts.exercises, 0)
  
    return (
      <div>
        <p><b>total of {total} exercises</b></p>
      </div>
    )
  }
  
    
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}
  
export default Course