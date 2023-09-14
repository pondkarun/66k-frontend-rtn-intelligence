import React from 'react'
import { useSelector } from 'react-redux'
import ManageInternationalRelationsTopics from '../manage-international-relations-topics'
import InternationalRelationsTopics from './CountryPage'

const Country = () => {
  const common = useSelector(({ common }) => common)

  return (
    <>
      {common.action === 'add' ? (
        <ManageInternationalRelationsTopics mode='add' />
      ) : (
        <InternationalRelationsTopics />
      )}
    </>
  )
}

export default Country
