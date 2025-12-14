import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { getServerStatus, startServer, stopServer } from "./api";

export default function App() {
  const [serverStatus, setServerStatus] = useState<
    "online" | "offline" | "starting"
  >("offline");

  const [publicIp, setPublicIp] = useState<string | null>(null);

  const formattedIp = publicIp ? `${publicIp}:25565` : "Not Assigned";

  useEffect(() => {
    async function poll() {
      try {
        const data = await getServerStatus();

        setServerStatus(mapEC2StateToUI(data.instanceState));
        setPublicIp(data.publicIp || null);
      } catch (e) {
        console.error(e);
      }
    }

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartServer = async () => {
    setServerStatus("starting");
    await startServer();
  };

  const handleStopServer = async () => {
    await stopServer();
    setServerStatus("offline");
  };

  const statusLabel = {
    online: "Online",
    offline: "Offline",
    starting: "Starting…",
  };

  const statusColor = {
    online: "success",
    offline: "error",
    starting: "warning",
  } as const;

  function mapEC2StateToUI(state: string) {
    switch (state) {
      case "running":
        return "online";
      case "pending":
        return "starting";
      default:
        return "offline";
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#111" }}>
      {/* Top bar */}
      <AppBar
        position="static"
        sx={{
          background: "#1b1b1b",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Minecraft Dashboard</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={statusLabel[serverStatus]}
              color={statusColor[serverStatus]}
            />

            {/* PUBLIC IP CHIP */}
            <Chip
              label={`IP: ${formattedIp}`}
              sx={{ bgcolor: "#333", color: "white" }}
            />

            {serverStatus === "offline" && (
              <Button
                variant="contained"
                color="success"
                onClick={handleStartServer}
              >
                Start Server
              </Button>
            )}

            {serverStatus === "online" && (
              <Button
                variant="contained"
                color="error"
                onClick={handleStopServer}
              >
                Stop Server
              </Button>
            )}

            {serverStatus === "starting" && (
              <Button variant="contained" disabled>
                Starting...
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main dashboard */}
      <Box
        sx={{
          p: 4,
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* SECTION: SERVER OVERVIEW */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Server Overview
        </Typography>

        <Grid container spacing={3}>
          {/* Server Status Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                bgcolor: "#1c1c1c",
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Server Status
                </Typography>
                <Typography color="text.secondary">
                  Status: {statusLabel[serverStatus]}
                </Typography>

                {/* PUBLIC IP DISPLAY */}
                <Typography
                  color="text.secondary"
                  sx={{ userSelect: "text", cursor: "text" }}
                >
                  IP Address: {formattedIp}
                </Typography>

                <Typography color="text.secondary">
                  Uptime: Coming soon…
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Server Controls Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                bgcolor: "#1c1c1c",
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Server Controls
                </Typography>

                {serverStatus === "offline" && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleStartServer}
                  >
                    Start Server
                  </Button>
                )}

                {serverStatus === "online" && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleStopServer}
                  >
                    Stop Server
                  </Button>
                )}

                {serverStatus === "starting" && (
                  <Button variant="contained" disabled>
                    Starting...
                  </Button>
                )}

                <Typography sx={{ mt: 2 }} color="text.secondary">
                  Auto-stop timer: Coming soon…
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* SECTION: PLAYER INSIGHTS */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 1 }}>
          Player Insights
        </Typography>

        <Card
          sx={{
            bgcolor: "#1c1c1c",
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Players Online
            </Typography>
            <Typography color="text.secondary">
              0 players (mock data)
            </Typography>
          </CardContent>
        </Card>

        {/* FULL-WIDTH LEADERBOARD */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 1 }}>
          Leaderboard
        </Typography>

        <Card
          sx={{
            bgcolor: "#1c1c1c",
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          }}
        >
          <CardContent>
            <Typography color="text.secondary">Coming soon…</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
