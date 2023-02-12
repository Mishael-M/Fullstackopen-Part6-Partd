import { useMutation, useQuery, useQueryClient } from 'react-query';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { getAnecdotes, updateAnecdote } from './request';
import { useNotificationDispatch } from './NotificationContext';

const App = () => {
  const queryClient = useQueryClient();

  const dispatch = useNotificationDispatch();

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes');
      queryClient.setQueryData(
        'anecdotes',
        anecdotes.map((anecdote) => {
          if (anecdote.id === updatedAnecdote.id) {
            anecdote = updatedAnecdote;
          }
          return anecdote;
        })
      );

      dispatch({
        type: 'NOTIFY',
        notification: `Voted for anecdote "${updatedAnecdote.content}"`,
      });
      setTimeout(() => {
        dispatch({
          type: 'EMPTY',
        });
      }, 5000);
    },
  });

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: ++anecdote.votes });
    console.log('vote');
  };
  const result = useQuery('anecdotes', getAnecdotes, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (result.isLoading) {
    return <span>Loading...</span>;
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }
  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
