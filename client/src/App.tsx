import React from 'react';
import { SpotifyLogin } from './features/spotify/SpotifyLogin';
import { SpotifyInfo } from './features/spotify/SpotifyInfo';
import { Card, CardBody, Center, Box, Stack, StackDivider } from '@chakra-ui/react';

function App() {
  return (
    <Center h="300px">
      <Card>
        <CardBody>
          <Stack divider={<StackDivider />}>
            <Box>
              <SpotifyLogin />
            </Box>
            <Box>
              <SpotifyInfo />
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Center>
  );
}

export default App;
