import {useQuery} from '@apollo/client';
import {GET_USER} from '../graphql/query';

export default function useGetUser(userId) {
  const {data: userData, refetch, loading} = useQuery(GET_USER, {
    variables: {id: userId},
  });
  return userData;
}
