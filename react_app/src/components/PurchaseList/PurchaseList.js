import React, { useEffect, useState } from "react";
import FormattedMoney from "../Formatted/FormattedMoney";
import FormmattedDate from "../Formatted/FormattedDate";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Copyright from "../Copyright/Copyright";
import Navigation from "../Navigation/Navigation";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Pagination } from "@mui/material";
import usePagination from "../Pagination/Pagination";

const PurchaseList = (props) => {
    const theme = createTheme();
    const navigate = useNavigate();
    const [state, setState] = useState(props);
    const [purchaseList, setPurchaseList] = useState([]);

    let [page, setPage] = useState(1);
    const PER_PAGE = 5;
    const count = Math.ceil(purchaseList.length / PER_PAGE);
    const _DATA = usePagination(purchaseList, PER_PAGE);

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    const fetchPurchaseList = () => {
        let list = [];
        fetch('http://localhost:8000/api/purchases')
            .then(res => res.json())
            .then((json) => {
                Promise.all(
                    json.map(
                        element => fetch('http://localhost:8000/api/statue/' + element.statue_id)
                            .then(res => res.json())
                    )

                ).then(datas => {
                    json.forEach((element, i) => {
                        list[i] = element
                        list[i].statue = datas[i]
                    })
                    setPurchaseList(list)
                })
            });
    }

    useEffect(() => {
        fetchPurchaseList();
    }, [])

    const handleDelete = (e, purchase) => {
        e.preventDefault();

        if (window.confirm('Delete this purchase with detail:\nName: ' + purchase.statue.name + '\nDate: ' + purchase.date_added)) {
            fetch('http://localhost:8000/api/purchase/' + purchase._id, { method: 'DELETE' })
                .then(() => {
                    setState({ status: 'Delete successful' });
                    window.location.reload();
                });
        }
    }

    const getTotal = () => {
        let total = 0;
        purchaseList.forEach((item) => {
            total += item.statue.price * item.quantity
        })
        return total;
    }

    const lists = _DATA.currentData().map((purchase) => (
        <TableRow
            key={purchase._id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell align="center">{purchase.statue.name}</TableCell>
            <TableCell align="center">{purchase.first_name+' '+purchase.last_name}</TableCell>
            <TableCell align="center"><FormattedMoney value={purchase.statue.price}/></TableCell>
            <TableCell align="center">{purchase.quantity}</TableCell>
            <TableCell align="center"><FormattedMoney value={purchase.statue.price * purchase.quantity}/></TableCell>
            <TableCell align="center"><FormmattedDate value={purchase.date_added} /></TableCell>
            <TableCell align="center">
                <Button onClick={(e) => { navigate('/purchaseDetail', { state: { purchase } }) }}>Update</Button>
                <Button onClick={(e) => { handleDelete(e, purchase) }}>Remove</Button>
            </TableCell>
        </TableRow>
    ));

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navigation />
            <Box sx={{
                bgcolor: 'background.paper',
                pt: 20,
                pb: 6,
                mx: 20
            }}>
                <TableContainer component={Paper} md={4}>
                    <Table size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Statue</TableCell>
                                <TableCell align="center">Buyer</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Total</TableCell>
                                <TableCell align="center">Date Purchased</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lists}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    count={count}
                    size="large"
                    page={page}
                    variant="outlined"
                    shape="rounded"
                    onChange={handleChange}
                />
                
                <Copyright />
            </Box>
            Total Order : <FormattedMoney value={getTotal()}/>
        </ThemeProvider>

    );
}
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
export default PurchaseList;