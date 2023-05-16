import React from 'react';
import { Card, CardBody, Center, Box, Stack, StackDivider } from '@chakra-ui/react';
import { TwitterLogin } from './features/twitter/TwitterLogin';
import { TwitterProfile } from './features/twitter/TwitterProfile';

function App() {
  return (
    <Center h="300px">
      <Card>
        <CardBody>
          <Stack divider={<StackDivider />}>
            <Box>
              <TwitterLogin />
            </Box>
            <Box>
              <TwitterProfile />
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Center>
  );
}

export default App;
