import React from 'react'

interface Props {
  serviceId?: string
}

const Files = ({ serviceId }: Props) => {
  return <h1>{serviceId}</h1>
}

export default Files
