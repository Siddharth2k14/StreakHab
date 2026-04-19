import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "../../styles/HomePage/homepage.module.css";
import AnimatedBackground from "../../components/AnimatedBackground/AnimatedBackground";

const btnSx = {
    width: "100%",
    py: 1.2,
    borderRadius: "8px",
    background: "linear-gradient(135deg, #7c6af7, #5b4fcf)",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    textTransform: "none",
    "&:hover": { background: "linear-gradient(135deg, #6a58e0, #4a3fbf)" },
};

export default function HomePage() {
    return (
        <Box className={styles["main-box"]}>
            <AnimatedBackground />
            <Typography
                variant="h3"
                className={styles.title}
                sx={{ color: "white", fontWeight: 700, textAlign: "center" }}
            >
                Welcome to StreakGrid
            </Typography>

            <Box className={styles["card-group"]}>
                {/* Login */}
                <Card
                    className={styles.card}
                    style={{ "--delay": "0.2s" } as React.CSSProperties}
                >
                    <CardContent sx={{ p: 0, width: "100%", textAlign: "center" }}>
                        <Typography sx={{ color: "#aaa", mb: 2, mt: 1, fontSize: 14 }}>
                            Already have an account?
                        </Typography>
                        <Link to="/auth/login" className={styles.link}>
                            <Button sx={btnSx}>Login</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Register */}
                <Card
                    className={styles.card}
                    style={{ "--delay": "0.4s" } as React.CSSProperties}
                >
                    <CardContent sx={{ p: 0, width: "100%", textAlign: "center" }}>
                        <Typography sx={{ color: "#aaa", mb: 2, mt: 1, fontSize: 14 }}>
                            New here? Join us today.
                        </Typography>
                        <Link to="/auth/register" className={styles.link}>
                            <Button sx={btnSx}>Register</Button>
                        </Link>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
