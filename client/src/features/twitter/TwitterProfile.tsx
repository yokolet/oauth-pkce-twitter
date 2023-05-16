import React from 'react';
import { useSelector } from 'react-redux';
import { selectName, selectUsername } from './twitterSlice';
import { Box, Text, VStack } from '@chakra-ui/react';

export function TwitterProfile() {
  const name = useSelector(selectName);
  const username = useSelector(selectUsername);

  return (
    <VStack>
      {name && <Box>
        <Text>Logged in as: {name}</Text>
      </Box>}
      {username &&
        <Box>
          <Text>Username: {username}</Text>
        </Box>
      }
    </VStack>
  );
}
