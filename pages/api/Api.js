// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

// export const getStaticProps = async() => {
//   const client = new ApolloClient({
//     uri: "http://localhost:4000/graphql",
//     cache: new InMemoryCache()
//   })
//   const { data } = await client.query({
//     query: gql`
//     query{
//        getAll 
//        {
//          id
//          Name
//          Email
//          Phone
//          Dob
//          Subjects
//        }
//      }
//     `
//   })
//   console.log('data', data );
//   return {
//     props: { data : data.getAll }
//   }
// }

export const getAll = gql`
query{
    getAll 
    {
    id
    Name
    Email
    Phone
    Dob
    Subjects
    }
}
`

export const updateSubjectQuery = gql`
  mutation updateSubject( $id: String , $Subjects: [String] ){
    updateSubject( post: { id: $id, Subjects: $Subjects } ){
      id
      Name
      Email
      Phone
      Dob
      Subjects
    }
  }
`

export const createQuery = gql`
  mutation createPost( $Name: String, $Email: String, $Phone: String, $Dob: String, $Subjects: [String] ){
    createPost( post: { Name : $Name, Subjects: $Subjects, Email: $Email, Phone: $Phone, Dob: $Dob } ){
      id
      Name
      Email
      Phone
      Dob
      Subjects
    }
  }
`

export const deleteQuery = gql`
  mutation deletePost( $id: String ){
    deletePost( id: $id )
  }
`