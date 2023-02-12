import { useMutation, useQueryClient } from 'react-query';
import { createAnecdote } from '../request';
import { useNotificationDispatch } from '../NotificationContext';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();

  const dispatch = useNotificationDispatch();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes');
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote));
      dispatch({
        type: 'NOTIFY',
        notification: `Added anecdote "${newAnecdote.content}"`,
      });
    },
    onError: (error) => {
      dispatch({
        type: 'NOTIFY',
        notification: error.response.data.error,
      });
    },
    onSettled: () => {
      setTimeout(() => {
        dispatch({
          type: 'EMPTY',
        });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate({ content, votes: 0 });

    console.log('new anecdote');
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
