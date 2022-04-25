import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from '../Footer/Footer';
import Navigation from '../Navigation/Navigation';

import { useNavigate } from 'react-router-dom';
import FormattedMoney from '../Formatted/FormattedMoney';

const Home = (props) => {
    const [state, setState] = useState(props);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFigures();
    }, [])

    const fetchFigures = () => {
        fetch("http://localhost:8000/api/statues")
            .then(res => res.json())
            .then((result) => {
                setItems(result)
            }, (error) => {
                setState({
                    isLoaded: false, error
                });
            });
    }

    const handlePurchase = (id) => {
        let i = items.findIndex(({ _id }) => _id === id);
        navigate('/purchase', {state:{purchase :{statue: items[i]}}});
    }

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navigation />
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 12,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Kongming Art
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            Simply Own
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            {/* <Button variant="contained">Main call to action</Button>
                            <Button variant="outlined">Secondary action</Button> */}
                        </Stack>
                    </Container>
                </Box>
                <Container maxWidth="lg">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {items.map((item) => (
                            <Grid item key={item._id} xs={12} sm={6} md={3}>
                                <Card
                                    sx={{ height: '500px', display: 'flex', flexDirection: 'column' }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            // 16:9
                                            padding: '5px',
                                            height: '300px'
                                        }}
                                        src={'/img/' + item.image}
                                        alt={item.description}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {item.name}
                                        </Typography>
                                        <Typography>
                                            {item.description}
                                        </Typography>
                                        <Typography gutterBottom variant="h6" component="h4">
                                           <FormattedMoney value={item.price} />
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={(e) => handlePurchase(item._id)}>Purchase</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            <Footer />
        </ThemeProvider>
    );
}

export default Home;