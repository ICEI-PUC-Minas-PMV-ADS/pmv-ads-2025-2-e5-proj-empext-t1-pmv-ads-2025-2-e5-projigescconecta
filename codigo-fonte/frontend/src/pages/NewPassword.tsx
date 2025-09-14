import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

export default function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) {
      return alert("Preencha todos os campos.");
    }
    if (password !== confirm) {
      return alert("As senhas não coincidem.");
    }

    try {
      setLoading(true);
      // 🔗 Substitua pela rota real do backend quando pronta
      await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, {
        email,
        password,
      });
      alert("Senha alterada com sucesso!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={2}
    >
      <Box width="100%" maxWidth={400}>
        <Link
          component="button"
          onClick={() => navigate(-1)}
          sx={{ display: "flex", alignItems: "center", mb: 3 }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} /> Voltar
        </Link>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Nova senha
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            label="Digite sua nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Confirme sua senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="success"
            type="submit"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Alterando..." : "Alterar"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
