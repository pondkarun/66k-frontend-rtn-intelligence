import React, { useState } from 'react'
import ManageInternationalRelationsTopics from '../manage-international-relations-topics'
import InternationalRelationsTopics from './CountryPage'

export type ActionTprops = 'add' | ''

const Country = () => {
  const [action, setAction] = useState<ActionTprops>('')
  return (
    <>
      {action === 'add' ? (
        <ManageInternationalRelationsTopics mode='add' setActiontype={setAction} />
      ) : (
        <InternationalRelationsTopics setActiontype={setAction} />
      )}
    </>
  )
}

export default Country
