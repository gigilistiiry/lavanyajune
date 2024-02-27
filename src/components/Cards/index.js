import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { data } from '../Data';

export default function ImgMediaCard() {
  return (
    <Paper elevation={9} sx={{ padding: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {data?.map((val, idx) => {
        return (
          <Card sx={{ maxWidth: 345, margin: 1, padding: 0 }} key={idx}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image={val?.img}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {val?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {val?.desc}
              </Typography>
            </CardContent>
            <CardActions>
              <a
                rel='noreferrer'
                href={val?.url}
                target='_blank'
                style={{
                  color: '#000',
                  textDecoration: 'none'
                }}
              >
                Lihat Cerita
              </a>
            </CardActions>
          </Card>
        );
      })}
    </Paper>
  );
}