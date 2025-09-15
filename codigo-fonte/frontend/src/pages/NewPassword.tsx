import { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function NovaSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaSenha || !confirmacao) return;
    if (novaSenha !== confirmacao) {
      alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      alert("Simulação: senha alterada com sucesso!");
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
      bgcolor="#F6F6F7" 
      p={2}
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
          onClick={() => alert("Simulação de voltar")}
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
          Nova senha
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Digite sua nova senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirme sua senha"
            type="password"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
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
            {loading ? "Alterando..." : "Alterar"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
