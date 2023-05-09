import React from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayName, selectProduct } from './spotifySlice';
import { Box, Text, VStack } from '@chakra-ui/react';

export function SpotifyInfo() {
  const displayName = useSelector(selectDisplayName);
  const product = useSelector(selectProduct);

  return (
    <VStack>
      {displayName && <Box>
        <Text>Logged in as: {displayName}</Text>
      </Box>}
      {product &&
        <Box>
          <Text>Subscription type: {product}</Text>
        </Box>
      }
    </VStack>
  );
}
