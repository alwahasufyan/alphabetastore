import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

import { fetchPublicServices } from "utils/services";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Services - Alphabeta",
  description: "Browse Alphabeta services and submit requests from your dashboard."
};

export default async function ServicesPage() {
  const services = await fetchPublicServices();

  return <Container sx={{
    py: 4
  }}>
      <Typography variant="h3" sx={{
      mb: 2
    }}>Services</Typography>

      <Typography color="text.secondary" sx={{
      mb: 3
    }}>
        Browse available services. To submit a request, open your customer dashboard at /service-requests.
      </Typography>

      {services.length ? <Stack spacing={2}>
          {services.map(service => <Card key={service.id} variant="outlined" sx={{
        p: 2
      }}>
              <Typography variant="h6">{service.name}</Typography>
              {service.basePrice !== null ? <Typography variant="body2" color="text.secondary" sx={{
          mt: 0.5
        }}>Base price: {service.basePrice}</Typography> : null}
              <Typography variant="body2" color="text.secondary" sx={{
          mt: 1
        }}>{service.description}</Typography>
            </Card>)}
        </Stack> : <Card variant="outlined" sx={{
      p: 3
    }}>
          <Typography color="text.secondary">No services are available right now.</Typography>
        </Card>}
    </Container>;
}
