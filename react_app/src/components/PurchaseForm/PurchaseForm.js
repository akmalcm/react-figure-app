import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../Copyright/Copyright';
import { Card, CardMedia, CardContent } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import FormattedMoney from '../Formatted/FormattedMoney';

const PurchaseForm = () => {
    const theme = createTheme();
    const [purchase, setPurchase] = useState(null);
    const { state } = useLocation();
    const navigate = useNavigate();

    const item = state.purchase;
    useEffect(() => {
        if (purchase) {
            const requestOptions = {
                method: state.status,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(purchase)
            };

            let url = state.status === 'POST'?"http://localhost:8000/api/purchase":"http://localhost:8000/api/purchase/"+purchase._id;

            fetch(url, requestOptions)
                .then(res => res.json())
                .then((result) => {
                    alert('Process success.');

                    state.status === 'POST' ? navigate('/') : navigate('/purchases');

                }, (error) => {
                    setPurchase(null)
                    alert('Purchased Failed');
                }); 

        }
    }, [purchase, navigate, state.status]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if(!item.date_added){
            state.status = 'POST'
        }else{
            state.status = 'PUT'
        }
        
        setPurchase({
            _id: item._id,
            statue_id: item.statue._id,
            quantity: data.get('quantity'),
            first_name: data.get('first_name'),
            last_name: data.get('last_name'),
            email: data.get('email'),
            address: data.get('address'),
            postcode: data.get('postcode'),
            city: data.get('city'),
            state: data.get('state'),
        });
    };

    const handleChangeQty = (e) => {
        if (!parseInt(e.target.value)) {
            e.target.value = 1
        }
        if (e.target.value < 0) {
            e.target.value = 1
        }
        if (e.target.value > 5) {
            e.target.value = 5
            return
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Navigation />
                <Box
                    sx={{
                        marginTop: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LocalGroceryStoreIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Purchase
                    </Typography>
                    <Box component="form" noValidate={false} onSubmit={handleSubmit}>
                        <Grid item xs={12} sm={6} md={3} sx={{ m: 4 }}>
                            <Card
                                sx={{ height: 'fit-content', display: 'flex', flexDirection: 'column' }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        // 16:9
                                        padding: '5px',
                                        height: '100%'
                                    }}
                                    src={'/img/' + item.statue.image}
                                    alt={item.statue.description}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {item.statue.name}
                                    </Typography>
                                    <Typography>
                                        {item.statue.description}
                                    </Typography>
                                    <Typography sx={{ mt: 2 }}>
                                        RM<FormattedMoney value={item.statue.price} />
                                    </Typography>
                                </CardContent>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="quantity"
                                        required
                                        fullWidth
                                        type="number"
                                        id="quantity"
                                        label="Quantity"
                                        inputProps={{ inputMode: 'numeric', min: 1, max: 5 }}
                                        defaultValue={item.quantity??1}
                                        onChange={(e) => { handleChangeQty(e) }}
                                    />
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="first_name"
                                    required
                                    fullWidth
                                    id="first_name"
                                    label="First Name"
                                    autoFocus
                                    defaultValue={item.first_name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="last_name"
                                    label="Last Name"
                                    name="last_name"
                                    autoComplete="family-name"
                                    defaultValue={item.last_name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    defaultValue={item.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="address"
                                    label="Address"
                                    type="text"
                                    id="address"
                                    autoComplete="address"
                                    defaultValue={item.address}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="city"
                                    label="City"
                                    type="text"
                                    id="city"
                                    autoComplete="city"
                                    defaultValue={item.city}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="postcode"
                                    label="Postcode"
                                    name="postcode"
                                    autoComplete="postcode"
                                    defaultValue={item.postcode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="state"
                                    label="State"
                                    name="state"
                                    autoComplete="state"
                                    defaultValue={item.state}
                                />
                            </Grid>
                        </Grid>
                        {item.date_added ? <Button type="submit" sx={{ mt: 3, mb: 5 }}>Edit</Button>:<Button type="submit" sx={{ mt: 3, mb: 5 }}>Purchase</Button>}
                        
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}

export default PurchaseForm;