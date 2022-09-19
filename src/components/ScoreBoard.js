import React from 'react'

const ScoreBoard = ({score}) => {
  return (
    <div className='score-borad'>
        <h2>{score}</h2>
    </div>
  )
}

export default ScoreBoard