import './App.css'
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const query = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      completed 
      userId {
        id
        name
      }
    }
  }
`

function App() {
  const {data, loading} = useQuery(query)
  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      {JSON.stringify(data)}
    </>
  )
}

export default App
