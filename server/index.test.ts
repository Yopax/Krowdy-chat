import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import MyComponent from './MyComponent';
import { MY_QUERY } from './queries';

test('hello world!', () => {
  const mocks = [
    {
      request: {
        query: MY_QUERY,
      },
      result: {
        data: {
          myData: 'Hello World',
        },
      },
    },
  ];

  const { getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MyComponent />
    </MockedProvider>
  );

  expect(getByText('Hello World')).toBeInTheDocument();
});