import { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      alert(`Simulação: e-mail enviado para ${email}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#F6F6F7" 
    >
      <Box
        width="100%"
        maxWidth={400}
        bgcolor="#FFFFFF" 
        boxShadow={3}
        borderRadius={2}
        p={4}
      >
        <Link
          component="button"
          onClick={() => window.location.href = '/login'}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            color: "#1E4EC4", 
            fontWeight: 500,
          }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} /> Voltar
        </Link>

        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          sx={{ color: "#264197" }} 
        >
          Esqueci minha senha
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ color: "#656D77" }} 
        >
          Insira o seu endereço de e-mail ou o seu login de acesso associado à sua conta na plataforma.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Digite seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              mt: 2,
              bgcolor: "#21AD53", 
              color: "#FFFFFF", 
              "&:hover": {
                bgcolor: "#1a9446", 
              },
            }}
          >
            {loading ? "Enviando..." : "Continuar"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
