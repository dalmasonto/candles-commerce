import { Paper, Title, Button, Text, Card, useMantineTheme, Group, Stack, Anchor, Image } from "@mantine/core";
import classes from '@/styles/article-card.module.css'
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import Link from "next/link";
interface CardProps {
  id: any
  slug: any
  image: string;
  title: string;
  categories: any;
}

function ArticleCard({ id, slug, image, title, categories }: CardProps) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="lg"
      style={{
        background: `url(${image}) center center / cover no-repeat fixed, linear-gradient(0deg, rgb(7 30 4 / 84%), rgb(0 0 0 / 28%))`,
        backgroundBlendMode: 'multiply',
      }}
      className={classes.card}
    >
      <Stack>
        <Group>
          {
            categories?.map((cat: any, i: number) => (
              <Text key={`cat_${i}_${cat.id}`} className={classes.category} size="xs">
                {cat?.title}
              </Text>
            ))
          }
        </Group>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </Stack>
      <Anchor component={Link} href={`/articles/${id}/${slug}`}>
        <Button variant="white" color="dark">
          Read article
        </Button>
      </Anchor>
    </Paper>
  );
}


export const SidebarArticleCard = ({ id, slug, image, title, categories }: CardProps) => {
  return (
    <Anchor component={Link} href={`/articles/${id}/${slug}`}>
      <Card radius={'md'}>
        <Group wrap="nowrap" >
          <Image src={image} radius={'md'} w={'80px'} />
          <Title size={'md'} order={3} fw={500}>{title}</Title>
        </Group>
      </Card>
    </Anchor>
  )
}



interface ILandingPageArticles {
  articles: any[]
}


function LandingPageArticles(props: ILandingPageArticles) {
  const { articles } = props
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = articles?.map((item: any) => (
    <Carousel.Slide key={item.title}>
      <ArticleCard {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize={{ base: '100%', sm: '50%' }}
      slideGap={{ base: 'xl', sm: 2, md: 50 }}
      align="start"
      slidesToScroll={mobile ? 1 : 2}
    >
      {slides}
    </Carousel>
  );
}

export { ArticleCard }

export default LandingPageArticles