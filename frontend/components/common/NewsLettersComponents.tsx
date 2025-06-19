import { Title, Button, Text, Card, useMantineTheme, Image, Box, Stack, Anchor, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import { IconArrowRight } from "@tabler/icons-react";
interface CardProps {
  image: string;
  title: string;
  description: string;
  link: string
}

function NewsLetterCard({ image, title, description, link }: CardProps) {
  return (
    <Card radius={'lg'}>
      <Stack>
        <Box h={'300px'}>
          <Image src={image} h={'100%'} radius={'lg'} />
        </Box>
        <Stack>
          <Title order={3} lineClamp={2} lh={'26px'} h={'52px'}>{title}</Title>
          <Text lineClamp={4} lh={'22px'} h={'88px'}>
            {description}
          </Text>
          <Group justify="end" mt={'md'}>
            <Anchor href={link} target="blank">
              <Button variant="filled" color="dark" radius={'md'} rightSection={<IconArrowRight />}>
                Read Newsletter
              </Button>
            </Anchor>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}


interface INewsletters {
  newsletters: any[]
}


function NewsLetters(props: INewsletters) {
  const { newsletters } = props
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = newsletters.map((item: any) => (
    <Carousel.Slide key={item.title}>
      <NewsLetterCard {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize={{ base: '100%', sm: '50%', md: '33.33%' }}
      slideGap={{ base: 'xl', sm: 2, md: 10 }}
      align="start"
      slidesToScroll={mobile ? 1 : 2}
    >
      {slides}
    </Carousel>
  );
}

export { NewsLetterCard }

export default NewsLetters