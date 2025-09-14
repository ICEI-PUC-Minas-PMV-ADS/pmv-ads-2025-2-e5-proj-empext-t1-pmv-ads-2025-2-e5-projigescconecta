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
      minHeight="100vh"
      bgcolor="#F6F6F7" // Cinza Claro – fundo neutro
      p={2}
    >
      <Box
        width="100%"
        maxWidth={400}
        bgcolor="#FFFFFF" // Branco – fundo principal
        boxShadow={3}
        borderRadius={2}
        p={4}
      >
        <Link
          component="button"
          onClick={() => alert("Simulação de voltar")}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            color: "#1E4EC4", // Azul Institucional Claro – links
            fontWeight: 500,
          }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} /> Voltar
        </Link>

        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          sx={{ color: "#264197" }} // Azul Institucional Escuro – título
        >
          Esqueci minha senha
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ color: "#656D77" }} // Cinza Escuro – texto secundário
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
              bgcolor: "#21AD53", // Verde Ação – botão de chamada
              color: "#FFFFFF", // Branco – texto do botão
              "&:hover": {
                bgcolor: "#1a9446", // tom mais escuro no hover
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
